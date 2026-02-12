


// Delete document
async function deleteDocument(documentId) {
    try {
      const response = await fetch(`${BASE_API_URL}/documents/${documentId}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        let msg = "Erro ao deletar documento";
        try {
          const error = await response.json();
          msg = error.details || error.message || msg;
        } catch (_) {}
        throw new Error(msg);
      }

      loadDocuments();
    } catch (err) {
      alert(err.message || "Erro ao deletar documento");
    }
}

  
// View comments
async function viewComments(documentId) {
    try {
      const response = await fetch(
        `${BASE_API_URL}/documents/${documentId}/comments`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.message || "Erro ao carregar comentários");
      }

      const comments = Array.isArray(data) ? data : (data.comments || []);
      let message = "Comentários:\n\n";
      comments.forEach(c => {
        const date = c.createdAt ? new Date(c.createdAt).toLocaleString() : "-";
        message += `• ${c.text || "(sem texto)"} (${date})\n`;
      });

      const newComment = prompt(
        message + "\nAdicionar novo comentário:"
      );

      if (newComment && newComment.trim() !== "") {
        await addComment(documentId, newComment);
      }

    } catch (err) {
      alert(err.message || "Erro ao carregar comentários");
    }
}
  
// Add comment
async function addComment(documentId, text) {
    try {
      const response = await fetch(
        `${BASE_API_URL}/documents/${documentId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: `text=${encodeURIComponent(text)}`
        }
      );
  
      if (!response.ok) {
        let msg = "Erro ao salvar comentário";
        try {
          const error = await response.json();
          msg = error.details || error.message || msg;
        } catch (_) {}
        throw new Error(msg);
      }

      alert("Comentário adicionado!");
      await viewComments(documentId);
    } catch (err) {
      alert(err.message);
    }
}

// Initialize
loadDocuments();