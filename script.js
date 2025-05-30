const notesList = document.getElementById('notesList');
const newNoteBtn = document.getElementById('newNoteBtn');
const titleInput = document.getElementById('noteTitle');
const textDiv = document.getElementById('noteText');
const boldBtn = document.getElementById('boldBtn');
const italicBtn = document.getElementById('italicBtn');
const copyAllBtn = document.getElementById('copyAllBtn');
const saveBtn = document.getElementById('saveBtn');
const deleteBtn = document.getElementById('deleteBtn');
let notes = [];
let currentId = null;

window.addEventListener('DOMContentLoaded', () => {
    loadNotes();
    newNoteBtn.addEventListener('click', clearForm);
    saveBtn.addEventListener('click', saveNote);
    deleteBtn.addEventListener('click', deleteNote);
    boldBtn.addEventListener('click', () => document.execCommand('bold'));
    italicBtn.addEventListener('click', () => document.execCommand('italic'));
    copyAllBtn.addEventListener('click', copyAllText);

    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeBtn');
    const sidebar = document.getElementById('sidebar');
    menuBtn?.addEventListener('click', () => sidebar.classList.remove('hidden'));
    closeBtn?.addEventListener('click', () => sidebar.classList.add('hidden'));

    textDiv.addEventListener('paste', handlePaste);
    textDiv.addEventListener('copy', handleCopyFragment);
});

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
    for (let i = 0; i < sel.rangeCount; i++) div.append(sel.getRangeAt(i).cloneContents());
    let html = div.innerHTML;
    html = html.replace(/<b>(.*?)<\/b>/gi, '*$1*')
        .replace(/<i>(.*?)<\/i>/gi, '_$1_');
    e.clipboardData.setData('text/plain', html.replace(/<[^>]+>/g, ''));
}

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

function loadNotes() {
    fetch('api.php?action=list')
        .then(r => r.json())
        .then(data => { notes = data; renderList(); });
}

function renderList() {
    notesList.innerHTML = '';
    notes.forEach((n, i) => {
        const li = document.createElement('li');
        li.className = 'p-2 bg-white rounded hover:bg-blue-50 cursor-pointer';
        li.textContent = n.title || '(Sem título)';
        li.onclick = () => editNote(i);
        notesList.appendChild(li);
    });
}

function editNote(i) {
    currentId = i;
    const n = notes[i];
    titleInput.value = n.title;
    textDiv.innerHTML = n.text;
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
    fetch('api.php?action=save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    }).then(() => { loadNotes(); clearForm(); });
}

function deleteNote() {
    if (currentId === null) return;
    fetch(`api.php?action=delete&id=${currentId}`, { method: 'POST' })
        .then(() => { loadNotes(); clearForm(); });
}
