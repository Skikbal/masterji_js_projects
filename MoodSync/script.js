//DOM refrences
const analyticsButton = document.getElementById("Analytics");
const happyButton = document.getElementById("happy");
const angryButton = document.getElementById("angry");
const neutralButton = document.getElementById("neutral");
const sadButton = document.getElementById("sad");
const inputBox = document.getElementById("description");
const saveButton = document.getElementById("save");
const resetButton = document.getElementById("reset");
const calendarBox = document.getElementById("calendar-container");
let emotion = "";
// function for choosing emojis and color  for calendar
function getEmojis(emotion) {
  switch (emotion) {
    case "happy":
      return { emoji: "😄", color: "#50C878" };
    case "sad":
      return { emoji: "🥹", color: "#FFAA33" };
    case "neutral":
      return { emoji: "😐", color: "#6495ED" };
    case "angry":
      return { emoji: "😡", color: "#FF4433" };
    default:
      return { emoji: "🫡", color: "black" };
  }
}

//function for arrenging logs
function moodTrack(emotion) {
  const data = new Date();
  const date = data.getDate().toString().padStart(2, "0");
  const month = (data.getMonth() + 1).toString().padStart(2, "0");
  const fullDate = `${date}/${month}/${data.getFullYear()}`;
  let hours = data.getHours().toString().padStart(2, "0");
  hours = hours % 12 || 12;
  hours.toString().padStart(2, "0");
  const minute = data.getMinutes().toString().padStart(2, "0");
  const ampm = data.getHours < 12 ? "AM" : "PM";
  const fullTime = `${hours} : ${minute} ${ampm}`;
  inputBox.value = ` I'm feeling ${emotion}! ${
    getEmojis(emotion).emoji
  }      ${fullDate}     ${fullTime}`;
}

//event listner for happy button
happyButton.addEventListener("click", () => {
  emotion = "happy";
  moodTrack(emotion);
});
//event listner for sad button
sadButton.addEventListener("click", () => {
  emotion = "sad";
  moodTrack(emotion);
});
//event listner for neutral button
neutralButton.addEventListener("click", () => {
  emotion = "neutral";
  moodTrack(emotion);
});
//event listner for angry button
angryButton.addEventListener("click", () => {
  emotion = "angry";
  moodTrack(emotion);
});
//event listner for reset button
resetButton.addEventListener("click", () => {
  emotion = "";
});

//event listner for adding emotional log
saveButton.addEventListener("click", () => {
  const data = new Date();
  const date = data.getDate().toString().padStart(2, "0");
  const month = (data.getMonth() + 1).toString().padStart(2, "0");
  const fullDate = `${data.getFullYear()}-${month}-${date}`;
  const log = {
    title: `${inputBox.value.split(getEmojis(emotion).emoji)[0]}${
      getEmojis(emotion).emoji
    }`,
    start: fullDate,
    color: getEmojis(emotion).color,
  };
  if (!log) return;
  let localLogs = localStorage.getItem("emotionLogs") || [];
  if (localLogs.length > 0) {
    localLogs = JSON.parse(localLogs);
    const isPresesnt = localLogs.find((emotion) => emotion.start === fullDate);
    if (isPresesnt) {
      return;
    }
  }
  localStorage.setItem("emotionLogs", JSON.stringify([...localLogs, log]));
  inputBox.value = "";
  emotion = "";
});

//analytics event listner for calendar
analyticsButton.addEventListener("click", () => {
  const emotionLogs = JSON.parse(localStorage.getItem("emotionLogs")) || [];
  calendarBox.style.display = "block";
  let calendarEl = document.getElementById("calendar");
  let calendar = new FullCalendar.Calendar(calendarEl, {
    themeSystem: "bootstrap5",
    selectable: true,
    initialView: "dayGridMonth",
    events: emotionLogs,
    eventDisplay: "auto",
    customButtons: {
      closeButton: {
        text: "X",
        click: function () {
          calendarBox.style.display = "none";
        },
      },
    },
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridDay,dayGridWeek,dayGridMonth closeButton", // user can switch between the two
    },
  });

  calendar.render();
});

//window on load
window.onload = () => {
  const data = new Date();
  const date = data.getDate().toString().padStart(2, "0");
  const month = (data.getMonth() + 1).toString().padStart(2, "0");
  const fullDate = `${data.getFullYear()}-${month}-${date}`;
  const emotionLogs = JSON.parse(localStorage.getItem("emotionLogs"));

  const isPresesnt = emotionLogs.find((emotion) => emotion.start === fullDate);
  if (isPresesnt) {
    saveButton.setAttribute("disabled", "");
  }
};
