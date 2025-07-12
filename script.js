// Contenido para script.js
const messageInput = document.getElementById('message-input');
const copyButton = document.getElementById('copy-button');
const chatSessionInput = document.getElementById('chat-session-input');
const projectSelector = document.getElementById('project-selector');
const manageProjectsBtn = document.getElementById('manage-projects-btn');
const projectModal = document.getElementById('project-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const projectList = document.getElementById('project-list');
const newProjectInput = document.getElementById('new-project-input');
const addProjectBtn = document.getElementById('add-project-btn');
let projects = [];
const manageDirectivesBtn = document.getElementById('manage-directives-btn');
const directivesModal = document.getElementById('directives-modal');
const directivesModalCloseBtn = document.getElementById('directives-modal-close-btn');
const directivesList = document.getElementById('directives-list');
const newDirectiveTextInput = document.getElementById('new-directive-text-input');
const newDirectiveCategoryInput = document.getElementById('new-directive-category-input');
const addDirectiveBtn = document.getElementById('add-directive-btn');
let directives = [];
let activeDirectives = [];
let categories = [];

function renderActiveDirectives() {
    const displayContainer = document.getElementById('active-directives-display');
    displayContainer.innerHTML = '';
    activeDirectives.forEach(directiveText => {
        const tag = document.createElement('div');
        tag.className = 'active-directive-tag';
        const directiveData = directives.find(d => d.text === directiveText);
        if (directiveData) {
            tag.dataset.category = directiveData.category;
        }
        tag.textContent = directiveText;
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-directive-btn';
        removeBtn.innerHTML = '×';
        removeBtn.onclick = () => {
            const index = activeDirectives.indexOf(directiveText);
            if (index > -1) {
                activeDirectives.splice(index, 1);
                renderActiveDirectives();
                renderDirectives();
                renderCategorySelector();
            }
        };
        tag.appendChild(removeBtn);
        displayContainer.appendChild(tag);
    });
}

function renderCategorySelector() { 
     const selector = document.getElementById('new-directive-category-selector'); 
     // Asegurarse de que el elemento existe antes de manipularlo 
     if (!selector) return; 
 
     selector.innerHTML = ''; // Limpiar opciones 
     categories.forEach(category => { 
         const option = document.createElement('option'); 
         option.value = category; 
         option.textContent = category; 
         selector.appendChild(option); 
     }); 
 }

function loadDirectives() {
    const storedDirectives = localStorage.getItem('vyvia_directives');
    if (storedDirectives) {
        directives = JSON.parse(storedDirectives);
    } else {
        directives = [
            { text: '[MODE: DEEP_FOCUS]', category: 'Modo Cognitivo' }, { text: '[MODE: QUICK_INJECT]', category: 'Modo Cognitivo' }, { text: '[MODE: LIGHT_CONNECT]', category: 'Modo Cognitivo' }, { text: '[SET_ACTIVE_SYMBOL]', category: 'Modo Cognitivo' }, { text: '[SET_RELEVANT_CONTEXT]', category: 'Modo Cognitivo' },
            { text: '[ENFORCE: GIT_BLOCK]', category: 'Control de Ejecución' }, { text: '[ENFORCE: NO_TOOL_CALL]', category: 'Control de Ejecución' }, { text: '[ENFORCE: TOOL_CALL]', category: 'Control de Ejecución' }, { text: '[AWAIT_USER_FEEDBACK]', category: 'Control de Ejecución' }, { text: '[AWAIT_USER_APPROVAL]', category: 'Control de Ejecución' },
            { text: '[INFO: SKE]', category: 'Formato de Salida' }, { text: '[INFO: HPS]', category: 'Formato de Salida' }, { text: '[INFO: CAVEAT]', category: 'Formato de Salida' }, { text: '[OUTPUT: SPANISH]', category: 'Formato de Salida' }, { text: '[OUTPUT: ENGLISH]', category: 'Formato de Salida' }
        ];
        saveDirectives();
    }
    renderDirectives();
}

function saveDirectives() { localStorage.setItem('vyvia_directives', JSON.stringify(directives)); }

function renderDirectives() {
    directivesList.innerHTML = '';
    const groupedDirectives = directives.reduce((acc, directive) => {
        acc[directive.category] = acc[directive.category] || [];
        acc[directive.category].push(directive);
        return acc;
    }, {});
    for (const category in groupedDirectives) {
        const categoryHeader = document.createElement('h3');
        categoryHeader.textContent = category;
        categoryHeader.style.color = 'var(--primary-color)';
        categoryHeader.style.marginTop = '20px';
        directivesList.appendChild(categoryHeader);
        const categoryContainer = document.createElement('div');
        categoryContainer.className = 'directive-category-container';
        groupedDirectives[category].forEach((directive) => {
            const directiveItem = document.createElement('div');
            directiveItem.dataset.category = category;
            directiveItem.className = 'directive-item';
            if (activeDirectives.includes(directive.text)) {
                directiveItem.classList.add('selected');
            }
            directiveItem.addEventListener('click', () => {
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
            directiveItem.appendChild(textSpan);
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-project-btn';
            deleteBtn.innerHTML = '×';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                const originalIndex = directives.findIndex(d => d.text === directive.text && d.category === directive.category);
                if (originalIndex > -1) {
                    directives.splice(originalIndex, 1);
                    const activeIndex = activeDirectives.indexOf(directive.text);
                    if (activeIndex > -1) {
                        activeDirectives.splice(activeIndex, 1);
                    }
                    saveDirectives();
                    renderDirectives();
                    renderActiveDirectives();
                }
            };
            directiveItem.appendChild(deleteBtn);
            categoryContainer.appendChild(directiveItem);
        });
        directivesList.appendChild(categoryContainer);
    }
}

function loadProjects() {
    const storedProjects = localStorage.getItem('vyvia_projects');
    if (storedProjects) {
        projects = JSON.parse(storedProjects);
    } else {
        projects = ['BOT_TRADING', 'WORKBENCH_OS'];
        saveProjects();
    }
    renderProjects();
    loadDirectives();
    renderActiveDirectives();
}

function saveProjects() { localStorage.setItem('vyvia_projects', JSON.stringify(projects)); }

manageDirectivesBtn.addEventListener('click', () => {
    directivesModal.style.display = 'flex';
    renderDirectives();
});
directivesModalCloseBtn.addEventListener('click', () => directivesModal.style.display = 'none');
addDirectiveBtn.addEventListener('click', () => { 
     const text = newDirectiveTextInput.value.trim(); 
     const categorySelector = document.getElementById('new-directive-category-selector'); 
     const category = categorySelector.value; 
 
     if (text && category) { 
         if (!directives.some(d => d.text === text)) { 
             directives.push({ text, category, description: "" }); // Añadir con descripción vacía por ahora 
             saveDirectives(); 
             renderDirectives(); 
             newDirectiveTextInput.value = ''; 
         } else { 
             alert('Esa directiva ya existe.'); 
         } 
     } else { 
         alert('El texto de la directiva y la categoría son obligatorios.'); 
     } 
 });

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
            saveProjects();
            renderProjects();
        };
        listItem.appendChild(deleteBtn);
        projectList.appendChild(listItem);
    });
}

