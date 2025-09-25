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
    return (
      note.ownerId.role === "admin" || note.ownerId._id === (user && user._id)
    );
  };

  const truncateContent = (content: Note["content"], maxLength = 120) => {
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  return (
    <div>
      {/* Collapsed Note View - Responsive */}
      <Card className="cursor-pointer border border-border bg-card hover:bg-accent/50 transition-colors h-full">
        <div className="p-3 sm:p-4 h-full flex flex-col">
          <div className="flex items-start justify-between mb-2 sm:mb-3">
            <h3
              className="font-medium text-card-foreground text-sm sm:text-base leading-tight flex-1 mr-2 cursor-pointer"
              onClick={() => handleNoteClick(note, false)}
            >
              {note.title}
            </h3>
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <span className="text-xs text-muted-foreground hidden sm:inline">
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
                    <DropdownMenuItem
                      onClick={() => handleNoteClick(note, true)}
                    >
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
            className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 leading-relaxed flex-1 cursor-pointer"
            onClick={() => handleNoteClick(note, false)}
          >
            {truncateContent(note.content, window.innerWidth < 640 ? 80 : 120)}
          </p>

          <div className="flex justify-between items-center mt-auto">
            <span className="text-xs text-muted-foreground">
              {note.ownerId.username}
            </span>
            <span className="text-xs text-muted-foreground sm:hidden">
              {new Date(note.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </Card>

      {/* Expanded Note View - Full Screen on Mobile */}
      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent className="sm:max-w-4xl w-full h-full sm:h-auto sm:max-h-[80vh] max-w-none m-0 sm:m-6 rounded-none sm:rounded-lg bg-card border-border p-0 sm:p-6">
          <DialogHeader className="p-4 sm:p-0">
            {/* Top panel: Owner and actions - Responsive */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pb-4 border-b border-border">
              <span className="text-sm text-muted-foreground order-2 sm:order-1">
                Created by {selectedNote?.ownerId.username}
              </span>
              {selectedNote && canEditOrDelete(selectedNote) && (
                <div className="flex items-center space-x-2 order-1 sm:order-2 w-full sm:w-auto justify-end">
                  {isEditing ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleSavingChanges(selectedNote._id)}
                        className="bg-primary text-primary-foreground flex-1 sm:flex-none"
                      >
                        <Save className="mr-2 h-3 w-3" />
                        <span className="hidden xs:inline">Save Changes</span>
                        <span className="xs:hidden">Save</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 sm:flex-none"
                      >
                        <X className="mr-2 h-3 w-3" />
                        <span className="hidden xs:inline">Cancel</span>
                        <span className="xs:hidden">Cancel</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleNoteClick(selectedNote, true)}
                        className="flex-1 sm:flex-none"
                      >
                        <Edit className="mr-2 h-3 w-3" />
                        <span className="hidden xs:inline">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(selectedNote._id)}
                        className="text-destructive hover:text-destructive flex-1 sm:flex-none"
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        <span className="hidden xs:inline">Delete</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedNote(null)}
                        className="sm:hidden"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedNote(null)}
                        className="hidden sm:flex"
                      >
                        <FoldVertical className="mr-2 h-3 w-3" />
                        <span className="hidden lg:inline">Close</span>
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4 px-4 sm:px-0 flex-1 overflow-auto">
            {/* Title - Responsive */}
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-lg sm:text-xl font-semibold bg-input border-border"
                placeholder="Note title..."
              />
            ) : (
              <DialogTitle className="text-lg sm:text-xl font-semibold text-card-foreground text-left sm:text-center px-0">
                {selectedNote?.title}
              </DialogTitle>
            )}

            {/* Content - Full height on mobile */}
            {isEditing ? (
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[200px] sm:min-h-[300px] h-[calc(100vh-300px)] sm:h-auto bg-input border-border resize-none text-sm sm:text-base"
                placeholder="Write your note content here..."
              />
            ) : (
              <div className="prose prose-sm sm:prose max-w-none text-card-foreground">
                <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                  {selectedNote?.content}
                </p>
              </div>
            )}
          </div>

          {/* Bottom panel: Dates - Responsive */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pt-4 px-4 sm:px-0 border-t border-border text-xs text-muted-foreground">
            <span>
              Created:{" "}
              {new Date(selectedNote?.createdAt || "").toLocaleDateString()}
            </span>
            <span>
              Updated:{" "}
              {new Date(selectedNote?.updatedAt || "").toLocaleDateString()}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
