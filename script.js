document.addEventListener("DOMContentLoaded", function () {
  // Elementos principais
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const resetTasksBtn = document.getElementById("resetTasksBtn");

  // Abas
  const tabsList = document.getElementById("tabsList");
  const createTabBtn = document.getElementById("createTabBtn");
  const newTabNameInput = document.getElementById("newTabNameInput");
  const openCreateTabBtn = document.getElementById("openCreateTabBtn");
  const createTabModal = document.getElementById("createTabModal");
  const cancelCreateTabBtn = document.getElementById("cancelCreateTabBtn");

  // Modal de confirmação de reset
  const confirmResetModal = document.getElementById("confirmResetModal");
  const confirmResetBtn = document.getElementById("confirmResetBtn");
  const cancelResetBtn = document.getElementById("cancelResetBtn");

  let tabs = [];
  let activeTab = null;

  // Carrega abas do localStorage
  function loadTabs() {
    const savedTabs = localStorage.getItem("todoTabs");
    tabs = savedTabs ? JSON.parse(savedTabs) : [];
    activeTab = tabs.length > 0 ? tabs[0] : null;
    renderTabs();
    loadTasks();
  }

  function saveTabs() {
    localStorage.setItem("todoTabs", JSON.stringify(tabs));
  }

  // Renderiza abas
  function renderTabs() {
    tabsList.innerHTML = "";

    if (tabs.length === 0) {
      taskInput.disabled = true;
      addTaskBtn.disabled = true;
      const li = document.createElement("li");
      li.textContent = "Nenhuma lista criada";
      li.style.color = "#888";
      li.style.cursor = "default";
      tabsList.appendChild(li);
      taskList.innerHTML = "";
      return;
    }

    taskInput.disabled = false;
    addTaskBtn.disabled = false;

    tabs.forEach((tab) => {
      const li = document.createElement("li");
      li.textContent = tab;
      li.className = tab === activeTab ? "active" : "";

      li.addEventListener("click", () => setActiveTab(tab));

      const delBtn = document.createElement("button");
      delBtn.className = "tab-delete-btn";
      delBtn.setAttribute("aria-label", `Excluir lista ${tab}`);
      delBtn.textContent = "×";

      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm(`Excluir lista "${tab}" e todas as tarefas?`)) {
          deleteTab(tab);
        }
      });

      li.appendChild(delBtn);
      tabsList.appendChild(li);
    });
  }

  function setActiveTab(name) {
    activeTab = name;
    renderTabs();
    loadTasks();
  }

  function addTask() {
    if (!activeTab) return;

    const text = taskInput.value.trim();
    if (!text) {
      alert("Por favor, digite uma tarefa!");
      return;
    }

    const taskItem = createTaskElement(text, false);
    taskList.appendChild(taskItem);

    taskInput.value = "";
    taskInput.focus();

    saveTasks();
  }

  function createTaskElement(text, completed) {
    const taskItem = document.createElement("li");
    taskItem.className = `task-item ${completed ? "completed" : ""}`;
    taskItem.innerHTML = `
      <div class="task-content">
        <input type="checkbox" class="task-checkbox" ${
          completed ? "checked" : ""
        } />
        <span class="task-text">${text}</span>
      </div>
      <button class="delete-btn" aria-label="Remover tarefa">×</button>
    `;

    const checkbox = taskItem.querySelector(".task-checkbox");
    const deleteBtn = taskItem.querySelector(".delete-btn");

    checkbox.addEventListener("change", toggleTask);
    deleteBtn.addEventListener("click", deleteTask);

    return taskItem;
  }

  function toggleTask(e) {
    const li = e.target.closest(".task-item");
    li.classList.toggle("completed");
    saveTasks();
  }

  function deleteTask(e) {
    const li = e.target.closest(".task-item");
    li.remove();
    saveTasks();
  }

  // Modal de confirmação de reset
  function openConfirmResetModal() {
    confirmResetModal.classList.remove("hidden");
  }

  function closeConfirmResetModal() {
    confirmResetModal.classList.add("hidden");
  }

  // Apagar todas as tarefas da aba ativa
  confirmResetBtn.addEventListener("click", () => {
    if (!activeTab) return;
    taskList.innerHTML = "";
    saveTasks();
    closeConfirmResetModal();
  });

  cancelResetBtn.addEventListener("click", closeConfirmResetModal);

  // Botão de reset com confirmação
  resetTasksBtn.addEventListener("click", () => {
    if (!activeTab) return;
    openConfirmResetModal();
  });

  // Salva tarefas no localStorage
  function saveTasks() {
    if (!activeTab) return;

    const tasks = [];
    document.querySelectorAll(".task-item").forEach((item) => {
      tasks.push({
        text: item.querySelector(".task-text").textContent,
        completed: item.classList.contains("completed"),
      });
    });

    localStorage.setItem(`tasks_${activeTab}`, JSON.stringify(tasks));
  }

  // Carrega tarefas da aba ativa
  function loadTasks() {
    taskList.innerHTML = "";
    if (!activeTab) return;

    const savedTasks = localStorage.getItem(`tasks_${activeTab}`);
    if (savedTasks) {
      const tasks = JSON.parse(savedTasks);
      tasks.forEach((task) => {
        const taskItem = createTaskElement(task.text, task.completed);
        taskList.appendChild(taskItem);
      });
    }
  }

  // Deletar aba
  function deleteTab(name) {
    tabs = tabs.filter((tab) => tab !== name);
    localStorage.removeItem(`tasks_${name}`);
    saveTabs();

    if (activeTab === name) {
      activeTab = tabs.length > 0 ? tabs[0] : null;
    }

    renderTabs();
    loadTasks();
  }

  // Modal de criação de nova aba
  function openCreateTabModal() {
    createTabModal.classList.remove("hidden");
    newTabNameInput.value = "";
    newTabNameInput.focus();
  }

  function closeCreateTabModal() {
    createTabModal.classList.add("hidden");
  }

  // Criar nova aba
  createTabBtn.addEventListener("click", () => {
    const name = newTabNameInput.value.trim();
    if (!name) {
      alert("Por favor, digite um nome para a nova lista.");
      return;
    }
    if (tabs.includes(name)) {
      alert("Já existe uma lista com esse nome.");
      return;
    }

    tabs.push(name);
    saveTabs();
    renderTabs();
    setActiveTab(name);
    closeCreateTabModal();
  });

  cancelCreateTabBtn.addEventListener("click", closeCreateTabModal);
  openCreateTabBtn.addEventListener("click", openCreateTabModal);

  // Adicionar tarefa com clique ou Enter
  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  // Inicialização
  loadTabs();
});
