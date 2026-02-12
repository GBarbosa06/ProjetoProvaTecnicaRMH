package guilherme.barbosa.backend.controller;

import guilherme.barbosa.backend.domain.Document;
import guilherme.barbosa.backend.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final Path uploadDir = Paths.get("uploads");

    @GetMapping
    public ResponseEntity<List<Document>> list() {
        return ResponseEntity.ok(documentService.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> findById(@PathVariable Long id){
        return ResponseEntity.ok(documentService.findByIdOrThrowBadRequestException(id));
    }

    @PostMapping
    public ResponseEntity<Document> upload(
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam MultipartFile file) {
        return new ResponseEntity<>(documentService.upload(title, description, file), HttpStatus.CREATED);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> download(@PathVariable Long id) {
        Resource resource = documentService.downloadFile(id);
        String filename = documentService.getDownloadFilename(id);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + filename + "\""
                )
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
