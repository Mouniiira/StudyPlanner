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

function addTask() {
  const text = input.value.trim();
  if (!text) return;

  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  const span = document.createElement("span");
  span.textContent = text;

  const del = document.createElement("span");
  del.textContent = "✖";
  del.className = "delete-btn";

  checkbox.addEventListener("change", () => {
    li.classList.toggle("completed");
  });

  del.addEventListener("click", () => {
    li.remove();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(del);

  list.appendChild(li);
  input.value = "";
}

// TIMER (Pomodoro-style default 25 min)
let time = 1500;
let interval = null;

function updateDisplay() {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  document.getElementById("timeDisplay").textContent =
    `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function startTimer() {
  if (interval) return;

  interval = setInterval(() => {
    if (time <= 0) {
      clearInterval(interval);
      interval = null;
      alert("Time's up");
      return;
    }
    time--;
    updateDisplay();
  }, 1000);
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  time = 1500;
  updateDisplay();
}

updateDisplay();

// PLAYLIST LOADER
function loadPlaylist() {
  const link = document.getElementById("linkInput").value;
  const player = document.getElementById("player");

  if (!link) return;

  let embed = "";

  // Spotify
  if (link.includes("spotify.com")) {
    const id = link.split("playlist/")[1]?.split("?")[0];
    embed = `<iframe src="https://open.spotify.com/embed/playlist/${id}"></iframe>`;
  }

  // YouTube playlist
  else if (link.includes("youtube.com") || link.includes("youtu.be")) {
    const id = link.split("list=")[1];
    embed = `<iframe src="https://www.youtube.com/embed/videoseries?list=${id}" allow="autoplay"></iframe>`;
  }

  // Deezer
  else if (link.includes("deezer.com")) {
    const id = link.split("playlist/")[1];
    embed = `<iframe src="https://widget.deezer.com/widget/dark/playlist/${id}"></iframe>`;
  }

  // Apple Music (basic embed)
  else if (link.includes("music.apple.com")) {
    embed = `<iframe src="${link.replace("music.apple.com", "embed.music.apple.com")}"></iframe>`;
  }

  else {
    player.innerHTML = "Unsupported link";
    return;
  }

  player.innerHTML = embed;
}
