import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createNote, deleteNote, getAllNotes, updateNote } from '../controllers/notes.controller.js';
import { create } from 'domain';

const router: express.Router = express.Router();

router.use(verifyJWT);

router.route('/').get(getAllNotes)

router.route('/create').post(createNote);

router.route('/:noteId')
   .put(updateNote)
   .delete(deleteNote);

export default router;