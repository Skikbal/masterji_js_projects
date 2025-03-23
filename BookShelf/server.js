import express from "express";
import path, { resolve } from "path";
import { fileURLToPath } from "url";

const server = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
server.set("view engine", "ejs");
server.set("views", path.resolve("./views"));
server.use(express.static(path.join(__dirname, "public")));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//function for fetching books
async function fetchBooks(page = 1) {
  const url = `https://api.freeapi.app/api/v1/public/books?page=${page}&limit=12`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  try {
    const response = await fetch(url, options);
    if (!response) {
      console.log(response);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
//static path for
server.get("/", async (req, res) => {
  const response = await fetchBooks();
  res.render("Home", { response:response.data });
});

//api route
server.get("/api/books", async (req, res) => {
  const { page = 1 } = req.query;
  const response = await fetchBooks(page);
  res.json({ response });
});

server.listen(PORT, () => {
  console.log(`server is listening on port: ${PORT}`);
});
