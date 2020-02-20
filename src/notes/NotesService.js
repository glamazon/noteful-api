const NotesService = {
  getAllNotes(knex) {
    console.log("Hello World!");
    return knex.select("*").from("notes");
  },
  getById(knex, id) {
    return knex
      .from("notes")
      .select("*")
      .where("id", id)
      .first();
  },
  insertNote(knex, newNote) {
    return knex
      .insert(newNote)
      .into("notes")
      .returning("*")
      .then(row => {
        return rows[0];
      });
  },
  deleteNote(knex, id) {
    return knex("notes")
      .where({ id })
      .delete();
  },
  updateNote(knex, id, newNoteFields) {
    return knex("notes")
      .where({ id })
      .update(newNoteFields);
  }
}
module.exports = NotesService;