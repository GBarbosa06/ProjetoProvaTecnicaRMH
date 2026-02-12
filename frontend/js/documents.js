import { apiFetch, BASE_API_URL, deleteDocument } from "./api.js";
//import { viewComments } from "./comments.js";

async function loadDocuments() {
  const list = document.getElementById("documentList");
  const documents = await apiFetch("/documents");

  if (documents.length === 0) {
    list.innerHTML = "<li class='empty-docs'>Nenhum documento encontrado</li>";
    return;
  }

  list.innerHTML = "";

  documents.forEach(doc => {
    const li = document.createElement("li");

    const title = document.createElement("strong");
    title.textContent = doc.title;

    const download = document.createElement("a");
    download.href = `${BASE_API_URL}/documents/${doc.id}/download`;
    download.target = "_blank";
    download.textContent = "Download";

    const seeMore = document.createElement("a");
    seeMore.href = `document.html?id=${doc.id}`;
    seeMore.textContent = "Ver mais";
    
    const deleteDoc = document.createElement("a");
    deleteDoc.textContent = "Apagar documento";
    deleteDoc.style.color = "red";
    deleteDoc.href = "#";
    deleteDoc.onclick = (e) => {
      e.preventDefault();
      deleteDocument(doc.id);
      loadDocuments();
    };

    li.appendChild(title);
    li.appendChild(document.createElement("br"));
    li.appendChild(download);
    li.appendChild(document.createTextNode(" | "));
    li.appendChild(seeMore);
    li.appendChild(document.createTextNode(" | "));
    li.appendChild(deleteDoc);
    li.appendChild(document.createElement("br"));
    li.appendChild(document.createElement("br"));
    
    list.appendChild(li);
  });
}

loadDocuments();