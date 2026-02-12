import { BASE_API_URL, deleteDocument } from "./api.js";

function getDocumentIdFromUrl() {
  return new URLSearchParams(window.location.search).get("id");
}

function formatDate(isoString) {
  if (!isoString) return "-";
  const d = new Date(isoString);
  return d.toLocaleString("pt-BR");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function renderCommentsList(comments, listEl, docId) {
  if (comments.length === 0) {
    listEl.innerHTML = "<li>Nenhum comentário.</li>";
  } else {
    listEl.innerHTML = comments
      .map(c => {
        const commentText = escapeHtml(c.text);
        const commentDate = formatDate(c.createdAt);
        return `<li>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 10px;">
            <div style="flex: 1;">
              <span style="color: #666; font-size: 0.9em;">${commentDate}</span>
              <p style="margin: 5px 0 0 0;">${commentText}</p>
            </div>
            <button class="delete-comment-btn" data-comment-id="${c.id}" style="background: #eb2525; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 0.85em; white-space: nowrap;">Apagar</button>
          </div>
        </li>`;
      })
      .join("");
    
    listEl.querySelectorAll(".delete-comment-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const commentId = btn.getAttribute("data-comment-id");
        if (confirm("Tem certeza que deseja apagar este comentário?")) {
          try {
            const res = await fetch(
              BASE_API_URL + "/documents/" + docId + "/comments/" + commentId,
              { method: "DELETE" }
            );
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.details || err.message || "Erro ao deletar comentário");
            }
            const commentsRes = await fetch(BASE_API_URL + "/documents/" + docId + "/comments");
            const newComments = commentsRes.ok ? await commentsRes.json() : [];
            renderCommentsList(newComments, listEl, docId);
          } catch (err) {
            alert(err.message || "Erro ao deletar comentário");
          }
        }
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const docId = getDocumentIdFromUrl();
  const loading = document.getElementById("loading");
  const content = document.getElementById("content");
  const errorEl = document.getElementById("error");
  const commentsList = document.getElementById("commentsList");

  if (!docId) {
    loading.style.display = "none";
    errorEl.style.display = "block";
    errorEl.textContent = "ID do documento não informado. Use document.html?id=1";
    return;
  }

  try {
    const [docRes, commentsRes] = await Promise.all([
      fetch(BASE_API_URL + "/documents/" + docId),
      fetch(BASE_API_URL + "/documents/" + docId + "/comments")
    ]);

    if (!docRes.ok) {
      const err = await docRes.json().catch(() => ({}));
      throw new Error(err.details || err.message || "Documento não encontrado");
    }

    const doc = await docRes.json();
    let comments = [];
    if (commentsRes.ok) comments = await commentsRes.json();

    document.getElementById("title").textContent = doc.title || "-";
    document.getElementById("description").textContent = doc.description || "-";
    document.getElementById("uploadDate").textContent = formatDate(doc.uploadDate);

    const fileLink = document.getElementById("fileLink");
    fileLink.href = BASE_API_URL + "/documents/" + docId + "/download";
    fileLink.textContent = doc.filename || "Download";

    renderCommentsList(comments, commentsList, docId);

    loading.style.display = "none";
    content.style.display = "block";

    document.getElementById("btnDelete").addEventListener("click", async () => {
      const deleted = await deleteDocument(docId);
      if (deleted) window.location.href = "index.html";
    });

    document.getElementById("commentForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const textarea = document.getElementById("commentText");
      const text = (textarea.value || "").trim();
      if (!text) return;
      try {
        const res = await fetch(
          BASE_API_URL + "/documents/" + docId + "/comments?text=" + encodeURIComponent(text),
          { method: "POST" }
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.details || err.message || "Erro ao enviar comentário");
        }
        textarea.value = "";
        const commentsRes = await fetch(BASE_API_URL + "/documents/" + docId + "/comments");
        const newComments = commentsRes.ok ? await commentsRes.json() : [];
        renderCommentsList(newComments, commentsList, docId);
      } catch (err) {
        alert(err.message || "Erro ao enviar comentário");
      }
    });
  } catch (err) {
    loading.style.display = "none";
    errorEl.style.display = "block";
    errorEl.textContent = err.message || "Erro ao carregar documento";
  }
});