"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { getNotes } from "@/services/notes.service";
import toast from "react-hot-toast";
import { useUserContext } from "@/context/userContext";
import NoteCard from "@/components/layout/NoteCard";
import { upgradeProPlan } from "@/services/user.service";

export interface Note {
  _id: string;
  title: string;
  content: string;
  tenantId: string;
  ownerId: {
    _id: string;
    username: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface NotesResponse {
  notes: Note[];
  totalPages: number;
  currentPage: number;
  usage: {
    plan: string;
    notesUsed: number;
    limit: number;
    notesRemaining: number;
    isLimitReached: boolean;
  };
}

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [notes, setNotes] = useState<NotesResponse | null>(null);
  const [notesUsed, setNotesUsed] = useState(3);

  const { user } = useUserContext();

  const upgradePlan = async () => {
    const upgrade = await upgradeProPlan(user?.tenantId._id!);
    toast.success("Hooray! You are now a Pro Organization.");
  };

  useEffect(() => {
    // Fetch notes from the backend
    const fetchNotes = async () => {
      const response = await getNotes(currentPage, 6);
      if (!response.success) {
        toast.error(response.message || "Failed to fetch notes");
        return;
      }
      setNotes(response.data.notes);
    };

    fetchNotes();
  }, [notesUsed]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar username={user?.username} />

      <div className="border-b border-border bg-card">
        <div className="flex flex-col sm:flex-row min-h-16 items-start sm:items-center justify-between gap-3 sm:gap-0 px-4 sm:px-6 py-3 sm:py-0">
          <div className="flex items-center space-x-3">
            <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">
              {user?.tenantId.name}
            </h1>
            <Badge
              variant={
                notes && notes.usage.plan === "pro" ? "default" : "secondary"
              }
              className="text-xs flex-shrink-0"
            >
              {notes && notes.usage.plan.toUpperCase()}
            </Badge>
          </div>

          {/* Mobile: Stack vertically, Desktop: Horizontal */}
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-3 w-full sm:w-auto">
            <Button
              disabled={!notes || notes.usage.isLimitReached}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 w-full xs:w-auto"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden xs:inline">Create Note</span>
              <span className="xs:hidden">New Note</span>
            </Button>

            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 w-full xs:w-auto">
              <Badge variant="outline" className="text-xs whitespace-nowrap">
                {notes && notes.usage.notesRemaining === -1
                  ? "Unlimited"
                  : `${notes && notes.usage.notesRemaining}/${
                      notes && notes.usage.limit
                    } remaining`}
              </Badge>
              {/* upgrade button for admin users on free plan */}
              {user?.role === "admin" && notes?.usage.plan === "free" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground whitespace-nowrap w-full xs:w-auto"
                  onClick={() => upgradePlan()}
                >
                  <span className="hidden sm:inline">Upgrade to Pro</span>
                  <span className="sm:hidden">Upgrade</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notes Content */}
      <div className="p-4 sm:p-6">
        {/* Notes Grid - Responsive breakpoints */}
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {notes &&
            notes.notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                setNotesUsed={setNotesUsed}
              />
            ))}
        </div>

        {/* Empty state for mobile */}
        {notes && notes.notes.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              No notes yet
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first note to get started
            </p>
            <Button
              disabled={notes.usage.isLimitReached}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Note
            </Button>
          </div>
        )}

        {/* Pagination - Responsive */}
        {notes && notes.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6 sm:mt-8">
            {/* Mobile: Page info */}
            <div className="text-sm text-muted-foreground sm:hidden">
              Page {currentPage} of {notes.totalPages}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              {/* Page Numbers - Hide some on mobile */}
              <div className="flex space-x-1">
                {Array.from({ length: notes.totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // On mobile, show fewer pages
                    if (
                      typeof window !== "undefined" &&
                      window.innerWidth < 640
                    ) {
                      return (
                        page === 1 ||
                        page === notes.totalPages ||
                        Math.abs(page - currentPage) <= 1
                      );
                    }
                    return true;
                  })
                  .map((page, index, array) => (
                    <div key={page} className="flex items-center">
                      {/* Add ellipsis if there's a gap */}
                      {index > 0 && page - array[index - 1] > 1 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-8 h-8 p-0 text-xs sm:text-sm"
                      >
                        {page}
                      </Button>
                    </div>
                  ))}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, notes.totalPages))
                }
                disabled={currentPage === notes.totalPages}
                className="flex items-center gap-1"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
