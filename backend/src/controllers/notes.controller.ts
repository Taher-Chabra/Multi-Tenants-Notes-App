import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Request, Response } from 'express';
import { Note } from '../models/note.model.js';
import { Tenant } from '../models/tenant.model.js';

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
    .populate({ path: 'ownerId', select: 'username, role' })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  // Fetch tenant usage info once for the response
  const tenant = await Tenant.findById(tenantId);

  // Calculate usage info
  const notesLimit = tenant?.plan === 'free' ? 3 : -1; // -1 means unlimited
  const notesUsed = tenant?.notesUsed || 0;
  const notesRemaining =
    tenant?.plan === 'pro' ? -1 : Math.max(0, 3 - notesUsed);
  const isLimitReached = tenant?.plan === 'free' && notesUsed >= 3;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        notes,
        totalPages,
        currentPage: page,
        usage: {
          plan: tenant?.plan,
          notesUsed,
          limit: notesLimit,
          notesRemaining,
          isLimitReached,
        },
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

  const tenant = await Tenant.findById(tenantId);
  if (!tenant) {
    throw new ApiError(404, 'Tenant not found');
  }

  const limitReached = tenant.isLimitReached();

  if (limitReached) {
    throw new ApiError(
      403,
      'Free plan limit reached. Please upgrade your plan to create more notes.'
    );
  }

  const newNote = await Note.create({
    title,
    content,
    ownerId: userId,
    tenantId,
  });

  const note = await Note.findById(newNote._id).populate({
    path: 'ownerId',
    select: 'username, role',
  });

  if (!note) {
    throw new ApiError(500, 'Failed to create note');
  }

  if (tenant.plan === 'free') await tenant.incrementUsage();

  // Calculate updated usage info after creating note
  const updatedNotesUsed = tenant.notesUsed;
  const notesLimit = tenant.plan === 'free' ? 3 : -1;
  const notesRemaining =
    tenant.plan === 'pro' ? -1 : Math.max(0, 3 - updatedNotesUsed);
  const isLimitReached = tenant.plan === 'free' && updatedNotesUsed >= 3;

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        note,
        usage: {
          plan: tenant.plan,
          notesUsed: updatedNotesUsed,
          limit: notesLimit,
          notesRemaining,
          isLimitReached,
        },
      },
      'Note created successfully'
    )
  );
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
  ).populate({ path: 'ownerId', select: 'username, role' });

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
  const tenant = await Tenant.findById(tenantId);

  if (!tenant) {
    throw new ApiError(404, 'Tenant not found');
  }

  if (!note) {
    throw new ApiError(404, 'Note not found');
  }

  if (note.tenantId.toString() !== tenantId?.toString()) {
    throw new ApiError(403, 'Forbidden: Access denied');
  }
  if (
    req.user?.role !== 'admin' &&
    note.ownerId.toString() !== userId?.toString()
  ) {
    throw new ApiError(403, 'Forbidden: You cannot delete this note');
  }

  await Note.findByIdAndDelete(noteId);

  if (tenant.plan === 'free') {
    await tenant.decrementUsage();
  }

  const updatedNotesUsed = tenant.notesUsed;
  const notesRemaining =
    tenant.plan === 'pro' ? -1 : Math.max(0, 3 - updatedNotesUsed);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        { 
          deletedNote: noteId,  
          usage: {
            notesUsed: updatedNotesUsed,
            notesRemaining,
          }
        }, 
        'Note deleted successfully')
    );
});

export { getAllNotes, createNote, updateNote, deleteNote };
