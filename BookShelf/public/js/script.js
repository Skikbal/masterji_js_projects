const booksContainer = document.getElementById("books-container");
const gridButton = document.getElementById("grid");
const listButton = document.getElementById("list");
const searchBar = document.getElementById("searchBar");
const latest = document.getElementById("latest");
const oldest = document.getElementById("oldest");
const asc = document.getElementById("asc");
const desc = document.getElementById("desc");

//pagination
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const prev = document.getElementById("prev");
const next = document.getElementById("next");
const current = document.getElementById("current");
const dot = document.getElementById("dot");
const last = document.getElementById("last");
let page = 1;
let lastPage = undefined;
let viewType = "grid";
let allData = [];

//event listner for search
searchBar.addEventListener("input", async () => {
  let query = searchBar.value;
  const data = searchQuery(query);
  mapBooks(data);
});
//event listner for pagination
const handlePrevClick = async () => {
  if (page === 1) return;
  await fetchApi(--page);
};
const handleNextClick = async () => {
  if (page === lastPage) {
    return;
  }
  await fetchApi(++page);
};

prevButton.addEventListener("click", handlePrevClick);
prev.addEventListener("click", handlePrevClick);
nextButton.addEventListener("click", handleNextClick);
next.addEventListener("click", handleNextClick);


//event listener for sorting
asc.addEventListener('click',() => {
  sortBooks("asc")
})
desc.addEventListener('click',() => {
  sortBooks("desc")
})
latest.addEventListener('click',() => {
  sortBooks("latest")
})
oldest.addEventListener('click',() => {
  sortBooks("oldest")
})

//function for sorting
function sortBooks(sortBy) {
  const data = allData.sort((a, b) => {
    const titleA = a.volumeInfo.title.toLowerCase();
    const titleB = b.volumeInfo.title.toLowerCase();
    const dateA = new Date(a.volumeInfo.publishedDate);
    const dateB = new Date(b.volumeInfo.publishedDate);
    if (sortBy === "asc") {
      return titleA < titleB ? -1 : titleA > titleB ? 1 : 0;
    } else if (sortBy === "desc") {
      return titleA > titleB ? -1 : titleA < titleB ? 1 : 0;
    } else if (sortBy === "latest") {
      return dateB - dateA;
    } else if (sortBy === "oldest") {
      return dateA - dateB;
    }
  });
  mapBooks(data);
}
//function for search
function searchQuery(query) {
  const data = allData.filter((data) => {
    const authors = [];
    const title = data.volumeInfo.title.toLowerCase();
    data.volumeInfo.authors.forEach((author) =>
      authors.push(author.toLowerCase())
    );
    return (
      title.includes(query) || authors.some((author) => author.includes(query))
    );
  });
  return data;
}

//function for paginattion
function paginate(page, totalPages) {
  current.innerHTML = page;
  page > 1
    ? ((prev.style.display = "block"), (prev.innerText = page - 1))
    : (prev.style.display = "none");
  page !== totalPages
    ? ((next.innerText = page + 1), (next.style.display = "block"))
    : (next.style.display = "none");
  dot.innerText = "...";
  last.innerText = totalPages;
}
//event listners for switching views
gridButton.addEventListener("click", () => {
  viewType = "grid";
  gridButton.classList.add("active");
  listButton.classList.remove("active");
  booksContainer.classList.remove("list");
  booksContainer.classList.add("grid");
});

//event listners for switching views
listButton.addEventListener("click", () => {
  viewType = "list";
  listButton.classList.add("active");
  gridButton.classList.remove("active");
  booksContainer.classList.add("list");
  booksContainer.classList.remove("grid");
});

//function for rendering ui with books data
function mapBooks(data) {
  booksContainer.innerHTML = data
    .map(
      (book) => `
  <div class="col-10 col-sm-6 col-md-4 col-lg-3 col-xl-2 m-auto col">
            <div class="card bg-body-tertiary">
              <img src=${
                book?.volumeInfo?.imageLinks?.thumbnail ||
                "/assets/fallback.jpg"
              } class="card-img-top image-fluid" alt="..." />
              <div class="card-body">
              <div class="title-info">
                <h5 class="card-title">${book.volumeInfo.title || ""}</h5>
                <p class="card-text">
                  ${book?.volumeInfo?.subtitle || ""}
                </p>
                </div>
                <div class = "more-info">
                <p class="card-text">
                  <h6>Author: ${
                    book?.volumeInfo?.authors?.map((author) => author || "") ||
                    ""
                  }</h6>
                </p>
                <p class="card-text">
                 <h6> Publisher: ${book?.volumeInfo?.publisher || ""} </h6>
                </p>
                <p class="card-text">
                 <h6> Published Date: ${
                   book?.volumeInfo?.publishedDate || ""
                 } </h6>
                </p>
                </div>
                
              </div>
              <a href=${
                book?.volumeInfo?.infoLink || "#"
              } class="btn more p-1" target="_blank">more info.</a>
            </div>
          </div>
  `
    )
    .join("");
}

//function for fetching API
async function fetchApi(page = 1) {
  const url = `https://book-shelf-6cnm.onrender.com/api/books?page=${page}`;
  try {
    const response = await fetch(url);
    if (response.ok) {
      let data = await response.json();
      data = data.response.data;
      page = data.page;
      lastPage = data.totalPages;
      paginate(page, lastPage);
      const booksData = data.data;
      allData = [...booksData];
      mapBooks(allData);
      sortBooks();
    }
  } catch (error) {
    console.log(error);
  }
}

//windows onload
window.onload = async () => {
  await fetchApi(page);
};
