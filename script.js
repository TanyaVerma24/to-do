let input = document.querySelector("#input");
let add = document.querySelector("#add-btn");
let uList = document.querySelector("#u-list");
let result = document.querySelector(".result");
let clearBtn = document.querySelector("#clear");
let taskTypeSelect = document.querySelector("#type");


loadTasks();
add.disabled = true;

// Enable or disable the "Add" button based on task type selection
taskTypeSelect.addEventListener("change", () => {
  add.disabled = taskTypeSelect.value == "";
});

add.addEventListener("click", () => {
  let taskType = document.querySelector("#type").value;
  if (input.value != "" && taskType !="") {
    let text = input.value;
    addTaskToList(text, false, taskType);
    input.value = "";
    saveTasksToLocalStorage();
    result.classList.remove("error");
  } else {
    result.classList.add("error");
    result.innerHTML = "Enter Task & Type Before Adding &#x2757";
  }
});
// Function to add a task to the list
function addTaskToList(text, isCompleted, type = "") {
  let list = document.createElement("li");

  let deleteIcon = document.createElement("span");
  let taskText = document.createElement("span");
  let taskType = document.createElement("span");
  taskText.classList.add("task-text");
  console.log("typee::",type)
  taskType.classList.remove("task-type-work", "task-type-personal");
  if (type.toLowerCase() == "work") {
    taskType.classList.add("task-type-work");
  } else if (type.toLowerCase() == "personal") {
    taskType.classList.add("task-type-personal");
  }
  let editIcon = document.createElement("span");
  let iconContainer = document.createElement("div");
  taskType.textContent = `${type}`;
  deleteIcon.classList.add("delete-icon");
  list.id = "list";
  taskText.textContent = text;
  editIcon.innerHTML = "&#x270E";

  iconContainer.appendChild(editIcon);
  iconContainer.appendChild(deleteIcon);
  list.appendChild(taskType);
  list.appendChild(taskText);
  list.appendChild(iconContainer);
  uList.appendChild(list);

  iconContainer.classList.add("icon-container");
  editIcon.classList.add("edit-icon");
  deleteIcon.innerHTML = "&#x2718";

  if (isCompleted) {
    taskText.classList.add("task-done");
    list.classList.add("mark-done");
  }

  // Add event listeners
  list.addEventListener("click", (e) => {
    e.stopPropagation();
    taskText.classList.toggle("task-done");
    list.classList.toggle("mark-done");
    saveTasksToLocalStorage();
  });

  deleteIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    list.remove();
    pendingTaskUpdationMsg();
    saveTasksToLocalStorage();
  });

  editIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    if (editIcon.textContent === "✎") {
      taskText.contentEditable = "true";
      taskText.style.borderBottom = "2px solid lightblue";
      taskText.focus();
      editIcon.innerHTML = "&#x2714";
    } else {
      taskText.contentEditable = "false";
      taskText.style.borderBottom = "none";
      editIcon.innerHTML = "&#x270E";
      saveTasksToLocalStorage();
    }
  });
  console.log("list", uList.innerHTML);

  clearBtn.addEventListener("click", () => {
    localStorage.clear();
    uList.innerHTML = "";
    pendingTaskUpdationMsg();
  });

  pendingTaskUpdationMsg();
}

function saveTasksToLocalStorage() {
  let tasks = [];
  document.querySelectorAll("#u-list li").forEach((task) => {
    tasks.push({
      text: task.querySelector(".task-text").textContent,
      isCompleted: task.classList.contains("mark-done"),
      type: task.querySelector(".task-type").textContent,
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) =>
    addTaskToList(task.text, task.isCompleted, task.type)
  );
  pendingTaskUpdationMsg();
}

function pendingTaskUpdationMsg() {
  if (uList.children.length != 0) {
    let pendingTask = `You have ${uList.children.length} pending tasks`;
    result.innerHTML = pendingTask;
    clearBtn.disabled = false;
  } else {
    let pendingTask = `You have ${uList.children.length} pending tasks, Please add some tasks.`;
    result.innerHTML = pendingTask;
    clearBtn.disabled = true;
  }
}
