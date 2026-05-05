package com.hanzi.controller;

import com.hanzi.dto.ImportResult;
import com.hanzi.service.ExcelImportHskService;
import com.hanzi.service.ExcelImportService;
import com.hanzi.service.LeccionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ExcelImportService excelImportService;
    private final ExcelImportHskService excelImportHskService;
    private final LeccionService leccionService;

    @PostMapping("/import")
    public ResponseEntity<?> importExcel(@RequestParam("file") MultipartFile file) {
        ResponseEntity<?> validation = validateXlsx(file);
        if (validation != null) return validation;

        try {
            ImportResult result = excelImportService.importFromExcel(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("mensaje", "Error al procesar el archivo: " + e.getMessage()));
        }
    }

    @PostMapping("/import-hsk")
    public ResponseEntity<?> importExcelHsk(@RequestParam("file") MultipartFile file) {
        ResponseEntity<?> validation = validateXlsx(file);
        if (validation != null) return validation;

        try {
            ImportResult result = excelImportHskService.importFromExcel(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("mensaje", "Error al procesar el archivo HSK: " + e.getMessage()));
        }
    }

    @PostMapping("/lecciones/{id}/replace")
    public ResponseEntity<?> replaceLeccion(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        ResponseEntity<?> validation = validateXlsx(file);
        if (validation != null) return validation;

        try {
            ImportResult result = excelImportService.replaceFromExcel(id, file);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("mensaje", "Error al reemplazar la lección: " + e.getMessage()));
        }
    }

    @DeleteMapping("/lecciones/{id}")
    public ResponseEntity<?> deleteLeccion(@PathVariable Long id) {
        try {
            leccionService.deleteLeccion(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", e.getMessage()));
        }
    }

    private ResponseEntity<?> validateXlsx(MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "El archivo está vacío"));
        }
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".xlsx")) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "Solo se aceptan archivos .xlsx"));
        }
        return null;
    }
}
