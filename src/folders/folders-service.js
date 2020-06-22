const FoldersService = {
    getAllFolders(knex) {
        return knex.select('*').from('folders');
    },
    insertFolder(knex, newFolder) {
        return knex
            .insert(newFolder)
            .into('folders')
            .returning('*')
            .then(array => {
                return array[0];
            })
    },
    getById(knex, id) {
        return knex.from('folders').where('id', id).select('*').first();
    },
    deleteFolder(knex, id) {
        return knex.from('folders').where('id', id).delete();
    },
    updateFolder(knex, id, newFolderFields) {
        return knex.from('folders').where('id', id).update(newFolderFields);
    },
    getFolderNotes(knex, id) {
        return knex.from('notes').where({folder_id: id});
    }
};

module.exports = FoldersService;