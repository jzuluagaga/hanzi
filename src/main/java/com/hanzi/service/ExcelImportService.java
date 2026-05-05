package com.hanzi.service;

import com.hanzi.dto.ImportResult;
import com.hanzi.model.Carta;
import com.hanzi.model.Leccion;
import com.hanzi.repository.CartaEstadoRepository;
import com.hanzi.repository.CartaRepository;
import com.hanzi.repository.LeccionRepository;
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
public class ExcelImportService {

    private final LeccionRepository leccionRepository;
    private final CartaRepository cartaRepository;
    private final CartaEstadoRepository cartaEstadoRepository;

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

                // Columnas: hanzi | pinyin | traduccion | leccion | image_url | audio_url
                String hanzi         = getCellValue(formatter, row, 0);
                String pinyin        = getCellValue(formatter, row, 1);
                String traduccion    = getCellValue(formatter, row, 2);
                String leccionNombre = getCellValue(formatter, row, 3);
                String imageUrl      = getCellValue(formatter, row, 4);
                String audioUrl      = getCellValue(formatter, row, 5);

                // Saltar filas completamente vacías
                if (hanzi.isEmpty() && pinyin.isEmpty() && traduccion.isEmpty() && leccionNombre.isEmpty()) {
                    continue;
                }

                // Validar campos obligatorios
                List<String> rowErrors = new ArrayList<>();
                if (hanzi.isEmpty())         rowErrors.add("campo 'hanzi' vacío");
                if (pinyin.isEmpty())        rowErrors.add("campo 'pinyin' vacío");
                if (traduccion.isEmpty())    rowErrors.add("campo 'traduccion' vacío");
                if (leccionNombre.isEmpty()) rowErrors.add("campo 'leccion' vacío");

                if (!rowErrors.isEmpty()) {
                    errorDetails.add("Fila " + excelRow + ": " + String.join(", ", rowErrors));
                    errors++;
                    continue;
                }

                // Buscar o crear Leccion por nombre
                Leccion leccion = leccionRepository.findByNombre(leccionNombre)
                        .orElseGet(() -> {
                            int maxOrden = leccionRepository.findTopByOrderByOrdenDesc()
                                    .map(Leccion::getOrden)
                                    .orElse(0);
                            Leccion nueva = new Leccion();
                            nueva.setNombre(leccionNombre);
                            nueva.setOrden(maxOrden + 1);
                            return leccionRepository.save(nueva);
                        });

                // Upsert Carta — NUNCA toca carta_estado
                Optional<Carta> existente = cartaRepository.findByHanziAndLeccionId(hanzi, leccion.getId());
                if (existente.isPresent()) {
                    Carta carta = existente.get();
                    carta.setPinyin(pinyin);
                    carta.setTraduccion(traduccion);
                    carta.setHskNivel(null);
                    carta.setTipo("LIBRO");
                    if (!imageUrl.isEmpty()) carta.setImageUrl(imageUrl);
                    if (!audioUrl.isEmpty()) carta.setAudioUrl(audioUrl);
                    cartaRepository.save(carta);
                    updated++;
                } else {
                    Carta carta = new Carta();
                    carta.setHanzi(hanzi);
                    carta.setPinyin(pinyin);
                    carta.setTraduccion(traduccion);
                    carta.setHskNivel(null);
                    carta.setTipo("LIBRO");
                    carta.setLeccion(leccion);
                    if (!imageUrl.isEmpty()) carta.setImageUrl(imageUrl);
                    if (!audioUrl.isEmpty()) carta.setAudioUrl(audioUrl);
                    cartaRepository.save(carta);
                    created++;
                }
            }
        }

        log.info("Importación libro completada: {} creadas, {} actualizadas, {} errores", created, updated, errors);
        return ImportResult.builder()
                .created(created)
                .updated(updated)
                .errors(errors)
                .errorDetails(errorDetails)
                .build();
    }

    @Transactional
    public ImportResult replaceFromExcel(Long leccionId, MultipartFile file) throws IOException {
        if (!leccionRepository.existsById(leccionId)) {
            throw new IllegalArgumentException("Lección no encontrada con id: " + leccionId);
        }
        cartaEstadoRepository.deleteByCartaLeccionId(leccionId);
        cartaRepository.deleteByLeccionId(leccionId);
        return importFromExcel(file);
    }

    private String getCellValue(DataFormatter formatter, XSSFRow row, int col) {
        var cell = row.getCell(col, Row.MissingCellPolicy.RETURN_BLANK_AS_NULL);
        if (cell == null) return "";
        return formatter.formatCellValue(cell).trim();
    }
}
