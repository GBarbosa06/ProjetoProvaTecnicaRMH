package guilherme.barbosa.backend.exception.handler;

import guilherme.barbosa.backend.exception.BadRequestExceptionDetails;
import guilherme.barbosa.backend.exception.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class RestExceptionHandler {

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<BadRequestExceptionDetails> handleBadRequest (BadRequestException bre) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(
                    BadRequestExceptionDetails.builder()
                            .title(bre.getClass().getSimpleName())
                            .details(bre.getMessage())
                            .status(400)
                            .timestamp(LocalDateTime.now())
                            .build()
                );
    }
}
