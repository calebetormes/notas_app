<!-- sidebar.php -->
<aside id="sidebar"
    class="hidden fixed inset-0 bg-gray-100 dark:bg-[var(--whatsapp-dark-sidebar)] z-50 p-4 overflow-auto
              sm:relative sm:inset-auto sm:z-auto sm:flex sm:flex-col sm:w-64 sm:h-full sm:p-4 sm:overflow-auto transition-transform duration-200 ease-in-out">
    <!-- Botão fechar em mobile (aparece no overlay) -->
    <div class="sm:hidden flex justify-end mb-4">
        <button id="closeSidebarBtn"
            class="p-2 rounded hover:bg-gray-300 dark:hover:bg-[var(--whatsapp-dark-hover)] focus:outline-none"
            title="Fechar menu">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800 dark:text-[var(--whatsapp-dark-text)]"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
    </div>

    <!-- botão de nova nota -->
    <button id="newNoteBtn"
        class="w-full mb-4 bg-blue-600 dark:bg-[var(--whatsapp-dark-button)] text-white py-2 px-4 rounded hover:brightness-110 transition"
        title="Nova Nota">
        + Nova Nota
    </button>

    <!-- lista de notas -->
    <ul id="notesList" class="w-full flex flex-col space-y-2">
        <!-- Items gerados via JS -->
    </ul>
</aside>