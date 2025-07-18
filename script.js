// Vyvia Dialogue Workbench v2.2 - script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. State Variables ---
    let projects = [];
    let directives = [];
    let activeDirectives = [];
    let categories = [];

    // --- 2. DOM Element Cache ---
    const elements = {
        messageInput: document.getElementById('message-input'),
        copyButton: document.getElementById('copy-button'),
        chatSessionInput: document.getElementById('chat-session-input'),
        projectSelector: document.getElementById('project-selector'),
        manageProjectsBtn: document.getElementById('manage-projects-btn'),
        projectModal: document.getElementById('project-modal'),
        projectModalCloseBtn: document.getElementById('project-modal-close-btn'),
        projectList: document.getElementById('project-list'),
        newProjectInput: document.getElementById('new-project-input'),
        addProjectBtn: document.getElementById('add-project-btn'),
        manageDirectivesBtn: document.getElementById('manage-directives-btn'),
        directivesModal: document.getElementById('directives-modal'),
        directivesModalCloseBtn: document.getElementById('directives-modal-close-btn'),
        directivesList: document.getElementById('directives-list'),
        newDirectiveTextInput: document.getElementById('new-directive-text-input'),
        newDirectiveCategorySelector: document.getElementById('new-directive-category-selector'),
        addDirectiveBtn: document.getElementById('add-directive-btn'),
        manageCategoriesBtn: document.getElementById('manage-categories-btn'),
        categoriesModal: document.getElementById('categories-modal'),
        categoriesModalCloseBtn: document.getElementById('categories-modal-close-btn'),
        categoryList: document.getElementById('category-list'),
        newCategoryInputModal: document.getElementById('new-category-input-modal'),
        addCategoryBtnModal: document.getElementById('add-category-btn-modal'),
        notesInput: document.getElementById('notes-input'),
        copyNoteButton: document.getElementById('copy-note-button'),
        activeDirectivesDisplay: document.getElementById('active-directives-display')
    };

    // --- 3. Data Management (localStorage) ---
    const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));
    const loadData = (key, defaultValue) => {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : defaultValue;
    };

    function initializeData() {
        projects = loadData('vyvia_projects', ['BOT_TRADING', 'WORKBENCH_OS']);
        directives = loadData('vyvia_directives', [
            { text: '[THINK: COGNITIVE_SWARM]', category: 'Modo Cognitivo', description: 'Sintetiza múltiples perspectivas para obtener sabiduría.' },
            { text: '[ENFORCE: GIT_BLOCK]', category: 'Control de Ejecución', description: 'Fuerza la inclusión de un bloque de commit de Git.' },
            { text: '[NO_SUMMARIZE]', category: 'Formato de Salida', description: 'Suprime el resumen para una respuesta detallada.' }
        ]);
        categories = loadData('vyvia_directive_categories', ['Modo Cognitivo', 'Control de Ejecución', 'Formato de Salida', 'Prueba']);
        
        saveData('vyvia_projects', projects);
        saveData('vyvia_directives', directives);
        saveData('vyvia_directive_categories', categories);
    }

    // --- 4. Render Functions ---
    function renderListItem(itemData, type, index) {
        const listItem = document.createElement('li');
        listItem.className = 'list-item';
        
        const textSpan = document.createElement('span');
        textSpan.textContent = itemData;
        listItem.appendChild(textSpan);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'item-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn edit-btn';
        editBtn.innerHTML = '✎';
        editBtn.onclick = () => handleEdit(listItem, textSpan, (newValue) => {
            if (type === 'projects') {
                projects[index] = newValue.toUpperCase();
                saveData('vyvia_projects', projects);
                renderProjects();
                renderProjectSelector();
            } else if (type === 'categories') {
                const oldName = categories[index];
                categories[index] = newValue;
                directives.forEach(dir => { if (dir.category === oldName) dir.category = newValue; });
                saveData('vyvia_directive_categories', categories);
                saveData('vyvia_directives', directives);
                renderCategories();
                renderDirectives();
                renderCategorySelector();
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = () => {
            if (confirm(`¿Seguro que quieres eliminar "${itemData}"?`)) {
                if (type === 'projects') {
                    projects.splice(index, 1);
                    saveData('vyvia_projects', projects);
                    renderProjects();
                    renderProjectSelector();
                } else if (type === 'categories') {
                    categories.splice(index, 1);
                    saveData('vyvia_directive_categories', categories);
                    renderCategories();
                    renderCategorySelector();
                }
            }
        };

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        listItem.appendChild(actionsDiv);
        return listItem;
    }
    
    function renderProjects() {
        elements.projectList.innerHTML = '';
        projects.forEach((project, index) => {
            elements.projectList.appendChild(renderListItem(project, 'projects', index));
        });
    }

    function renderCategories() {
        elements.categoryList.innerHTML = '';
        categories.forEach((category, index) => {
            elements.categoryList.appendChild(renderListItem(category, 'categories', index));
        });
    }

    function renderProjectSelector() {
        elements.projectSelector.innerHTML = '';
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project;
            option.textContent = project;
            elements.projectSelector.appendChild(option);
        });
    }

    function renderCategorySelector() {
        elements.newDirectiveCategorySelector.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            elements.newDirectiveCategorySelector.appendChild(option);
        });
    }

    function renderDirectives() {
        elements.directivesList.innerHTML = '';
        const grouped = directives.reduce((acc, dir) => {
            (acc[dir.category] = acc[dir.category] || []).push(dir);
            return acc;
        }, {});

        for (const category in grouped) {
            const header = document.createElement('h3');
            header.textContent = category;
            elements.directivesList.appendChild(header);

            const container = document.createElement('div');
            container.className = 'directive-category-container';
            grouped[category].forEach(directive => {
                const item = document.createElement('div');
                item.className = 'directive-item';
                item.title = directive.description || 'Sin descripción.';
                item.dataset.category = directive.category;
                if (activeDirectives.includes(directive.text)) {
                    item.classList.add('selected');
                }
                item.addEventListener('click', () => {
                    const index = activeDirectives.indexOf(directive.text);
                    if (index > -1) activeDirectives.splice(index, 1);
                    else activeDirectives.push(directive.text);
                    renderActiveDirectives();
                    renderDirectives();
                });

                const textSpan = document.createElement('span');
                textSpan.textContent = directive.text;
                item.appendChild(textSpan);

                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'item-actions';

                const editBtn = document.createElement('button');
                editBtn.className = 'action-btn edit-btn';
                editBtn.innerHTML = '✎';
                editBtn.onclick = (e) => {
                    e.stopPropagation();
                    const newDescription = prompt('Editar descripción:', directive.description || '');
                    if (newDescription !== null) {
                        directive.description = newDescription;
                        saveData('vyvia_directives', directives);
                        renderDirectives();
                    }
                };
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'action-btn delete-btn';
                deleteBtn.innerHTML = '×';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    directives = directives.filter(d => d.text !== directive.text);
                    activeDirectives = activeDirectives.filter(t => t !== directive.text);
                    saveData('vyvia_directives', directives);
                    renderDirectives();
                    renderActiveDirectives();
                };

                actionsDiv.appendChild(editBtn);
                actionsDiv.appendChild(deleteBtn);
                item.appendChild(actionsDiv);
                container.appendChild(item);
            });
            elements.directivesList.appendChild(container);
        }
    }

    function renderActiveDirectives() {
        elements.activeDirectivesDisplay.innerHTML = '';
        activeDirectives.forEach(text => {
            const tag = document.createElement('div');
            tag.className = 'active-directive-tag';
            const directiveData = directives.find(d => d.text === text);
            if (directiveData) tag.dataset.category = directiveData.category;
            tag.innerHTML = `<span>${text}</span>`;
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-directive-btn';
            removeBtn.innerHTML = '×';
            removeBtn.onclick = () => {
                activeDirectives = activeDirectives.filter(t => t !== text);
                renderActiveDirectives();
                renderDirectives();
            };
            tag.appendChild(removeBtn);
            elements.activeDirectivesDisplay.appendChild(tag);
        });
    }

    function handleEdit(listItem, textSpan, onSave) {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = textSpan.textContent;
        listItem.replaceChild(input, textSpan);
        input.focus();
        input.select();
    
        const save = () => {
            const newValue = input.value.trim();
            if (newValue && newValue !== textSpan.textContent) {
                onSave(newValue);
            } else {
                listItem.replaceChild(textSpan, input);
            }
        };
    
        input.addEventListener('keydown', e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') listItem.replaceChild(textSpan, input); });
        input.addEventListener('blur', () => listItem.replaceChild(textSpan, input));
    }


    function getFormattedLocalDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    // --- 5. Event Listeners Setup ---
    function setupEventListeners() {
        elements.copyButton.addEventListener('click', () => {
            const message = elements.messageInput.value;
            if (!message) return;
            const timestamp = getFormattedLocalDate();
            const header = `${elements.chatSessionInput.value || 'C?'} | [PROYECTO: ${elements.projectSelector.value}] | ${timestamp}`;
            const directiveLine = activeDirectives.join(' ');
            const fullMessage = directiveLine ? `${header}\n${directiveLine}\n\n${message}` : `${header}\n\n${message}`;
            navigator.clipboard.writeText(fullMessage).then(() => showFeedback(elements.copyButton, '¡Copiado!'));
        });

        // Project Management
        elements.manageProjectsBtn.addEventListener('click', () => elements.projectModal.style.display = 'flex');
        elements.projectModalCloseBtn.addEventListener('click', () => elements.projectModal.style.display = 'none');
        elements.addProjectBtn.addEventListener('click', () => {
            const name = elements.newProjectInput.value.trim().toUpperCase();
            if (name && !projects.includes(name)) {
                projects.push(name);
                saveData('vyvia_projects', projects);
                renderProjects();
                renderProjectSelector();
                elements.newProjectInput.value = '';
            }
        });
        
        // Directive Management
        elements.manageDirectivesBtn.addEventListener('click', () => {
            elements.directivesModal.style.display = 'flex';
            renderCategorySelector();
        });
        elements.directivesModalCloseBtn.addEventListener('click', () => elements.directivesModal.style.display = 'none');
        elements.addDirectiveBtn.addEventListener('click', () => {
            const text = elements.newDirectiveTextInput.value.trim();
            const category = elements.newDirectiveCategorySelector.value;
            if (text && category && !directives.some(d => d.text === text)) {
                directives.push({ text, category, description: "" });
                saveData('vyvia_directives', directives);
                renderDirectives();
                elements.newDirectiveTextInput.value = '';
            }
        });
        
        // Category Management
        elements.manageCategoriesBtn.addEventListener('click', () => {
            elements.categoriesModal.style.display = 'flex';
            renderCategories();
        });
        elements.categoriesModalCloseBtn.addEventListener('click', () => elements.categoriesModal.style.display = 'none');
        elements.addCategoryBtnModal.addEventListener('click', () => {
            const name = elements.newCategoryInputModal.value.trim();
            if (name && !categories.includes(name)) {
                categories.push(name);
                saveData('vyvia_directive_categories', categories);
                renderCategories();
                renderCategorySelector();
                elements.newCategoryInputModal.value = '';
            }
        });
        
        // Quick Notes
        elements.copyNoteButton.addEventListener('click', () => {
            if (!elements.notesInput.value) return;
            const timestamp = getFormattedLocalDate();
            const fullNote = `[NOTA RÁPIDA | ${timestamp}]\n${elements.notesInput.value}`;
            navigator.clipboard.writeText(fullNote).then(() => {
                showFeedback(elements.copyNoteButton, '¡Nota Copiada!');
                elements.notesInput.value = '';
            });
        });

        // Close modals on overlay click
        [elements.projectModal, elements.directivesModal, elements.categoriesModal].forEach(modal => {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) modal.style.display = 'none';
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
    function initialLoad() {
        initializeData();
        renderProjects();
        renderProjectSelector();
        renderDirectives();
        renderActiveDirectives();
        renderCategories();
        renderCategorySelector();
        setupEventListeners();
    }
    
    initialLoad();
});