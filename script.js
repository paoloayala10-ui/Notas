const notesKey = "keepNotes";
const noteTitle = document.getElementById("noteTitle");
const noteText = document.getElementById("noteText");
const addNote = document.getElementById("addNote");
const clearAll = document.getElementById("clearAll");
const notesGrid = document.getElementById("notesGrid");

let notes = JSON.parse(localStorage.getItem(notesKey)) || [];

function saveNotes() {
  localStorage.setItem(notesKey, JSON.stringify(notes));
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function renderNotes() {
  notesGrid.innerHTML = "";

  if (notes.length === 0) {
    const empty = document.createElement("div");
    empty.className = "no-notes";
    empty.innerHTML = "<strong>Sin notas</strong><br>Agrega una nota para verla aquí.";
    notesGrid.appendChild(empty);
    return;
  }

  notes.slice().reverse().forEach((note, index) => {
    const card = document.createElement("article");
    card.className = "note-card";

    const title = document.createElement("h2");
    title.textContent = note.title || "Nota sin título";
    card.appendChild(title);

    const body = document.createElement("p");
    body.textContent = note.text || "(Información vacía)";
    card.appendChild(body);

    const meta = document.createElement("div");
    meta.className = "note-meta";

    const dateLabel = document.createElement("span");
    dateLabel.textContent = `Creada: ${formatDate(note.createdAt)}`;
    meta.appendChild(dateLabel);

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const deleteBtn = document.createElement("button");
    deleteBtn.title = "Eliminar nota";
    deleteBtn.textContent = "🗑";
    deleteBtn.addEventListener("click", () => {
      notes = notes.filter((_, i) => i !== notes.length - 1 - index);
      saveNotes();
      renderNotes();
    });
    actions.appendChild(deleteBtn);

    meta.appendChild(actions);
    card.appendChild(meta);
    notesGrid.appendChild(card);
  });
}

function addNewNote() {
  const title = noteTitle.value.trim();
  const text = noteText.value.trim();

  if (!title && !text) {
    alert("Escribe un título o contenido para agregar una nota.");
    return;
  }

  notes.push({
    title,
    text,
    createdAt: Date.now(),
  });

  saveNotes();
  renderNotes();
  noteTitle.value = "";
  noteText.value = "";
}

addNote.addEventListener("click", addNewNote);
clearAll.addEventListener("click", () => {
  if (!notes.length) return;
  if (confirm("¿Borrar todas las notas? Esta acción no se puede deshacer.")) {
    notes = [];
    saveNotes();
    renderNotes();
  }
});

noteText.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    addNewNote();
  }
});

renderNotes();
