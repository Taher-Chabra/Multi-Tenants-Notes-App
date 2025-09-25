import { apiRequest } from "@/utils/requestHandler";

// fetch all notes
const getNotes = async (page: number, limit: number) => {
  return await apiRequest(`/notes?page=${page}&limit=${limit}`);
};

// create a new note
const createNote = async (title: string, content: string) => {
  return await apiRequest("/notes/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
};

// update a note
const updateNote = async (noteId: string, title: string, content: string) => {
  return await apiRequest(`/notes/${noteId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
};

// delete a note
const deleteNote = async (noteId: string) => {
  return await apiRequest(`/notes/${noteId}`, {
    method: "DELETE",
  });
};

export { getNotes, createNote, updateNote, deleteNote };
