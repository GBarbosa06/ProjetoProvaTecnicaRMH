package guilherme.barbosa.backend.service;

import guilherme.barbosa.backend.domain.Document;
import guilherme.barbosa.backend.exception.BadRequestException;
import guilherme.barbosa.backend.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final Path uploadDir = Paths.get("uploads");

    public List<Document> listAll() {
        return documentRepository.findAll();
    }

    public Document findByIdOrThrowBadRequestException(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Documento não encontrado"));
    }

    private String getExtension(String filename) {
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    public String getContentType(Long id) {
        Document document = findByIdOrThrowBadRequestException(id);
        String ext = getExtension(document.getFilename());
        return switch (ext) {
            case "pdf" -> "application/pdf";
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            default -> "application/octet-stream";
        };
    }

    private boolean isAllowedExtension(String ext) {
        return ext.equals("pdf") || ext.equals("jpg") || ext.equals("png");
    }

    public Document upload(String title, String description, MultipartFile file) {
        if (file.isEmpty()){
            throw new BadRequestException("Arquivo vazio");
        }
        
        String extension = getExtension(file.getOriginalFilename());
        if(!isAllowedExtension(extension)) {
            throw new BadRequestException("Formato de arquivo não permitido");
        }
        try {

        if(!Files.exists(uploadDir)){
            Files.createDirectories(uploadDir);
        }

        String filename = UUID.randomUUID() + "." + extension;


            Path targetPath = uploadDir.resolve(filename);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            Document document = Document.builder()
                    .title(title)
                    .description(description)
                    .filename(filename)
                    .uploadDate(LocalDateTime.now())
                    .build();

            return documentRepository.save(document);
        } catch (IOException ex){
            throw new BadRequestException("Erro ao salvar arquivo");
        }
    }

    public String getDownloadFilename(Long id) {
        Document document = findByIdOrThrowBadRequestException(id);
        String extension = getExtension(document.getFilename());
        return document.getTitle() + "." + extension;
    }

    public Resource downloadFile(Long id) {
        Document document = findByIdOrThrowBadRequestException(id);

        Path filePath = uploadDir.resolve(document.getFilename());
        try {
            return new UrlResource(filePath.toUri());
        } catch (MalformedURLException e) {
            throw new BadRequestException("Arquivo inválido");
        }
    }

    public void deleteDocument(Long documentId) {
        Document document = findByIdOrThrowBadRequestException(documentId);

        Path filePath = uploadDir.resolve(document.getFilename());

        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new BadRequestException("Erro ao remover arquivo do documento");
        }

        documentRepository.delete(document);
    }
}
