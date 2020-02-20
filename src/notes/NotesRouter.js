const path = require("path");
const express = require("express");
const xss = require("xss");
const NotesService = require("./NotesService");
const jsonParser = express.json();
const NotesRouter = express.Router();

const serializeNote = note => ({
  note_name: xss(note.note_name),
  content: xss(note.content)
});
NotesRouter.route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    NotesService.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { note_name, folderid, content } = req.body;
    const newNote = { note_name, folderid, content };
    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }
    NotesService.insertNote(req.app.get("db"), newNote)
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `${newNote.id}`))
          .json(newNote);
      })
      .catch(next);
  });
NotesRouter.route("/:id")
  .all((req, res, next) => {
    NotesService.getById(req.app.get("db"), req.params.id)
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist` }
          });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.note));
  })
  .delete((req, res, next) => {
    NotesService.deleteNote(req.app.get("db"), req.params.id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { note_name, content } = req.body;
    const noteToUpdate = { note_name, content };
    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain content`
        }
      });
    }
    NotesService.updateNote(req.app.get("db"), req.params.id, noteToUpdate)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });
module.exports = NotesRouter;