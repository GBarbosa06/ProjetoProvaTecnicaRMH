export const BASE_API_URL = "http://localhost:8080";
//"https://projetoprovatecnicarmh.onrender.com";
// It would be valid to put this in an .env or config file outside of git, but in this case it's not necessary

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${BASE_API_URL}${endpoint}`, options);

  let data = null;
  try {
    data = await response.json();
  } catch (_) {}

  if (!response.ok) {
    throw new Error(
      data?.details ||
      data?.message ||
      "Erro na requisição"
    );
  }

  return data;
}

export async function deleteDocument(documentId) {
  if (!confirm("Tem certeza que deseja apagar este documento?")) {
    return false;
  }
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
    location.reload();
    return true;
  } catch (err) {
    alert(err.message || "Erro ao deletar documento");
    return false;
  }
}