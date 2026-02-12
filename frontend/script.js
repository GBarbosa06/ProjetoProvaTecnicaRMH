const BASE_API_URL = 'http://localhost:8080';

// List documents
async function loadDocuments() {
    try {
      const response = await fetch(`${BASE_API_URL}/documents`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.message || "Erro ao carregar documentos");
      }

      const documents = data;
      const list = document.getElementById("documentList");
      list.innerHTML = "";

      documents.forEach(doc => {
        const li = document.createElement("li");

        li.innerHTML = `
          <strong>${escapeHtml(doc.title)}</strong>
          <br/>
          <a href="${BASE_API_URL}/documents/${doc.id}/download" target="_blank">
            Download
          </a>
          |
          <button onclick="viewComments('${doc.id}')">
            Comentários
          </button>
        `;

        list.appendChild(li);
      });
    } catch (err) {
      alert(err.message || "Erro ao carregar documentos");
    }
}

function escapeHtml(text) {
  if (text == null) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Upload document
const uploadForm = document.getElementById("uploadForm");

if (uploadForm) {
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(uploadForm);

    try {
      const response = await fetch(`${BASE_API_URL}/documents`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        let msg = "Erro no upload";
        try {
          const error = await response.json();
          msg = error.details || error.message || msg;
        } catch { msg = "Erro no upload"; }
        throw new Error(msg);
      }

      uploadForm.reset();
      loadDocuments();
    } catch (err) {
      alert(err.message);
    }
  });
}   

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