package guilherme.barbosa.backend.repository;

import guilherme.barbosa.backend.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByDocumentIdOrderByCreatedAtAsc(long documentId);
}
