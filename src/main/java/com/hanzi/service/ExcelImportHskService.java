package com.hanzi.service;

import com.hanzi.dto.ImportResult;
import com.hanzi.model.Carta;
import com.hanzi.repository.CartaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelImportHskService {

    private final CartaRepository cartaRepository;

    @Transactional
    public ImportResult importFromExcel(MultipartFile file) throws IOException {
        int created = 0, updated = 0, errors = 0;
        List<String> errorDetails = new ArrayList<>();

        try (XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream())) {
            XSSFSheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();

            // Fila 0 = encabezado, empezar desde fila 1
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                XSSFRow row = sheet.getRow(i);
                if (row == null) continue;

                int excelRow = i + 1;

                // Columnas: hanzi | pinyin | traduccion | hsk_nivel | categoria
                String hanzi       = getCellValue(formatter, row, 0);
                String pinyin      = getCellValue(formatter, row, 1);
                String traduccion  = getCellValue(formatter, row, 2);
                String hskNivelStr = getCellValue(formatter, row, 3);
                String categoria   = getCellValue(formatter, row, 4);

                // Saltar filas completamente vacías
                if (hanzi.isEmpty() && pinyin.isEmpty() && traduccion.isEmpty() && hskNivelStr.isEmpty()) {
                    continue;
                }

                // Validar campos obligatorios
                List<String> rowErrors = new ArrayList<>();
                if (hanzi.isEmpty())       rowErrors.add("campo 'hanzi' vacío");
                if (pinyin.isEmpty())      rowErrors.add("campo 'pinyin' vacío");
                if (traduccion.isEmpty())  rowErrors.add("campo 'traduccion' vacío");
                if (hskNivelStr.isEmpty()) rowErrors.add("campo 'hsk_nivel' vacío");
                if (categoria.isEmpty())   rowErrors.add("campo 'categoria' vacío");

                if (!rowErrors.isEmpty()) {
                    errorDetails.add("Fila " + excelRow + ": " + String.join(", ", rowErrors));
                    errors++;
                    continue;
                }

                // Parsear hsk_nivel
                int hskNivel;
                try {
                    hskNivel = (int) Double.parseDouble(hskNivelStr);
                } catch (NumberFormatException e) {
                    errorDetails.add("Fila " + excelRow + ": 'hsk_nivel' no es un número válido (" + hskNivelStr + ")");
                    errors++;
                    continue;
                }

                // Upsert por (hanzi, hsk_nivel) — NUNCA toca carta_estado
                Optional<Carta> existente = cartaRepository.findByHanziAndHskNivel(hanzi, hskNivel);
                if (existente.isPresent()) {
                    Carta carta = existente.get();
                    carta.setPinyin(pinyin);
                    carta.setTraduccion(traduccion);
                    carta.setCategoria(categoria);
                    carta.setTipo("HSK");
                    cartaRepository.save(carta);
                    updated++;
                } else {
                    Carta carta = new Carta();
                    carta.setHanzi(hanzi);
                    carta.setPinyin(pinyin);
                    carta.setTraduccion(traduccion);
                    carta.setHskNivel(hskNivel);
                    carta.setCategoria(categoria);
                    carta.setTipo("HSK");
                    carta.setLeccion(null);
                    cartaRepository.save(carta);
                    created++;
                }
            }
        }

        log.info("Importación HSK completada: {} creadas, {} actualizadas, {} errores", created, updated, errors);
        return ImportResult.builder()
                .created(created)
                .updated(updated)
                .errors(errors)
                .errorDetails(errorDetails)
                .build();
    }

    private String getCellValue(DataFormatter formatter, XSSFRow row, int col) {
        var cell = row.getCell(col, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
        if (cell == null) return "";
        return formatter.formatCellValue(cell).trim();
    }
}
