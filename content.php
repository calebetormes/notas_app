<!-- content.php -->
<main id="editor"
    class="flex-1 p-6 overflow-auto flex flex-col bg-white dark:bg-[var(--whatsapp-dark-panel)] text-gray-900 dark:text-[var(--whatsapp-dark-text)]">
    <label class="block font-semibold mb-1">Título</label>
    <input id="noteTitle" type="text" placeholder="Título"
        class="w-full p-2 border rounded mb-4 bg-gray-50 dark:bg-[var(--whatsapp-dark-panel)] dark:border-[#2F3337] text-gray-900 dark:text-[var(--whatsapp-dark-text)]" />

    <label class="block font-semibold mb-1">Texto</label>
    <div class="mb-2 space-x-2">
        <button id="boldBtn"
            class="px-2 py-1 font-bold border rounded bg-gray-200 dark:bg-[var(--whatsapp-dark-panel)] text-gray-800 dark:text-[var(--whatsapp-dark-text)]">B</button>
        <button id="italicBtn"
            class="px-2 py-1 italic border rounded bg-gray-200 dark:bg-[var(--whatsapp-dark-panel)] text-gray-800 dark:text-[var(--whatsapp-dark-text)]">I</button>
        <button id="copyAllBtn"
            class="px-2 py-1 border rounded bg-gray-200 dark:bg-[var(--whatsapp-dark-panel)] text-gray-800 dark:text-[var(--whatsapp-dark-text)]">📋
            Copiar Tudo</button>
    </div>

    <div id="noteText" contenteditable="true"
        class="flex-1 w-full p-2 border rounded overflow-auto whitespace-pre-wrap focus:outline-none mb-4 bg-gray-50 dark:bg-[var(--whatsapp-dark-panel)] dark:border-[#2F3337] text-gray-900 dark:text-[var(--whatsapp-dark-text)]"
        placeholder="Cole ou digite o texto aqui (suporta formatação)"></div>

    <div class="flex space-x-2 mt-auto">
        <button id="saveBtn" class="px-4 py-2 bg-green-500 dark:bg-[#128C7E] text-white rounded">Salvar</button>
        <button id="deleteBtn" class="px-4 py-2 bg-red-500 dark:bg-[#D21F3C] text-white rounded hidden">Excluir</button>
    </div>
</main>