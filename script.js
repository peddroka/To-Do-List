document.addEventListener("DOMContentLoaded", function () {
  // Elementos do DOM
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const resetTasksBtn = document.getElementById("resetTasksBtn");

  // Carregar tarefas do localStorage ao iniciar
  loadTasks();

  // Event Listeners
  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addTask();
    }
  });
  resetTasksBtn.addEventListener("click", resetTasks);

  function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
      alert("Por favor, digite uma tarefa!");
      return;
    }

    // Criar elemento da tarefa
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";

    taskItem.innerHTML = `
              <div class="task-content">
                  <input type="checkbox" class="task-checkbox">
                  <span class="task-text">${taskText}</span>
              </div>
              <button class="delete-btn" aria-label="Remover tarefa">×</button>
          `;

    // Adicionar à lista
    taskList.appendChild(taskItem);

    // Limpar input
    taskInput.value = "";
    taskInput.focus();

    // Adicionar eventos
    const checkbox = taskItem.querySelector(".task-checkbox");
    const deleteBtn = taskItem.querySelector(".delete-btn");

    checkbox.addEventListener("change", toggleTask);
    deleteBtn.addEventListener("click", deleteTask);

    // Salvar no localStorage
    saveTasks();
  }

  function toggleTask(e) {
    const taskItem = e.target.closest(".task-item");
    taskItem.classList.toggle("completed");
    saveTasks();
  }

  function deleteTask(e) {
    const taskItem = e.target.closest(".task-item");
    taskItem.remove();
    saveTasks();
  }

  // Função resetTasks modificada (sem confirmação)
  function resetTasks() {
    // Limpar a lista no DOM
    taskList.innerHTML = "";

    // Limpar o localStorage
    localStorage.removeItem("tasks");
  }

  function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".task-item").forEach((taskItem) => {
      tasks.push({
        text: taskItem.querySelector(".task-text").textContent,
        completed: taskItem.classList.contains("completed"),
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);

      tasks.forEach((task) => {
        const taskItem = document.createElement("li");
        taskItem.className = `task-item ${task.completed ? "completed" : ""}`;

        taskItem.innerHTML = `
                      <div class="task-content">
                          <input type="checkbox" class="task-checkbox" ${
                            task.completed ? "checked" : ""
                          }>
                          <span class="task-text">${task.text}</span>
                      </div>
                      <button class="delete-btn" aria-label="Remover tarefa">×</button>
                  `;

        taskList.appendChild(taskItem);

        // Adicionar eventos
        const checkbox = taskItem.querySelector(".task-checkbox");
        const deleteBtn = taskItem.querySelector(".delete-btn");

        checkbox.addEventListener("change", toggleTask);
        deleteBtn.addEventListener("click", deleteTask);
      });
    }
  }
});