function addNewProject() {
    const newProjectName = newProjectInput.value.trim().toUpperCase();
    if (newProjectName && !projects.includes(newProjectName)) {
        projects.push(newProjectName);
        saveProjects();
        renderProjects();
        newProjectInput.value = '';
    }
}

manageProjectsBtn.addEventListener('click', () => { projectModal.style.display = 'flex'; });
modalCloseBtn.addEventListener('click', () => { projectModal.style.display = 'none'; });
window.addEventListener('click', (event) => {
    if (event.target === projectModal) {
        projectModal.style.display = 'none';
    }
});
addProjectBtn.addEventListener('click', addNewProject);
newProjectInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addNewProject();
});
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    loadCategories();
});

function getFormattedTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function showFeedback(buttonElement, message) {
    const originalText = buttonElement.textContent;
    buttonElement.textContent = message;
    buttonElement.style.backgroundColor = 'var(--button-active-bg)';
    setTimeout(() => {
        buttonElement.textContent = originalText;
        buttonElement.style.backgroundColor = 'var(--button-bg)';
    }, 2000);
}

copyButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (!message) { alert('Por favor, escribe un mensaje antes de copiar.'); return; }
    const timestamp = getFormattedTimestamp();
    const projectContext = projectSelector.value || "General";
    const chatSession = chatSessionInput.value;
    const protocolDirective = activeDirectives.join(' ');
    if (!chatSession) { alert('Por favor, especifica el número de sesión (ej. C9.1)'); return; }
    const header = `${chatSession} | [PROYECTO: ${projectContext}] | ${timestamp}`;
    let fullMessage;
    if (protocolDirective) {
        fullMessage = `${header}\n${protocolDirective}\n\n${message}`;
    } else {
        fullMessage = `${header}\n\n${message}`;
    }
    navigator.clipboard.writeText(fullMessage).then(() => {
        showFeedback(copyButton, '¡Copiado!');
    }).catch(err => alert('Hubo un error al intentar copiar el texto.'));
});

const notesInput = document.getElementById('notes-input');
const copyNoteButton = document.getElementById('copy-note-button');
copyNoteButton.addEventListener('click', () => {
    const noteText = notesInput.value;
    if (!noteText) { alert('Por favor, escribe una nota antes de copiar.'); return; }
    const timestamp = getFormattedTimestamp();
    const fullNote = `[NOTA RÁPIDA | ${timestamp}]\n${noteText}`;
    navigator.clipboard.writeText(fullNote).then(() => {
        showFeedback(copyNoteButton, '¡Nota Copiada!');
        notesInput.value = '';
    }).catch(err => alert('Hubo un error al intentar copiar la nota.'));
});

const manageCategoriesBtn = document.getElementById('manage-categories-btn');
function loadCategories() {
    const storedCategories = localStorage.getItem('vyvia_directive_categories');
    if (storedCategories) {
        categories = JSON.parse(storedCategories);
    } else {
        categories = ['Modo Cognitivo', 'Control de Ejecución', 'Formato de Salida'];
        saveCategories();
    }
    renderCategorySelector();
}

function saveCategories() { localStorage.setItem('vyvia_directive_categories', JSON.stringify(categories)); }

manageCategoriesBtn.addEventListener('click', () => {
    const newCategoryList = prompt('Gestionar categorías (separadas por coma):', categories.join(', '));
    if (newCategoryList !== null) {
        categories = newCategoryList.split(',').map(c => c.trim()).filter(Boolean);
        saveCategories();
        renderCategorySelector();
        renderDirectives();
    }
});