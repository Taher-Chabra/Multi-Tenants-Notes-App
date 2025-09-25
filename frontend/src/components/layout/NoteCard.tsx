import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit,
  Trash2,
  Save,
  FoldVertical,
  X,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";
import { Note } from "@/app/[tenantSlug]/dashboard/page";
import { useUserContext } from "@/context/userContext";
import { deleteNote, updateNote } from "@/services/notes.service";
import toast from "react-hot-toast";

interface NoteCardProps {
  note: Note;
  setNotesUsed: React.Dispatch<React.SetStateAction<number>>;
}

export default function NoteCard({ note, setNotesUsed }: NoteCardProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const { user } = useUserContext();

  const handleNoteClick = (note: Note, edit: boolean) => {
    setSelectedNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(edit);
  };

  const handleSavingChanges = async (noteId: Note["_id"]) => {
    if (!selectedNote) return;

    const updatedNote = await updateNote(noteId, editTitle, editContent);
    if (!updatedNote.success) {
      toast.error("Failed to update note");
      return;
    }
  };

  const handleDelete = async (noteId: Note["_id"]) => {
    const deletedNote = await deleteNote(noteId);
    if (!deletedNote.success) {
      toast.error(deletedNote.message || "Failed to delete note");
      return;
    }
    setSelectedNote(null);
    setNotesUsed(deletedNote.data.usage.notesUsed);
    toast.success("Note deleted successfully");
  };

  const canEditOrDelete = (note: Note) => {
    return note.ownerId.role === "admin" || note.ownerId._id === (user && user._id);
  };

  const truncateContent = (content: Note["content"], maxLength = 120) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  return (
    <div>
      {/* Collapsed Note View */}
      <Card className="cursor-pointer border border-border bg-card hover:bg-accent/50 transition-colors">
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <h3
              className="font-medium text-card-foreground text-sm leading-tight flex-1 mr-2"
              onClick={() => handleNoteClick(note, false)}
            >
              {note.title}
            </h3>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-xs text-muted-foreground">
                {note.createdAt}
              </span>
              {canEditOrDelete(note) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-accent"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleNoteClick(note, true)}>
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(note._id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-3 w-3" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <p
            className="text-xs text-muted-foreground mb-3 leading-relaxed"
            onClick={() => handleNoteClick(note, false)}
          >
            {truncateContent(note.content)}
          </p>

          <div className="flex justify-end">
            <span className="text-xs text-muted-foreground">
              {note.ownerId.username}
            </span>
          </div>
        </div>
      </Card>

      {/* Expanded Note View */}
      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] bg-card border-border">
          <DialogHeader>
            {/* Top panel: Owner and actions */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-sm text-muted-foreground">
                Created by {selectedNote?.ownerId.username}
              </span>
              {selectedNote && canEditOrDelete(selectedNote) && (
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleSavingChanges(selectedNote._id)}
                        className="bg-primary text-primary-foreground"
                      >
                        <Save className="mr-2 h-3 w-3" />
                        Save Changes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="mr-2 h-3 w-3" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleNoteClick(selectedNote, true)}>
                        <Edit className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(selectedNote._id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setSelectedNote(null)}>
                        <FoldVertical className="mr-2 h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-xl font-semibold bg-input border-border"
                placeholder="Note title..."
              />
            ) : (
              <DialogTitle className="text-xl font-semibold text-card-foreground text-center">
                {selectedNote?.title}
              </DialogTitle>
            )}

            {/* Content */}
            {isEditing ? (
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[300px] bg-input border-border resize-none"
                placeholder="Write your note content here..."
              />
            ) : (
              <div className="prose prose-sm max-w-none text-card-foreground">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {selectedNote?.content}
                </p>
              </div>
            )}
          </div>

          {/* Bottom panel: Dates */}
          <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
            <span>Created: {selectedNote?.createdAt}</span>
            <span>Updated: {selectedNote?.updatedAt}</span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
