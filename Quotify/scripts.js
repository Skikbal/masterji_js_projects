//Element References
const qouteButton = document.getElementById("new-quote");
const qouteContent = document.getElementById("qoute-content");
const copyButton = document.getElementById("copy");
const exportImage = document.getElementById("export");
const tweetButton = document.getElementById("tweet");
const body = document.body;

//function for fetching qoutes from API
async function fetchRandomQoutes() {
  const url = "https://api.freeapi.app/api/v1/public/quotes/quote/random";
  const options = { method: "GET", headers: { accept: "application/json" } };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const qoute_Object = {
      qoute: data.data.content,
      author: data.data.author,
    };
    localStorage.setItem("qoute_Object", JSON.stringify(qoute_Object));
    return data.data;
  } catch (error) {
    console.log(error);
  }
}
//adding event listner on click for fetching qoute
qouteButton.addEventListener("click", async () => {
  //function that will fetch the Api
  qouteContent.classList.remove("fade-in");
  const qouteObject = await fetchRandomQoutes();
  void qouteContent.offsetWidth;
  qouteContent.innerHTML = `“${qouteObject.content}” <br/>- <b>${qouteObject.author}</b>`;
  qouteContent.classList.add("fade-in");
});

//adding eventlistener to copy button
copyButton.addEventListener("click", async () => {
  const text = await copyText(qouteContent.innerText);
});

//function for write to clipboard
async function copyText(text) {
  try {
    const textCopied = await navigator.clipboard.writeText(text);
    Toastify({
      text: "Quote copy to clipboard",
      duration: 3000,
      className: "warning",
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background:
          "linear-gradient(to right, rgb(0, 176, 155), rgb(150, 201, 61))",
      },
    }).showToast();
    return textCopied
  } catch (error) {
    console.log("Failed to copy to clipboard:", error);
  }
}

//add event listner extracting image
exportImage.addEventListener("click", () => {
  const bodyBG = window.getComputedStyle(body).backgroundImage;
  const url = bodyBG.slice(5, -2);
  downloadBackgroundImage(url);
});

//function for downloading image
async function downloadBackgroundImage(url) {
  if (url) {
    const image = await fetch(url); // fetch to get the redableStream data of the image
    const imageBlob = await image.blob(); //blob() a method provide by fetch to get the raw image data
    const imageUrl = URL.createObjectURL(imageBlob); //used URL web API to create static url

    //create a href element
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = "backgroun-image.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    console.log("No background image found!");
  }
}

//add event listner for twitter button
tweetButton.addEventListener("click", () => {
  window.location.href =
    "https://twitter.com/share?url=" +
    window.location.protocol +
    "//" +
    window.location.hostname +
    ":" +
    window.location.port +
    window.location.pathname;
});

//on reload fetch data from local storge if present else fetch qoute from API
window.onload = async () => {
  const qoute_Object = JSON.parse(localStorage.getItem("qoute_Object"));
  if (qoute_Object) {
    qouteContent.classList.remove("fade-in");
    void qouteContent.offsetWidth;
    qouteContent.innerHTML = `“${qoute_Object.qoute}” <br/>- <b>${qoute_Object.author}</b>`;
    qouteContent.classList.add("fade-in");
  } else {
    qouteContent.classList.remove("fade-in");
    void qouteContent.offsetWidth;
    const qouteObject = await fetchRandomQoutes();
    qouteContent.innerHTML = `“${qouteObject.content}” <br/>- <b>${qouteObject.author}</b>`;
    qouteContent.classList.add("fade-in");
  }
};
