const NotesService = {
    getAllNotes(knex) {
        return knex.select('*').from('notes');
    },
    insertNote(knex, newNote) {
        return knex
            .insert(newNote)
            .into('notes')
            .returning('*')
            .then(array => {
                return array[0];
            })
    },
    getById(knex, id) {
        return knex.from('notes').where('id', id).select('*').first();
    },
    deleteNote(knex, id) {
        return knex.from('notes').where('id', id).delete();
    },
    updateNote(knex, id, newNoteFields) {
        return knex.from('notes').where('id', id).update(newNoteFields);
    },
};

module.exports = NotesService;