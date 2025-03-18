//DOM references
const videoConatiner = document.getElementById("video-container");
const searchInput = document.getElementById("search");
const suggestionBox = document.getElementById("suggestion");
const searchButton = document.getElementById("basic-addon2");
const logo = document.getElementById('logo-head')
logo.addEventListener('click',() => {
  location.reload(true)
})
document
  .querySelector("form")
  .addEventListener("submit", (e) => e.preventDefault());

//variables
const videos = JSON.parse(localStorage.getItem("videos")) || [];
hasMoreData = true;
let page = 1; // Start from page 1
let limit = 9; // Fetch 15 videos per request
let isFetching = false; // it will prevent multiple fetches at the same time
let isSearching = false; // it will prevent infinite scrolling during searching

//function for fetch all videos and cache it
async function fetchAllVideos() {
  const url = `https://api.freeapi.app/api/v1/public/youtube/videos?page=1&limit=100&query=javascript&sortBy=keep%2520one%253A%2520$latest%2520`;
  const options = { method: "GET", headers: { accept: "application/json" } };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const responseData = data.data.data;
    localStorage.setItem("videos", JSON.stringify(responseData));
  } catch (error) {
    console.log("error fetching API", error);
  }
}

//function for fetching vedios
async function fetchVedios(page, limit, query = "latest") {
  const url = `https://api.freeapi.app/api/v1/public/youtube/videos?page=${page}&limit=${limit}&query=javascript&sortBy=keep%2520one%253A%2520${query}%2520`;
  const options = { method: "GET", headers: { accept: "application/json" } };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const responseData = data.data.data;
    if (responseData.length === 0) {
      hasMoreData = false;
    }
    isFetching = false;
    // localStorage.setItem("data",`${responseData}`)
    appendVideosToDom(responseData);
  } catch (error) {
    console.log("error fetching API", error);
  }
}

//function formt views
function formatViews(views) {
  views = Number(views);
  if (views >= 1_000_000) {
    return (views / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  } else if (views >= 1_000) {
    return (views / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  } else {
    return views.toString();
  }
}

//function for formating upload date
function timeAgo(date) {
  const now = new Date();
  const uploadTime = new Date(date);
  const diffInSeconds = (now - uploadTime) / 1000;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInMonths / 12);

  if (diffInYears >= 1)
    return `${diffInYears} year ${diffInYears > 1 ? "s" : ""}ago`;
  if (diffInMonths >= 1)
    return `${diffInMonths} month ${diffInMonths > 1 ? "s" : ""}ago`;
  if (diffInHours >= 1)
    return `${diffInHours} hour ${diffInHours > 1 ? "s" : ""}ago`;
  if (diffInMinutes >= 1)
    return `${diffInMinutes} minute ${diffInMinutes > 1 ? "s" : ""}ago`;
  if (diffInSeconds >= 1)
    return `${diffInSeconds} second ${diffInSeconds > 1 ? "s" : ""}ago`;
  return `just now`;
}

//function for maping the videos
function appendVideosToDom(data) {
  let videoHtml = data
    .map(
      (video) => `
     <a href="https://www.youtube.com/watch?v=${
       video.items.id
     }" class="box p-0 rounded-top-3 text-decoration-none">
          <img
            src=${video.items.snippet.thumbnails.maxres.url}
            alt="thumbnail"
            width="100%"
            class="rounded-3 image-fluid mb-2"
          />
          <div class="col-12 d-flex column-gap-2">
            <div class="p-1 profile">
              <img
                src="./assets/profile.jpg"
                alt="logo-thumb"
                class="rounded-circle profile"
              />
            </div>
            <div class="col-10 p-1">
              <p class="text-start m-0 fw-bolder large-text">
                ${video.items.snippet.title}
              </p>
              <p class="text-start m-0 fw-semibold small-text">${
                video.items.snippet.channelTitle
              }</p>
              <div class="d-flex fw-medium">
                <p class="small-text">${formatViews(
                  video.items.statistics.viewCount
                )} views</p>
                <p class="small-text mx-1 fw-bold">.</p>
                <p class="small-text">
                ${timeAgo(video.items.snippet.publishedAt)}
                  </p>
              </div>
            </div>
          </div>
        </a>
   `
    )
    .join("");
  if (data.length < 9) {
    videoConatiner.innerHTML = videoHtml;
    return;
  }
  videoConatiner.innerHTML += videoHtml;
}

//throttle function
const throttle = (fn, delay) => {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    console.log("hit happend", now);
    return fn(...args);
  };
};

//function for scrolling
function handleScroll() {
  if (isFetching || !hasMoreData || isSearching) return; //prevent multiple api fetching

  const scrollTop = window.scrollY; //get the scroll position
  const windowHeight = window.innerHeight; //get the inner height
  const documentHeight = document.documentElement.scrollHeight; //height of the total document
  console.log(scrollTop + windowHeight, documentHeight);
  if (scrollTop + windowHeight >= documentHeight * 0.8) {
    //check if user has scrolled 80% of the document height
    isFetching = true;
    page++;
    fetchVedios(page, limit);
  }
}

// //scroll event for infinite scrolling
window.onscroll = throttle(handleScroll, 3000);

//debounce function
function debounceFunc(fn, delay) {
  isSearching = true;
  let timerId;
  return function (...args) {
    clearTimeout(timerId); //cancel the last call
    timerId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

//filter function
function queryFilter(query) {
  if (!query.trim()) {
    return;
  }
  const result = videos.filter((video) =>
    video.items.snippet.title
      .trim()
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );
  if (result.length > 0) {
    suggestionBox.style.display = "block";

    const suggestedResults = result
      .slice(0, 7)
      .map(
        (video) => ` 
    <p id=${video.items.id}>
        ${video.items.snippet.title}
    </p>
    `
      )
      .join("");
    suggestionBox.innerHTML = suggestedResults;
    const paragraphs = suggestionBox.querySelectorAll("p");
    paragraphs.forEach((p) => {
      p.addEventListener("click", () => {
        const title = p.textContent;
        searchInput.value = `${title.trim()}`;
        const suggestedVideo = videos.filter((video) =>
          video.items.snippet.title
            .trim()
            .toLowerCase()
            .includes(title.trim().toLowerCase())
        );
        appendVideosToDom(suggestedVideo);
        suggestionBox.style.display = "none";
      });
    });
  }
}

//filter functionusing search
searchInput.addEventListener(
  "input",
  debounceFunc((e) => queryFilter(e.target.value), 1000)
);
// });

//search filter function
function searchFilter(query) {
  isSearching = true;
  if (!query.trim()) return;
  const suggestedVideo = videos.filter((video) =>
    video.items.snippet.title
      .trim()
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );
  suggestionBox.style.display = "none";
  appendVideosToDom(suggestedVideo);
}
//search button add Eventlistner
searchButton.addEventListener("click", () => {
  const query = searchInput.value;
  searchFilter(query);
});


//event listner on load
window.onload = async () => {
  isSearching = false;
  searchInput.value = null
  const vedios = await fetchVedios(page, limit);

  if (!localStorage.getItem("videos")) {
    await fetchAllVideos();
  }
};
