class NoteClass {
  id;
  title;
  notes;
  constructor(id, title, notes) {
    this.id = id;
    this.notes = notes;
    this.title = title;
  }

  addNotes(newNotes) {
    this.notes = [...this.notes, newNotes];
  }
}

export default NoteClass;
