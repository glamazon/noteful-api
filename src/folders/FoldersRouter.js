const path = require("path");
const express = require("express");
const xss = require("xss");
const FoldersService = require("./FoldersService")
const FoldersRouter = express.Router();
const jsonParser = express.json();
const serializeFolder = folder => ({
  folder_name: xss(folder.folder_name)
});
FoldersRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    FoldersService.getAllFolders(knexInstance)
      .then(folders => {
        res.json(folders.map(serializeFolder));
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { folder_name } = req.body;
    const newFolder = {
      folder_name
    };
    for (const [key, value] of Object.entries(newFolder)) {
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      newFolder.folder_name = folder_name;
      FoldersService.insertFolder(req.app.get("db"), newFolder)
        .then(folder => {
          res
            .status(201)
            .location(path.posix.join(req.originalUrl, `/${folder.id}`))
            .json(serializeFolder(folder));
        })
        .catch(next);
    }
  });
FoldersRouter
  .route("/:folder_id")
  .all((req, res, next) => {
    FoldersService.getById(
      req.app.get("db"),
      req.params.folder_id)
      .then(folder => {
        if (!folder) {
          res.status(404).json({
            error: { message: `folder doesn't exist` }
          })
        }
        res.folder = folder;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeFolder(res.folder));
  })
  .delete((req, res, next) => {
    FoldersService.deleteFolder(req.app.get("db"),
      req.params.folder_id)
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { folder_name } = req.body;
    const folderToUpdate = { folder_name };
    const numberOfValues = Object.values(folderToUpdate)
      .filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain folder name`
        }
      });
    FoldersService.updateFolder(
      req.app.get("db"),
      req.params.folder_id,
      folderToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next)
  });
module.exports = FoldersRouter;