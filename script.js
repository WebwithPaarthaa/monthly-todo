
const calendar = document.getElementById("calendar");
const yearLabel = document.getElementById("yearLabel");

const now = new Date();
const year = now.getFullYear();
const todayDate = now.getDate();
const todayMonth = now.getMonth();

yearLabel.innerText = year;

const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let checkboxState = JSON.parse(localStorage.getItem("checkboxState")) || {};

function renderLiveCalendar() {
  calendar.innerHTML = "";

  for (let month = 0; month < 12; month++) {
    const days = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= days; day++) {
      const dateKey = `${year}-${month}-${day}`;
      const d = new Date(year, month, day);

      const div = document.createElement("div");
      div.className = "day";

      if (day === todayDate && month === todayMonth) {
        div.classList.add("today");
      }

      let gridHTML = '<div class="grid">';
      tasks.forEach((task, i) => {
        const checked = checkboxState[dateKey]?.[i] ? "checked" : "";
        gridHTML += `
          <div class="task-row">
            <input type="checkbox" ${checked}
              onchange="saveCheckbox('${dateKey}',${i},this.checked)">
            <span>${task}</span>
          </div>
        `;
      });
      gridHTML += '</div>';

      div.innerHTML = `
        <strong>${day}</strong>
        <div class="weekday">${weekDays[d.getDay()]}</div>
        <div class="month">${monthNames[month]}</div>
        ${gridHTML}
      `;

      calendar.appendChild(div);
    }
  }

  document
    .querySelector(".today")
    ?.scrollIntoView({ behavior: "smooth", inline: "center" });
}

function addTask() {
  const input = document.getElementById("taskInput");
  if (!input.value.trim()) return;

 
  const safeTask = input.value.trim().replace(/</g, "&lt;");
  tasks.push(safeTask);

  input.value = "";
  updateTaskList();
  renderLiveCalendar();
}

function updateTaskList() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    list.appendChild(li);
  });
}

function saveCheckbox(dateKey, index, value) {
  if (!checkboxState[dateKey]) checkboxState[dateKey] = {};
  checkboxState[dateKey][index] = value;

 
  localStorage.setItem("checkboxState", JSON.stringify(checkboxState));
  updateProgressUI();
}

function saveProgress() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("checkboxState", JSON.stringify(checkboxState));
  alert("Saved ✅");
}

function resetTasks() {
  if (!confirm("Reset everything?")) return;
  tasks = [];
  checkboxState = {};
  localStorage.clear();
  updateTaskList();
  renderLiveCalendar();
}



updateTaskList();
renderLiveCalendar();

