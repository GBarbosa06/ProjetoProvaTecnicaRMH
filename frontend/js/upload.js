import { apiFetch, BASE_API_URL } from "./api.js";

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
        window.location.href = "index.html";

    } catch (err) {
      alert(err.message);
    }
  });
}