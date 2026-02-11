package guilherme.barbosa.backend.controller;

import guilherme.barbosa.backend.domain.Comment;
import guilherme.barbosa.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/documents/{documentId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping
    public ResponseEntity<List<Comment>> listComments(@PathVariable Long documentId){
        return ResponseEntity.ok(commentService.listByDocument(documentId));
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(@PathVariable Long documentId, @RequestParam String text){
        return new ResponseEntity<>(commentService.addComment(documentId, text), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
