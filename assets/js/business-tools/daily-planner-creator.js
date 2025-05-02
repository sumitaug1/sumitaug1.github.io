document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let timeBlocks = [];
    let tasks = [];
    let goals = [];

    // Form elements
    const plannerForm = document.getElementById('plannerForm');
    const addTimeBlockBtn = document.getElementById('addTimeBlockBtn');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const addGoalBtn = document.getElementById('addGoalBtn');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const previewModal = new bootstrap.Modal(document.getElementById('previewModal'));

    // Add time block
    addTimeBlockBtn.addEventListener('click', () => {
        const timeBlock = {
            id: Date.now(),
            startTime: '',
            endTime: '',
            activity: '',
            notes: ''
        };
        timeBlocks.push(timeBlock);
        renderTimeBlocks();
    });

    // Add task
    addTaskBtn.addEventListener('click', () => {
        const task = {
            id: Date.now(),
            title: '',
            priority: 'medium',
            completed: false
        };
        tasks.push(task);
        renderTasks();
    });

    // Add goal
    addGoalBtn.addEventListener('click', () => {
        const goal = {
            id: Date.now(),
            title: '',
            completed: false
        };
        goals.push(goal);
        renderGoals();
    });

    // Render time blocks
    function renderTimeBlocks() {
        const container = document.getElementById('timeBlocksContainer');
        container.innerHTML = timeBlocks.map((block, index) => `
            <div class="time-block mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">Time Block #${index + 1}</h6>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeTimeBlock(${block.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-4 mb-2">
                        <input type="time" class="form-control" placeholder="Start Time" 
                            onchange="updateTimeBlock(${block.id}, 'startTime', this.value)">
                    </div>
                    <div class="col-md-4 mb-2">
                        <input type="time" class="form-control" placeholder="End Time" 
                            onchange="updateTimeBlock(${block.id}, 'endTime', this.value)">
                    </div>
                    <div class="col-md-4 mb-2">
                        <input type="text" class="form-control" placeholder="Activity" 
                            onchange="updateTimeBlock(${block.id}, 'activity', this.value)">
                    </div>
                </div>
                <textarea class="form-control" placeholder="Notes" rows="2" 
                    onchange="updateTimeBlock(${block.id}, 'notes', this.value)"></textarea>
            </div>
        `).join('');
    }

    // Render tasks
    function renderTasks() {
        const container = document.getElementById('tasksContainer');
        container.innerHTML = tasks.map((task, index) => `
            <div class="task mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">Task #${index + 1}</h6>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeTask(${task.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="row">
                    <div class="col-md-8 mb-2">
                        <input type="text" class="form-control" placeholder="Task Title" 
                            onchange="updateTask(${task.id}, 'title', this.value)">
                    </div>
                    <div class="col-md-4 mb-2">
                        <select class="form-select" onchange="updateTask(${task.id}, 'priority', this.value)">
                            <option value="low">Low Priority</option>
                            <option value="medium" selected>Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render goals
    function renderGoals() {
        const container = document.getElementById('goalsContainer');
        container.innerHTML = goals.map((goal, index) => `
            <div class="goal mb-3 p-3 border rounded">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="mb-0">Goal #${index + 1}</h6>
                    <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeGoal(${goal.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <input type="text" class="form-control" placeholder="Goal Title" 
                    onchange="updateGoal(${goal.id}, 'title', this.value)">
            </div>
        `).join('');
    }

    // Update time block
    window.updateTimeBlock = function(id, field, value) {
        const block = timeBlocks.find(block => block.id === id);
        if (block) {
            block[field] = value;
        }
    };

    // Update task
    window.updateTask = function(id, field, value) {
        const task = tasks.find(task => task.id === id);
        if (task) {
            task[field] = value;
        }
    };

    // Update goal
    window.updateGoal = function(id, field, value) {
        const goal = goals.find(goal => goal.id === id);
        if (goal) {
            goal[field] = value;
        }
    };

    // Remove time block
    window.removeTimeBlock = function(id) {
        timeBlocks = timeBlocks.filter(block => block.id !== id);
        renderTimeBlocks();
    };

    // Remove task
    window.removeTask = function(id) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    };

    // Remove goal
    window.removeGoal = function(id) {
        goals = goals.filter(goal => goal.id !== id);
        renderGoals();
    };

    // Form submission
    plannerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        generatePlanner();
        previewModal.show();
    });

    // Generate planner
    function generatePlanner() {
        const date = document.getElementById('plannerDate').value;
        const notes = document.getElementById('notes').value;

        renderPlannerPreview({
            date,
            timeBlocks,
            tasks,
            goals,
            notes
        });
    }

    // Render planner preview
    function renderPlannerPreview(data) {
        const preview = document.getElementById('plannerPreview');
        preview.innerHTML = `
            <div class="planner-preview">
                <div class="planner-header text-center mb-4">
                    <h2>Daily Planner</h2>
                    <h3>${new Date(data.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                </div>

                <div class="planner-section mb-4">
                    <h4>Time Blocks</h4>
                    ${data.timeBlocks.map(block => `
                        <div class="time-block mb-3 p-3 border rounded">
                            <div class="d-flex justify-content-between">
                                <strong>${block.startTime} - ${block.endTime}</strong>
                                <span class="badge bg-primary">${block.activity}</span>
                            </div>
                            ${block.notes ? `<p class="mb-0 mt-2">${block.notes}</p>` : ''}
                        </div>
                    `).join('')}
                </div>

                <div class="planner-section mb-4">
                    <h4>Tasks</h4>
                    ${data.tasks.map(task => `
                        <div class="task mb-3 p-3 border rounded">
                            <div class="d-flex justify-content-between align-items-center">
                                <span>${task.title}</span>
                                <span class="badge bg-${getPriorityColor(task.priority)}">${task.priority}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="planner-section mb-4">
                    <h4>Daily Goals</h4>
                    ${data.goals.map(goal => `
                        <div class="goal mb-3 p-3 border rounded">
                            <div class="d-flex align-items-center">
                                <input type="checkbox" class="form-check-input me-2" ${goal.completed ? 'checked' : ''}>
                                <span>${goal.title}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>

                ${data.notes ? `
                    <div class="planner-section mb-4">
                        <h4>Notes</h4>
                        <div class="notes p-3 border rounded">
                            <p class="mb-0">${data.notes}</p>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Get priority color
    function getPriorityColor(priority) {
        switch (priority) {
            case 'high': return 'danger';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'secondary';
        }
    }

    // Download PDF
    downloadBtn.addEventListener('click', function() {
        const element = document.getElementById('plannerPreview');
        const opt = {
            margin: 1,
            filename: 'daily-planner.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    });

    // Reset form
    resetBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
            plannerForm.reset();
            timeBlocks = [];
            tasks = [];
            goals = [];
            renderTimeBlocks();
            renderTasks();
            renderGoals();
        }
    });

    // Initialize
    renderTimeBlocks();
    renderTasks();
    renderGoals();
}); 