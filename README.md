# Projeto Prova Técnica RMH

Projeto desenvolvido para a **prova técnica da Resende Mori Hutchison Advocacia**, candidatura ao estágio **full-stack**.

Sistema de **gestão de documentos** com upload de arquivos, listagem, visualização, download, exclusão e comentários por documento.

---

## Tecnologias

- **Backend:** Java 17, Spring Boot 3.5, Spring Data JPA, H2 (local) / PostgreSQL (produção)
- **Frontend:** HTML, CSS e JavaScript (ES modules), sem framework
- **Deploy:** Frontend na Vercel, API no Render

---

## Acesso pelo deploy

O frontend está disponível em:

**https://projeto-prova-tecnica-rmh.vercel.app/index.html**

A partir daí é possível:
- Ver a lista de documentos
- Adicionar documento (upload com título, descrição e arquivo)
- Ver detalhes do documento, fazer download e gerenciar comentários
- Apagar documentos e comentários

### API (backend)

A API que o frontend consome está em:

**https://projetoprovatecnicarmh.onrender.com**

Exemplo de endpoint público:
- **Listar documentos:** https://projetoprovatecnicarmh.onrender.com/documents

**Importante:** O serviço da API está hospedado no Render no plano gratuito. Após **cerca de 15 minutos sem requisições**, o servidor entra em modo de economia (sleep). Se o site parecer “travado” ou não carregar os dados, **aguarde 1 a 2 minutos e dê reload (F5) na página** para a primeira requisição acordar o servidor; em seguida o uso deve voltar ao normal.

---

## Rodar localmente

### Pré-requisitos

- **Java 17** e **Maven** (ou use o wrapper `./mvnw` dentro de `backend/`)
- Navegador (para o frontend estático)

### 1. Backend (API)

Na pasta do backend:

```bash
cd backend
./mvnw spring-boot:run
```

Ou, se preferir usar o Maven instalado:

```bash
cd backend
mvn spring-boot:run
```

O backend sobe em **http://localhost:8080**. O perfil ativo é `local`, usando banco **H2** em arquivo (`./data/db`). O console do H2 fica em: http://localhost:8080/h2-console (se habilitado no `application-local.yml`).

### 2. Frontend

O frontend é estático e **precisa ser servido por um servidor HTTP**. Abrir o `index.html` direto pela pasta (protocolo `file://`) faz o navegador bloquear as requisições à API por **CORS** (política de mesma origem), então a aplicação só funciona quando acessada via `http://localhost`.

**Recomendado (se você usa VS Code ou Cursor):** use a extensão **Live Server**. Clique com o botão direito em `frontend/index.html` → “Open with Live Server”. Ela sobe um servidor local e recarrega a página ao salvar.

**Alternativas pela linha de comando:**

```bash
cd frontend
# Python 3
python3 -m http.server 3000
# ou com Node (npx)
npx serve .
```

Acesse pelo navegador (ex.: http://localhost:3000/index.html ou a porta que o Live Server indicar).

### 3. Apontar o frontend para a API local

Por padrão o frontend usa a API em produção. Para usar a API rodando na sua máquina, altere a URL base no código:

No arquivo **`frontend/js/api.js`**, na primeira linha, troque:

```js
export const BASE_API_URL = "https://projetoprovatecnicarmh.onrender.com";
```

por:

```js
export const BASE_API_URL = "http://localhost:8080";
```

Assim, todas as requisições (documentos, comentários, upload, download, delete) serão feitas para o backend local.

---

## Estrutura do projeto

```
ProjetoProvaTecnicaRMH/
├── backend/                    # API Spring Boot
│   ├── src/main/java/.../
│   │   ├── config/             # CORS.
│   │   ├── controller/         # DocumentController, CommentController
│   │   ├── domain/             # Document, Comment (Entities)
│   │   ├── repository/         # JPA repositories
│   │   ├── service/            # DocumentService, CommentService
│   │   └── exception/          # Tratamento de erros
│   └── src/main/resources/
│       ├── application.yaml
│       ├── application-local.yml   # H2, perfil local
│       └── application-prod.yml    # Produção (ex.: PostgreSQL)
├── frontend/
│   ├── index.html              # Lista de documentos
│   ├── upload.html             # Formulário de upload
│   ├── document.html           # Detalhes do documento + comentários
│   ├── css/style.css
│   ├── js/
│   │   ├── api.js              # BASE_API_URL e funções de API
│   │   ├── documents.js        # Listagem na index
│   │   ├── upload.js           # Envio do formulário de upload
│   │   └── document.js         # Página do documento e comentários
│   └── assets/
└── README.md
```

---

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/documents` | Lista todos os documentos |
| GET | `/documents/{id}` | Detalhes de um documento |
| GET | `/documents/{id}/download` | Download do arquivo |
| POST | `/documents` | Upload (title, description, file) |
| DELETE | `/documents/{id}` | Remove documento |
| GET | `/documents/{documentId}/comments` | Lista comentários do documento |
| POST | `/documents/{documentId}/comments?text=...` | Adiciona comentário |
| DELETE | `/documents/{documentId}/comments/{id}` | Remove comentário |

---

## Resumo

- **Deploy (frontend):** https://projeto-prova-tecnica-rmh.vercel.app/index.html  
- **API:** https://projetoprovatecnicarmh.onrender.com/documents (pode dormir após ~15 min; em caso de falha, aguarde 1–2 min e recarregue a página)  
- **Local:** subir o backend com `./mvnw spring-boot:run` em `backend/`, servir o `frontend/` e alterar `BASE_API_URL` em `frontend/js/api.js` para `http://localhost:8080`.
