// Vyvia Dialogue Workbench v2.2 - script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. State Variables ---
    let projects = [];
    let directives = [];
    let activeDirectives = [];
    let categories = [];

    // --- 2. DOM Element Constants ---
    const messageInput = document.getElementById('message-input');
    const copyButton = document.getElementById('copy-button');
    const chatSessionInput = document.getElementById('chat-session-input');
    
    // Project Management Elements
    const projectSelector = document.getElementById('project-selector');
    const manageProjectsBtn = document.getElementById('manage-projects-btn');
    const projectModal = document.getElementById('project-modal');
    const projectModalCloseBtn = document.getElementById('modal-close-btn');
    const projectList = document.getElementById('project-list');
    const newProjectInput = document.getElementById('new-project-input');
    const addProjectBtn = document.getElementById('add-project-btn');

    // Directive Management Elements
    const manageDirectivesBtn = document.getElementById('manage-directives-btn');
    const directivesModal = document.getElementById('directives-modal');
    const directivesModalCloseBtn = document.getElementById('directives-modal-close-btn');
    const directivesList = document.getElementById('directives-list');
    const newDirectiveTextInput = document.getElementById('new-directive-text-input');
    const newDirectiveCategorySelector = document.getElementById('new-directive-category-selector');
    const addDirectiveBtn = document.getElementById('add-directive-btn');

    // Category Management Elements
    const manageCategoriesBtn = document.getElementById('manage-categories-btn');
    const categoriesModal = document.getElementById('categories-modal');
    const categoriesModalCloseBtn = document.getElementById('categories-modal-close-btn');
    const categoryList = document.getElementById('category-list');
    const newCategoryInputModal = document.getElementById('new-category-input-modal');
    const addCategoryBtnModal = document.getElementById('add-category-btn-modal');
    
    // Notes Elements
    const notesInput = document.getElementById('notes-input');
    const copyNoteButton = document.getElementById('copy-note-button');


    // --- 3. Data Management Functions (localStorage) ---
    const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));
    const loadData = (key, defaultValue) => {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : defaultValue;
    };

    function initializeData() {
        projects = loadData('vyvia_projects', ['BOT_TRADING', 'WORKBENCH_OS']);
        directives = loadData('vyvia_directives', [
            { text: '[MODE: DEEP_FOCUS]', category: 'Modo Cognitivo', description: 'Default mode for in-depth work.' },
            { text: '[ENFORCE: GIT_BLOCK]', category: 'Control de Ejecución', description: 'Forces the inclusion of a Git commit block.' }
        ]);
        categories = loadData('vyvia_directive_categories', ['Modo Cognitivo', 'Control de Ejecución', 'Formato de Salida']);
        saveData('vyvia_projects', projects);
        saveData('vyvia_directives', directives);
        saveData('vyvia_directive_categories', categories);
    }

    // --- 4. Render Functions ---
    function renderProjects() {
        projectSelector.innerHTML = '';
        projectList.innerHTML = '';
        projects.forEach((project, index) => {
            const option = document.createElement('option');
            option.value = project;
            option.textContent = project;
            projectSelector.appendChild(option);

            const listItem = document.createElement('li');
            listItem.className = 'project-list-item';
            listItem.textContent = project;
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-project-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.onclick = () => {
                projects.splice(index, 1);
                saveData('vyvia_projects', projects);
                renderProjects();
            };
            listItem.appendChild(deleteBtn);
            projectList.appendChild(listItem);
        });
    }

    function renderCategories() {
        categoryList.innerHTML = '';
        categories.forEach((category, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'project-list-item';
            listItem.textContent = category;
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-project-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.onclick = () => {
                categories.splice(index, 1);
                saveData('vyvia_directive_categories', categories);
                renderCategories();
                renderCategorySelector();
            };
            listItem.appendChild(deleteBtn);
            categoryList.appendChild(listItem);
        });
    }

    function renderCategorySelector() {
        newDirectiveCategorySelector.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            newDirectiveCategorySelector.appendChild(option);
        });
    }

    function renderDirectives() {
        directivesList.innerHTML = '';
        const grouped = directives.reduce((acc, dir) => {
            (acc[dir.category] = acc[dir.category] || []).push(dir);
            return acc;
        }, {});

        for (const category in grouped) {
            const header = document.createElement('h3');
            header.textContent = category;
            header.style.color = 'var(--primary-color)';
            header.style.marginTop = '20px';
            directivesList.appendChild(header);

            const container = document.createElement('div');
            container.className = 'directive-category-container';
            grouped[category].forEach(directive => {
                const item = document.createElement('div');
                item.className = 'directive-item';
                item.dataset.category = directive.category;
                if (activeDirectives.includes(directive.text)) {
                    item.classList.add('selected');
                }
                item.addEventListener('click', () => {
                    const index = activeDirectives.indexOf(directive.text);
                    if (index > -1) {
                        activeDirectives.splice(index, 1);
                    } else {
                        activeDirectives.push(directive.text);
                    }
                    renderActiveDirectives();
                    renderDirectives();
                });

                const textSpan = document.createElement('span');
                textSpan.textContent = directive.text;
                item.appendChild(textSpan);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-project-btn';
                deleteBtn.innerHTML = '×';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    const directiveIndex = directives.findIndex(d => d.text === directive.text);
                    if (directiveIndex > -1) directives.splice(directiveIndex, 1);
                    const activeIndex = activeDirectives.indexOf(directive.text);
                    if (activeIndex > -1) activeDirectives.splice(activeIndex, 1);
                    saveData('vyvia_directives', directives);
                    renderDirectives();
                    renderActiveDirectives();
                };
                item.appendChild(deleteBtn);
                container.appendChild(item);
            });
            directivesList.appendChild(container);
        }
    }

    function renderActiveDirectives() {
        const display = document.getElementById('active-directives-display');
        display.innerHTML = '';
        activeDirectives.forEach(text => {
            const tag = document.createElement('div');
            tag.className = 'active-directive-tag';
            const directiveData = directives.find(d => d.text === text);
            if (directiveData) {
                tag.dataset.category = directiveData.category;
            }
            tag.textContent = text;
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-directive-btn';
            removeBtn.innerHTML = '×';
            removeBtn.onclick = () => {
                const index = activeDirectives.indexOf(text);
                if (index > -1) {
                    activeDirectives.splice(index, 1);
                    renderActiveDirectives();
                    renderDirectives();
                }
            };
            tag.appendChild(removeBtn);
            display.appendChild(tag);
        });
    }


    // --- 5. Event Listeners ---
    function setupEventListeners() {
        // Main Copy Button
        copyButton.addEventListener('click', () => {
            const message = messageInput.value;
            if (!message) { alert('Por favor, escribe un mensaje.'); return; }
            
            const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
            const header = `${chatSessionInput.value} | [PROYECTO: ${projectSelector.value}] | ${timestamp}`;
            const directiveLine = activeDirectives.join(' ');
            const fullMessage = directiveLine ? `${header}\n${directiveLine}\n\n${message}` : `${header}\n\n${message}`;

            navigator.clipboard.writeText(fullMessage).then(() => showFeedback(copyButton, '¡Copiado!'));
        });

        // Project Management
        manageProjectsBtn.addEventListener('click', () => projectModal.style.display = 'flex');
        projectModalCloseBtn.addEventListener('click', () => projectModal.style.display = 'none');
        addProjectBtn.addEventListener('click', () => {
            const name = newProjectInput.value.trim().toUpperCase();
            if (name && !projects.includes(name)) {
                projects.push(name);
                saveData('vyvia_projects', projects);
                renderProjects();
                newProjectInput.value = '';
            }
        });
        
        // Directive Management
        manageDirectivesBtn.addEventListener('click', () => {
            directivesModal.style.display = 'flex';
            renderCategorySelector();
        });
        directivesModalCloseBtn.addEventListener('click', () => directivesModal.style.display = 'none');
        addDirectiveBtn.addEventListener('click', () => {
            const text = newDirectiveTextInput.value.trim();
            const category = newDirectiveCategorySelector.value;
            if (text && category && !directives.some(d => d.text === text)) {
                directives.push({ text, category, description: '' });
                saveData('vyvia_directives', directives);
                renderDirectives();
                newDirectiveTextInput.value = '';
            }
        });
        
        // Category Management
        manageCategoriesBtn.addEventListener('click', () => {
            categoriesModal.style.display = 'flex';
            renderCategories();
        });
        categoriesModalCloseBtn.addEventListener('click', () => categoriesModal.style.display = 'none');
        addCategoryBtnModal.addEventListener('click', () => {
            const name = newCategoryInputModal.value.trim();
            if (name && !categories.includes(name)) {
                categories.push(name);
                saveData('vyvia_directive_categories', categories);
                renderCategories();
                renderCategorySelector();
                newCategoryInputModal.value = '';
            }
        });
        
        // Quick Notes
        copyNoteButton.addEventListener('click', () => {
            if (!notesInput.value) return;
            const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
            const fullNote = `[NOTA RÁPIDA | ${timestamp}]\n${notesInput.value}`;
            navigator.clipboard.writeText(fullNote).then(() => {
                showFeedback(copyNoteButton, '¡Nota Copiada!');
                notesInput.value = '';
            });
        });

        // Close modals on overlay click
        [projectModal, directivesModal, categoriesModal].forEach(modal => {
            window.addEventListener('click', (event) => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    function showFeedback(element, text) {
        const originalText = element.textContent;
        element.textContent = text;
        element.style.backgroundColor = 'var(--button-active-bg)';
        setTimeout(() => {
            element.textContent = originalText;
            element.style.backgroundColor = '';
        }, 1500);
    }

    // --- 6. Initial Load ---
    initializeData();
    renderProjects();
    renderDirectives();
    renderActiveDirectives();
    renderCategories();
    renderCategorySelector();
    setupEventListeners();
});