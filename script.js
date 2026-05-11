let tasks = JSON.parse(localStorage.getItem('focusflow-tasks') || '[]');

    const taskInput   = document.getElementById('task-input');
    const addBtn      = document.getElementById('add-btn');
    const taskList    = document.getElementById('task-list');
    const emptyMsg    = document.getElementById('empty-msg');
    const barFill     = document.getElementById('bar-fill');
    const pctNum      = document.getElementById('pct-num');
    const doneCount   = document.getElementById('done-count');
    const totalCount  = document.getElementById('total-count');
    const remainList  = document.getElementById('remaining-list');
    const compList    = document.getElementById('completed-list');

    function save() { localStorage.setItem('focusflow-tasks', JSON.stringify(tasks)); }

    function render() {
      /* ─ Task list ─ */
      taskList.innerHTML = '';
      if (tasks.length === 0) {
        taskList.appendChild(emptyMsg);
      } else {
        tasks.forEach((t, i) => {
          const li = document.createElement('li');
          li.className = 'task-item' + (t.done ? ' done' : '');
          li.innerHTML = `
            <label class="cb-wrap">
              <input type="checkbox" ${t.done ? 'checked' : ''} data-i="${i}"/>
              <div class="cb-box">
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                  <path d="M1 5L4.5 8.5L11 1.5" stroke="#0e0e12" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </label>
            <span class="task-text">${escHtml(t.text)}</span>
            <button class="del-btn" data-i="${i}" title="Delete">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
            </button>`;
          taskList.appendChild(li);
        });
      }

      /* ─ Progress ─ */
      const total = tasks.length;
      const done  = tasks.filter(t => t.done).length;
      const pct   = total === 0 ? 0 : Math.round((done / total) * 100);
      barFill.style.width = pct + '%';
      pctNum.textContent  = pct + '%';
      doneCount.textContent  = done;
      totalCount.textContent = total;

      /* ─ Status columns ─ */
      const remaining  = tasks.filter(t => !t.done);
      const completed  = tasks.filter(t => t.done);

      remainList.innerHTML = remaining.length === 0
        ? '<li class="status-empty">Nothing remaining 🎉</li>'
        : remaining.map((t, idx) =>
            `<li class="status-item rem"><span class="si-dot"></span>${escHtml(t.text)}</li>`
          ).join('');

      compList.innerHTML = completed.length === 0
        ? '<li class="status-empty">Nothing completed yet</li>'
        : completed.map((t, idx) =>
            `<li class="status-item com"><span class="si-dot"></span>${escHtml(t.text)}</li>`
          ).join('');
    }

    function escHtml(str) {
      return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function addTask() {
      const text = taskInput.value.trim();
      if (!text) return;
      tasks.push({ text, done: false });
      taskInput.value = '';
      save(); render();
    }

    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

    taskList.addEventListener('change', e => {
      if (e.target.type === 'checkbox') {
        const i = +e.target.dataset.i;
        tasks[i].done = e.target.checked;
        save(); render();
      }
    });

    taskList.addEventListener('click', e => {
      const btn = e.target.closest('.del-btn');
      if (btn) {
        const i = +btn.dataset.i;
        tasks.splice(i, 1);
        save(); render();
      }
    });

    render();