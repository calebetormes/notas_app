const notesList = document.getElementById('notesList');
const newNoteBtn = document.getElementById('newNoteBtn');
const titleInput = document.getElementById('noteTitle');
const textDiv = document.getElementById('noteText');
const boldBtn = document.getElementById('boldBtn');
const italicBtn = document.getElementById('italicBtn');
const copyAllBtn = document.getElementById('copyAllBtn');
const saveBtn = document.getElementById('saveBtn');
const deleteBtn = document.getElementById('deleteBtn');
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');

let notes = [];
let currentId = null;

window.addEventListener('DOMContentLoaded', initialize);

function initialize() {
    fetch('./api.php?action=list')
        .then(res => res.json())
        .then(data => {
            notes = Array.isArray(data) ? data : [];
            renderList();
        })
        .catch(() => showToast('Falha ao carregar notas', 'red'));

    newNoteBtn.addEventListener('click', clearForm);
    saveBtn.addEventListener('click', saveNote);
    deleteBtn.addEventListener('click', deleteNote);
    boldBtn.addEventListener('click', () => document.execCommand('bold'));
    italicBtn.addEventListener('click', () => document.execCommand('italic'));
    copyAllBtn.addEventListener('click', handleCopyAll);
    menuBtn?.addEventListener('click', () => sidebar.classList.remove('hidden'));
    closeBtn?.addEventListener('click', () => sidebar.classList.add('hidden'));
    textDiv.addEventListener('paste', handlePaste);
    textDiv.addEventListener('copy', handleCopyFragment);
}

function renderList() {
    notesList.innerHTML = '';
    notes.forEach((note, idx) => {
        const li = document.createElement('li');
        li.className = 'p-2 bg-gray-800 hover:bg-gray-700 rounded cursor-pointer';
        li.textContent = note.title || '(Sem título)';
        li.addEventListener('click', () => editNote(idx));
        notesList.appendChild(li);
    });
}

function editNote(idx) {
    currentId = idx;
    const note = notes[idx] || { title: '', text: '' };
    titleInput.value = note.title;
    textDiv.innerHTML = note.text;
    deleteBtn.classList.remove('hidden');
}

function clearForm() {
    currentId = null;
    titleInput.value = '';
    textDiv.innerHTML = '';
    deleteBtn.classList.add('hidden');
}

function saveNote() {
    const payload = { id: currentId, title: titleInput.value, text: textDiv.innerHTML };
    fetch('./api.php?action=save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(res => res.json())
        .then(() => {
            if (currentId === null) {
                notes.push({ title: payload.title, text: payload.text });
                currentId = notes.length - 1;
            } else {
                notes[currentId] = { title: payload.title, text: payload.text };
            }
            renderList();
            editNote(currentId);
            showToast('Nota salva com sucesso!', 'green');
        })
        .catch(() => showToast('Falha ao salvar', 'red'));
}

function deleteNote() {
    if (currentId === null) return;
    fetch(`./api.php?action=delete&id=${currentId}`, { method: 'POST' })
        .then(res => res.json())
        .then(() => {
            notes.splice(currentId, 1);
            clearForm();
            renderList();
            showToast('Nota excluída com sucesso!', 'red');
        })
        .catch(() => showToast('Falha ao excluir', 'red'));
}

function handlePaste(e) {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const html = text.replace(/\*(.*?)\*/g, '<b>$1</b>')
        .replace(/_(.*?)_/g, '<i>$1</i>');
    document.execCommand('insertHTML', false, html);
}

function handleCopyFragment(e) {
    e.preventDefault();
    const sel = window.getSelection();
    const div = document.createElement('div');
    for (let i = 0; i < sel.rangeCount; i++) {
        div.append(sel.getRangeAt(i).cloneContents());
    }
    let html = div.innerHTML;
    html = html.replace(/<b>(.*?)<\/b>/gi, '*$1*')
        .replace(/<i>(.*?)<\/i>/gi, '_$1_');
    const text = html.replace(/<[^>]+>/g, '');
    e.clipboardData.setData('text/plain', text);
    showToast('Texto copiado!', 'blue');
}

function handleCopyAll() {
    const title = titleInput.value.trim();
    const div = document.createElement('div');
    div.innerHTML = textDiv.innerHTML;
    let html = div.innerHTML
        .replace(/<b>(.*?)<\/b>/gi, '*$1*')
        .replace(/<i>(.*?)<\/i>/gi, '_$1_')
        .replace(/<br>/gi, '\n')
        .replace(/<[^>]+>/g, '');
    const txt = (title ? `*${title}*\n` : '') + html;
    navigator.clipboard.writeText(txt)
        .then(() => showToast('Texto copiado!', 'blue'))
        .catch(() => showToast('Erro ao copiar', 'red'));
}

function showToast(message, color) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `fixed bottom-4 right-4 bg-${color}-600 text-white px-4 py-2 rounded shadow`;
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 2000);
}
