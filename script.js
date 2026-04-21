// SIDENAV
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// TODO LIST
const addBtn = document.getElementById("addBtn");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");

addBtn.addEventListener("click", addTask);

window.onload = function () {
  loadTasks();
};

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => createTask(task.text, task.completed));
}

function addTask() {
  const text = input.value.trim();
  if (!text) return;

  createTask(text, false);
  input.value = "";
  saveTasks();
}

function createTask(text, completed) {
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;

  const span = document.createElement("span");
  span.textContent = text;

  const del = document.createElement("span");
  del.textContent = "✖";
  del.className = "delete-btn";

  if (completed) li.classList.add("completed");

  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed");
    saveTasks();
  });

  del.addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(del);
  list.appendChild(li);
}

// TIMER 

function populatePickers() {
  const study = document.getElementById("studyTime");
  const brk = document.getElementById("breakTime");

  for (let i = 1; i <= 60; i++) {
    const opt1 = document.createElement("option");
    opt1.value = i;
    opt1.textContent = i + " min";

    const opt2 = opt1.cloneNode(true);

    study.appendChild(opt1);
    brk.appendChild(opt2);
  }
}

populatePickers();

let timer = null;
let time = 0;
let isStudy = true;
let studyDuration = 0;
let breakDuration = 0;

const modeSelect = document.getElementById("mode");
const customInputs = document.getElementById("customInputs");
const controls = document.getElementById("controls");
const display = document.getElementById("timeDisplay");

const studyInput = document.getElementById("studyTime");
const breakInput = document.getElementById("breakTime");

modeSelect.addEventListener("change", () => {
  if (modeSelect.value === "custom") {
    customInputs.style.display = "block";
  } else {
    customInputs.style.display = "none";
  }
  setupTimer();
});

studyTime.addEventListener("change", handlePickerChange);
breakTime.addEventListener("change", handlePickerChange);

function handlePickerChange() {
  if (modeSelect.value !== "custom") return;

  const s = parseInt(studyTime.value);
  const b = parseInt(breakTime.value);

  if (!s || !b) {
    controls.style.display = "none";
    return;
  }

  studyDuration = s * 60;
  breakDuration = b * 60;

  if (!timer) {
    time = studyDuration;
    isStudy = true;
    updateDisplay();
  }

  controls.style.display = "block";
}

function setupTimer() {
  if (modeSelect.value === "pomodoro") {
    studyDuration = 25 * 60;
    breakDuration = 5 * 60;
  } else {
    return;
  }

  time = studyDuration;
  isStudy = true;
  updateDisplay();

  controls.style.display = "block";
}

function updateDisplay() {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  display.textContent =
    `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function startTimer() {
  if (timer) return;

  document.getElementById("customInputs").style.display = "none";
  modeSelect.style.display = "none";

  timer = setInterval(() => {
    if (time <= 0) {
      if (isStudy) {
        time = breakDuration;
        isStudy = false;
        alert("Break time");
      } else {
        time = studyDuration;
        isStudy = true;
        alert("Study time");
      }
    } else {
      time--;
    }

    updateDisplay();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  timer = null;
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
  time = 0;
  updateDisplay();

  modeSelect.style.display = "block";

  if (modeSelect.value === "custom") {
    document.getElementById("customInputs").style.display = "flex";
  }
}

// PLAYLIST LOADER
function loadPlaylist() {
  const link = document.getElementById("linkInput").value;
  const player = document.getElementById("player");

  if (!link) return;

  let embed = "";

  if (link.includes("spotify.com")) {
    const id = link.split("playlist/")[1]?.split("?")[0];
    embed = `<iframe src="https://open.spotify.com/embed/playlist/${id}"></iframe>`;
  }

  else if (link.includes("youtube.com") || link.includes("youtu.be")) {
    const id = link.split("list=")[1];
    embed = `<iframe src="https://www.youtube.com/embed/videoseries?list=${id}" allow="autoplay"></iframe>`;
  }

  else if (link.includes("deezer.com")) {
    const id = link.split("playlist/")[1];
    embed = `<iframe src="https://widget.deezer.com/widget/dark/playlist/${id}"></iframe>`;
  }

  else if (link.includes("music.apple.com")) {
    embed = `<iframe src="${link.replace("music.apple.com", "embed.music.apple.com")}"></iframe>`;
  }

  else {
    player.innerHTML = "Unsupported link";
    return;
  }

  player.innerHTML = embed;
}
