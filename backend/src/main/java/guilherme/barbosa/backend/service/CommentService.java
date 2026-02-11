package guilherme.barbosa.backend.service;

import guilherme.barbosa.backend.domain.Comment;
import guilherme.barbosa.backend.domain.Document;
import guilherme.barbosa.backend.exception.BadRequestException;
import guilherme.barbosa.backend.repository.CommentRepository;
import guilherme.barbosa.backend.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final DocumentRepository documentRepository;

    public List<Comment> listByDocument(Long documentId) {
        return commentRepository.findByDocumentIdOrderByCreatedAtAsc(documentId);
    }

    public Comment addComment(Long documentId, String text) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new BadRequestException("Documento não encontrado"));

        Comment comment = Comment.builder()
                .document(document)
                .text(text)
                .createdAt(LocalDateTime.now())
                .build();

        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new BadRequestException("Comentário não encontrado"));

        commentRepository.delete(comment);
    }
}
