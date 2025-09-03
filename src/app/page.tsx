"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const fetchNotes = async () => {
    const { data } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setNotes(data as Note[]);
  };

  useEffect(() => {
    fetchNotes();

    // Realtime subscription
    const channel = supabase
      .channel("realtime-notes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notes" },
        () => {
          fetchNotes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    await supabase
      .from("notes")
      .insert({ user_id: userId, title, content, category });
    setTitle("");
    setContent("");
    setCategory("");
    fetchNotes();
  };

  const deleteNote = async (id: string) => {
    await supabase.from("notes").delete().eq("id", id);
    fetchNotes();
  };

  return (
    <>
      <main className="flex flex-col items-center py-10 gap-6 bg-background min-h-screen text-foreground">
        {/* Not Ekleme Formu */}
        <form
          onSubmit={addNote}
          className="w-full max-w-md bg-card dark:bg-gray-800 p-6 rounded-xl shadow space-y-4"
        >
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 rounded-md border border-border dark:bg-gray-700 dark:text-white"
            required
          >
            <option value="">Select Category</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="ideas">Ideas</option>
          </select>
          <Button type="submit" className="w-full">
            Add Note
          </Button>
        </form>

        {/* Filtreleme */}
        <div className="w-full max-w-md">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full p-2 rounded-md border border-border dark:bg-gray-700 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="ideas">Ideas</option>
          </select>
        </div>

        {/* Notlar */}
        <div className="w-full max-w-md space-y-4">
          {notes.filter((note) =>
            filterCategory ? note.category === filterCategory : true
          ).length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No notes yet.
            </p>
          )}
          {notes
            .filter((note) =>
              filterCategory ? note.category === filterCategory : true
            )
            .map((note) => (
              <Card
                key={note.id}
                className="p-4 bg-card dark:bg-gray-800 text-card-foreground dark:text-white transition-transform duration-200 hover:scale-105 hover:shadow-lg"
              >
                <CardHeader>
                  <CardTitle>{note.title}</CardTitle>
                  <CardDescription>
                    {note.category} •{" "}
                    {new Date(note.created_at).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <p>{note.content}</p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </main>
    </>
  );
}
