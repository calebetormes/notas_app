// script.js

// Elementos do DOM
const notesList = document.getElementById('notesList');
const newNoteBtn = document.getElementById('newNoteBtn');
const titleInput = document.getElementById('noteTitle');
const textDiv = document.getElementById('noteText');
const boldBtn = document.getElementById('boldBtn');
const italicBtn = document.getElementById('italicBtn');
const copyAllBtn = document.getElementById('copyAllBtn');
const saveBtn = document.getElementById('saveBtn');
const deleteBtn = document.getElementById('deleteBtn');
const toastContainer = document.getElementById('toastContainer');

// Sidebar toggle elements
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggleSidebarBtn');
const closeSidebar = document.getElementById('closeSidebarBtn');

let notes = [];
let currentId = null;

// Ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    loadNotes();

    // Ações dos botões principais
    newNoteBtn.addEventListener('click', () => {
        clearForm();
        // Se for mobile, fecha o sidebar ao criar nova nota
        if (window.innerWidth < 640) {
            sidebar.classList.add('hidden');
        }
    });
    saveBtn.addEventListener('click', saveNote);
    deleteBtn.addEventListener('click', deleteNote);
    boldBtn.addEventListener('click', () => document.execCommand('bold'));
    italicBtn.addEventListener('click', () => document.execCommand('italic'));
    copyAllBtn.addEventListener('click', copyAllText);

    // Tratamento de colar e copiar formatado
    textDiv.addEventListener('paste', handlePaste);
    textDiv.addEventListener('copy', handleCopyFragment);

    // Toggle do sidebar (abre em mobile e fecha quando clicar no X)
    toggleBtn.addEventListener('click', () => {
        // Só alterna em mobile
        if (window.innerWidth < 640) {
            sidebar.classList.toggle('hidden');
        }
    });
    closeSidebar.addEventListener('click', () => {
        // Só fecha em mobile
        if (window.innerWidth < 640) {
            sidebar.classList.add('hidden');
        }
    });

    // Se o usuário redimensionar a janela para desktop, garante que o menu fique visível
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 640) {
            sidebar.classList.remove('hidden');
        }
    });
});

// Manipulação de paste: converte *texto* em <b>texto</b> e _texto_ em <i>texto</i>
function handlePaste(e) {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const html = text
        .replace(/\*(.*?)\*/g, '<b>$1</b>')
        .replace(/_(.*?)_/g, '<i>$1</i>');
    document.execCommand('insertHTML', false, html);
}

// Manipulação de copy: converte <b>texto</b> e <i>texto</i> para markdown (*texto*, _texto_)
function handleCopyFragment(e) {
    e.preventDefault();
    const sel = window.getSelection();
    const div = document.createElement('div');
    for (let i = 0; i < sel.rangeCount; i++) {
        div.append(sel.getRangeAt(i).cloneContents());
    }

    let html = div.innerHTML
        .replace(/<b>(.*?)<\/b>/gi, '*$1*')
        .replace(/<i>(.*?)<\/i>/gi, '_$1_');

    e.clipboardData.setData(
        'text/plain',
        html.replace(/<[^>]+>/g, '')
    );
}

// Copia tudo como markdown (inclui título, se houver)
function copyAllText() {
    const title = titleInput.value.trim();
    const temp = document.createElement('div');
    temp.innerHTML = textDiv.innerHTML;
    let html = temp.innerHTML
        .replace(/<b>(.*?)<\/b>/gi, '*$1*')
        .replace(/<i>(.*?)<\/i>/gi, '_$1_')
        .replace(/<br>/gi, '\n')
        .replace(/<[^>]+>/g, '');

    const txt = (title ? `*${title}*\n` : '') + html;
    navigator.clipboard.writeText(txt).catch(console.error);
}

// Exibe um toast de confirmação
function showToast(msg) {
    const toast = document.createElement('div');
    toast.textContent = msg;
    toast.className =
        'bg-white dark:bg-gray-800 dark:text-gray-100 text-gray-900 ' +
        'px-4 py-2 rounded shadow opacity-0 transform translate-y-2 ' +
        'transition-all duration-300';
    toastContainer.appendChild(toast);

    // Animação de entrada
    setTimeout(() => {
        toast.classList.remove('opacity-0', 'translate-y-2');
        toast.classList.add('opacity-100', 'translate-y-0');
    }, 10);

    // Desaparece após 3s
    setTimeout(() => {
        toast.classList.remove('opacity-100', 'translate-y-0');
        toast.classList.add('opacity-0', 'translate-y-2');
    }, 3010);

    // Remove do DOM após animação
    setTimeout(() => {
        toastContainer.removeChild(toast);
    }, 3510);
}

// Carrega a lista de notas do servidor (API)
function loadNotes() {
    fetch('api.php?action=list')
        .then(r => r.json())
        .then(data => {
            notes = data;
            renderList();
        });
}

// Renderiza a lista de notas no sidebar
function renderList() {
    notesList.innerHTML = '';
    notes.forEach((n, i) => {
        const li = document.createElement('li');
        li.className =
            'flex items-center p-2 bg-white dark:bg-[var(--whatsapp-dark-panel)] ' +
            'rounded cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-[var(--whatsapp-dark-hover)]';
        li.innerHTML =
            `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-600 dark:text-[var(--whatsapp-dark-text)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
       </svg>` +
            `<span class="flex-1 text-gray-900 dark:text-[var(--whatsapp-dark-text)] truncate">
         ${n.title || '(Sem título)'}
       </span>`;
        li.onclick = () => {
            editNote(i);
            // Se for mobile, fecha o menu ao selecionar uma nota
            if (window.innerWidth < 640) {
                sidebar.classList.add('hidden');
            }
        };
        notesList.appendChild(li);
    });
}

// Carrega uma nota no formulário para edição
function editNote(i) {
    currentId = i;
    const n = notes[i];
    titleInput.value = n.title;
    textDiv.innerHTML = n.text;
    deleteBtn.classList.remove('hidden');
}

// Limpa o formulário para nova nota
function clearForm() {
    currentId = null;
    titleInput.value = '';
    textDiv.innerHTML = '';
    deleteBtn.classList.add('hidden');
}

// Salva a nota (cria ou atualiza) e exibe toast, sem limpar o formulário
function saveNote() {
    const payload = { id: currentId, title: titleInput.value, text: textDiv.innerHTML };
    fetch('api.php?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(() => {
        loadNotes();
        showToast('Nota salva com sucesso');
    });
}

// Exclui a nota atual e limpa o formulário
function deleteNote() {
    if (currentId === null) return;
    fetch(`api.php?action=delete&id=${currentId}`, { method: 'POST' })
        .then(() => {
            loadNotes();
            clearForm();
        });
}
