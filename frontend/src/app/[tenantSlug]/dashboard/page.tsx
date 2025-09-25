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
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-semibold text-foreground">
              {user?.tenantId.name}
            </h1>
            <Badge
              variant={
                notes && notes.usage.plan === "pro" ? "default" : "secondary"
              }
              className="text-xs"
            >
              {notes && notes.usage.plan.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              disabled={!notes || notes.usage.isLimitReached}
              className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Note
            </Button>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
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
                  className="text-xs border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => upgradePlan}
                >
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notes Content */}
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes &&
            notes.notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                setNotesUsed={setNotesUsed}
              />
            ))}
        </div>

        {/* Pagination */}
        {notes && notes.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex space-x-1">
              {Array.from({ length: notes.totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={
                      currentPage === notes.currentPage ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, notes.totalPages))
              }
              disabled={currentPage === notes.totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
