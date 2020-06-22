const path = require('path')
const express = require('express')
const cors = require('cors')
const xss = require('xss')
const FoldersService = require('./folders-service')


const folderRouter = express.Router()
const jsonParser = express.json()

const serializeFolder = folder => ({
    id: folder.id,
    name: xss(folder.name)
})

const serializeNote = note => ({
    ...note,
    name: xss(note.name),
    content: xss(note.content)
  });

folderRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        FoldersService.getAllFolders(knexInstance)
            .then(folders => {
                res.json(folders.map(serializeFolder))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const {name} = req.body
        const newFolder = {name}
        for (const [key, value] of Object.entries(newFolder))
        if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
        FoldersService.insertFolder(req.app.get('db'), newFolder)
        .then(folder => {
            res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${folder.id}`))
            .json(serializeFolder(folder))
      })
        .catch(next)
    })

folderRouter
    .route('/:folder_id')
    .all((req, res, next) => {
        const {folder_id} = req.params
        FoldersService.getById(req.app.get('db'), folder_id)
        .then(folder => {
            if (!folder) {
              return res.status(404).json({
                error: { message: `Folder doesn't exist` }
              })
            }
            res.folder = folder
            next()
          })
          .catch(next)
      })
    .get((req,res,next) => {
        const knexInstance = req.app.get('db');
        FoldersService.getFolderNotes(knexInstance, req.params.folder_id)
          .then((notes)=>{
            res.json(notes.map(note=>serializeNote(note)));
          })
          .catch(next);
      })
    .delete((req, res, next) => {
        const {folder_id} = req.params
        FoldersService.deleteFolder(req.app.get('db'), folder_id)
        .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const {name} = req.body
        const folderToUpdate = {name}
        const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain a name`
                }
            })
        }
        FoldersService.updateFolder(req.app.get('db'), req.params.folder_id, folderToUpdate)
        .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
    })
    


module.exports = folderRouter;