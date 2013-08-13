
(function(){
	var storage = window.localStorage;

	window.addEventListener("DOMContentLoaded",initialize);
	window.addEventListener("storage",loadAllTasks);
	function initialize(){
		document.getElementById("btnAddTask").addEventListener("click",btnAddTaskClick);
		document.getElementById("btnRemoveCompleted").addEventListener("click",btnRemoveCompletedClick);
		loadAllTasks();
	}

	function loadAllTasks(){
		document.getElementById("ulTaskList").innerHTML = '';
		var allTasks = getAllTasksFromStorage();
		for(var index in allTasks){
			var task = allTasks[index];
			addTaskToList(task);
		}
	}

	function getAllTasksFromStorage(){
		var result = [];
		for(var i=0;i<storage.length;i++){
			var taskId = storage.key(i),
				task = window.JSON.parse(storage.getItem(taskId));
			result.push(task);
		}
		return result;
	}
	function btnAddTaskClick(){
		var taskName = document.getElementById("txtTask").value;
		var task = addTaskToStorage(taskName);
		addTaskToList(task);
		
	}
	function addTaskToList(task){
		var newTaskItem = document.createElement("li"),
			ulTaskList = document.getElementById("ulTaskList");

		newTaskItem.innerHTML = task.taskName;
		newTaskItem.setAttribute("taskId",task.taskId);
		newTaskItem.addEventListener("click", onTaskItemClick);
		if (task.isCompleted){
			newTaskItem.classList.add("completed");
		}
		ulTaskList.appendChild(newTaskItem);
	}

	function addTaskToStorage(taskName){
		var taskId = new Date().getTime().toString();
		var task = {
			taskId : taskId,
			taskName : taskName,
			isCompleted : false
		};
		storage.setItem(taskId,window.JSON.stringify(task));
		return task;
	}

	function btnRemoveCompletedClick(){
		var taskItems = document.getElementById("ulTaskList").children;
		for(var i=taskItems.length-1;i>=0;i--){
			var taskItem = taskItems[i];
			if (taskItem.classList.contains("completed")){
				var taskId = taskItem.getAttribute("taskId");
				removeTaskFromStorage(taskId);
				taskItem.remove();
			}
		}
	}
	function removeTaskFromStorage(taskId){
		storage.removeItem(taskId);
	}

	function onTaskItemClick(){
		if (this.classList.contains("completed")){
			this.classList.remove("completed");
		} else {
			this.classList.add("completed");
		}
		toggleCompletionInStorage(this.getAttribute("taskId"));
	}
	function toggleCompletionInStorage(taskId){
		var task = window.JSON.parse(storage.getItem(taskId));
		task.isCompleted = !task.isCompleted;
		storage.setItem(taskId,window.JSON.stringify(task));
	}
})();