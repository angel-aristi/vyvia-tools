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
        // Se asegura que las directivas por defecto tengan descripción.
        const defaultDirectives = [
            { text: '[THINK: COGNITIVE_SWARM]', category: 'Modo Cognitivo', description: 'Sintetiza múltiples perspectivas para obtener sabiduría.' },
            { text: '[ENFORCE: GIT_BLOCK]', category: 'Control de Ejecución', description: 'Fuerza la inclusión de un bloque de commit de Git.' },
            { text: '[NO_SUMMARIZE]', category: 'Formato de Salida', description: 'Suprime el resumen para una respuesta detallada.' },
            { text: '[USE_PLACEHOLDERS]', category: 'Formato de Salida', description: 'Emplea placeholders para datos sensibles o variables.' },
            { text: '[ELABORATE]', category: 'Modo Cognitivo', description: 'Solicita una explicación más profunda y detallada.' }
        ];
        directives = loadData('vyvia_directives', defaultDirectives);
        categories = loadData('vyvia_directive_categories', ['Modo Cognitivo', 'Control de Ejecución', 'Formato de Salida']);
        
        saveData('vyvia_projects', projects);
        saveData('vyvia_directives', directives);
        saveData('vyvia_directive_categories', categories);
    }

    // --- 4. Render Functions ---
    function renderProjects() {
        elements.projectSelector.innerHTML = '';
        elements.projectList.innerHTML = '';
        projects.forEach((project, index) => {
            const option = document.createElement('option');
            option.value = project;
            option.textContent = project;
            elements.projectSelector.appendChild(option);

            const listItem = document.createElement('li');
            listItem.className = 'list-item';
            listItem.dataset.index = index;

            const textSpan = document.createElement('span');
            textSpan.textContent = project;

            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '✎'; // Pencil icon
            editBtn.onclick = () => handleEdit(listItem, 'projects', index, textSpan, project);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.onclick = () => {
                projects.splice(index, 1);
                saveData('vyvia_projects', projects);
                renderProjects();
            };
            
            listItem.appendChild(textSpan);
            const btnContainer = document.createElement('div');
            btnContainer.appendChild(editBtn);
            btnContainer.appendChild(deleteBtn);
            listItem.appendChild(btnContainer);
            
            elements.projectList.appendChild(listItem);
        });
    }

    function renderCategories() {
        elements.categoryList.innerHTML = '';
        categories.forEach((category, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'list-item';
            listItem.dataset.index = index;

            const textSpan = document.createElement('span');
            textSpan.textContent = category;

            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '✎';
            editBtn.onclick = () => handleEdit(listItem, 'categories', index, textSpan, category);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.onclick = () => {
                categories.splice(index, 1);
                saveData('vyvia_directive_categories', categories);
                renderCategories();
                renderCategorySelector();
            };

            listItem.appendChild(textSpan);
            const btnContainer = document.createElement('div');
            btnContainer.appendChild(editBtn);
            btnContainer.appendChild(deleteBtn);
            listItem.appendChild(btnContainer);
            elements.categoryList.appendChild(listItem);
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

                const btnContainer = document.createElement('div');

                const editBtn = document.createElement('button');
                editBtn.className = 'edit-btn';
                editBtn.innerHTML = '✎';
                editBtn.onclick = (e) => {
                    e.stopPropagation();
                    // We pass the parent `item` to handleEdit because it contains the click logic
                    handleEdit(item, 'directives', null, textSpan, directive, 'text');
                };

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.innerHTML = '×';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    const directiveIndex = directives.findIndex(d => d.text === directive.text);
                    if (directiveIndex > -1) {
                        directives.splice(directiveIndex, 1);
                        activeDirectives = activeDirectives.filter(t => t !== directive.text);
                        saveData('vyvia_directives', directives);
                        renderDirectives();
                        renderActiveDirectives();
                    }
                };

                btnContainer.appendChild(editBtn);
                btnContainer.appendChild(deleteBtn);
                item.appendChild(btnContainer);
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
            if (directiveData) {
                tag.dataset.category = directiveData.category;
            }
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

    // --- 5. Event Listeners Setup ---
    function setupEventListeners() {
        elements.copyButton.addEventListener('click', () => {
            const message = elements.messageInput.value;
            if (!message) return;
            const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
            const header = `${elements.chatSessionInput.value || 'C?'} | [PROYECTO: ${elements.projectSelector.value}] | ${timestamp}`;
            const directiveLine = activeDirectives.join(' ');
            const fullMessage = directiveLine ? `${header}\n${directiveLine}\n\n${message}` : `${header}\n\n${message}`;
            navigator.clipboard.writeText(fullMessage).then(() => showFeedback(elements.copyButton, '¡Copiado!'));
        });

        elements.manageProjectsBtn.addEventListener('click', () => elements.projectModal.style.display = 'flex');
        elements.projectModalCloseBtn.addEventListener('click', () => elements.projectModal.style.display = 'none');
        elements.addProjectBtn.addEventListener('click', () => {
            const name = elements.newProjectInput.value.trim().toUpperCase();
            if (name && !projects.includes(name)) {
                projects.push(name);
                saveData('vyvia_projects', projects);
                renderProjects();
                elements.newProjectInput.value = '';
            }
        });
        
        elements.manageDirectivesBtn.addEventListener('click', () => elements.directivesModal.style.display = 'flex');
        elements.directivesModalCloseBtn.addEventListener('click', () => elements.directivesModal.style.display = 'none');
        elements.addDirectiveBtn.addEventListener('click', () => {
            const text = elements.newDirectiveTextInput.value.trim();
            const category = elements.newDirectiveCategorySelector.value;
            if (text && category && !directives.some(d => d.text === text)) {
                directives.push({ text, category, description: "" }); // Añadir con descripción vacía por ahora
                saveData('vyvia_directives', directives);
                renderDirectives();
                elements.newDirectiveTextInput.value = '';
            }
        });
        
        elements.manageCategoriesBtn.addEventListener('click', () => elements.categoriesModal.style.display = 'flex');
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
        
        elements.copyNoteButton.addEventListener('click', () => {
            if (!elements.notesInput.value) return;
            const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
            const fullNote = `[NOTA RÁPIDA | ${timestamp}]\n${elements.notesInput.value}`;
            navigator.clipboard.writeText(fullNote).then(() => {
                showFeedback(elements.copyNoteButton, '¡Nota Copiada!');
                elements.notesInput.value = '';
            });
        });

        // Cierre de modales al hacer clic en el overlay
        [elements.projectModal, elements.directivesModal, elements.categoriesModal].forEach(modal => {
            modal.addEventListener('click', (event) => {
                // Se cierra el modal SOLO si el clic fue directamente en el fondo del overlay
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

    function handleEdit(listItem, type, index, textSpan, originalData, field = null) {
        const currentText = field ? originalData[field] : originalData;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;

        const saveBtn = document.createElement('button');
        saveBtn.className = 'edit-btn'; // Re-use style
        saveBtn.innerHTML = '✓'; // Checkmark icon

        // Replace span with input
        listItem.replaceChild(input, textSpan);
        input.focus();

        // Temporarily disable the main item click for directives
        if (type === 'directives') {
            listItem.style.pointerEvents = 'none';
        }

        const save = () => {
            const newValue = input.value.trim();
            if (newValue && newValue !== currentText) {
                switch(type) {
                    case 'projects':
                        projects[index] = newValue.toUpperCase();
                        saveData('vyvia_projects', projects);
                        renderProjects();
                        break;
                    case 'categories':
                        categories[index] = newValue;
                        saveData('vyvia_directive_categories', categories);
                        renderCategories();
                        renderCategorySelector();
                        break;
                    case 'directives':
                        originalData[field] = newValue;
                        saveData('vyvia_directives', directives);
                        renderDirectives();
                        renderActiveDirectives(); // In case the edited one was active
                        break;
                }
            } else {
                // Restore original state if no change or empty
                listItem.replaceChild(textSpan, input);
                if (type === 'directives') {
                    listItem.style.pointerEvents = 'auto';
                }
            }
        };

        saveBtn.onclick = (e) => {
             e.stopPropagation();
             save();
        };

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                save();
            } else if (e.key === 'Escape') {
                listItem.replaceChild(textSpan, input);
                if (type === 'directives') {
                    listItem.style.pointerEvents = 'auto';
                }
            }
        });

        // Replace the whole button container if we are not in a directive
        const btnContainer = listItem.querySelector('div');
        const originalButtons = btnContainer.innerHTML;
        btnContainer.innerHTML = '';
        btnContainer.appendChild(saveBtn);

        // Restore on blur if not saved
        input.addEventListener('blur', () => {
            // Use a small delay to allow the save button click to register
            setTimeout(() => {
                if (document.activeElement !== saveBtn) {
                     listItem.replaceChild(textSpan, input);
                     btnContainer.innerHTML = originalButtons;
                      // Re-attach listeners for the restored buttons
                     if (type === 'projects') renderProjects();
                     else if (type === 'categories') renderCategories();
                     else if (type === 'directives') {
                         renderDirectives();
                         listItem.style.pointerEvents = 'auto';
                     }
                }
            }, 200);
        });
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