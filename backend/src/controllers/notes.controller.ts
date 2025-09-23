import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Request, Response } from 'express';
import { Note } from '../models/note.model.js';

// Get tenant-corp-specific notes

const getAllNotes = asyncHandler(async (req: Request, res: Response) => {
  const tenantId = req.user?.tenantId;

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const totalNotes = await Note.countDocuments({ tenantId });

  if (totalNotes === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { notes: [], totalPages: 0, currentPage: 0 },
          'No notes found'
        )
      );
  }

  const totalPages = Math.ceil(totalNotes / limit);
  if (page > totalPages && totalPages !== 0) {
    throw new ApiError(400, 'No more pages available');
  }

  const notes = await Note.find({ tenantId })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        notes,
        totalPages,
        currentPage: page,
      },
      'Notes fetched successfully'
    )
  );
});

// Create a new note

const createNote = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const tenantId = req.user?.tenantId;

  const { title, content } = req.body;

  if (!title || !content) {
    throw new ApiError(400, 'Title and content are required');
  }

  const newNote = await Note.create({
    title,
    content,
    ownerId: userId,
    tenantId,
  });

  if (!newNote) {
    throw new ApiError(500, 'Failed to create note');
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { note: newNote }, 'Note created successfully'));
});

// update a note

const updateNote = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const tenantId = req.user?.tenantId;
  const noteId = req.params.noteId;

  const { title, content } = req.body;
  if (!title || !content) {
    throw new ApiError(400, 'Title and content are required');
  }

  const query = { _id: noteId, tenantId };
  if (req.user?.role !== 'admin') {
    Object.assign(query, { ownerId: userId });
  }

  const note = await Note.findOneAndUpdate(
    query,
    { $set: { title, content } },
    { new: true }
  );

  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { note }, 'Note updated successfully'));
});

// Delete a note

const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const tenantId = req.user.tenantId;
  const noteId = req.params.noteId;

  const note = await Note.findById(noteId);

  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  if (note.tenantId.toString() !== tenantId?.toString()) {
    throw new ApiError(403, 'Forbidden: Access denied');
  }
  if (req.user?.role !== 'admin' && note.ownerId.toString() !== userId?.toString()) {
    throw new ApiError(403, 'Forbidden: You cannot delete this note');
  }

  await Note.findByIdAndDelete(noteId);

  return res
    .status(200)
    .json(new ApiResponse(200, { deletedNote: noteId }, 'Note deleted successfully'));
});

export { getAllNotes, createNote, updateNote, deleteNote };
