import React, { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { useStore } from "../store/store";
import { Note } from "../types";
import CyberpunkLayout from "../components/CyberpunkLayout";

const NotesPage: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote } = useStore();
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const handleSave = (): void => {
    if (title && content) {
      if (activeNote) {
        updateNote(activeNote.id, { title, content });
      } else {
        addNote({
          id: Date.now().toString(),
          title,
          content,
          createdAt: new Date(),
        });
      }
      setTitle("");
      setContent("");
      setActiveNote(null);
    }
  };

  return (
    <div className="relative min-h-screen">
      <CyberpunkLayout className="absolute inset-0 z-0" />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto+Mono:wght@400;500&display=swap');
            .orbitron { font-family: 'Orbitron', sans-serif; }
            .roboto-mono { font-family: 'Roboto Mono', monospace; }
          `}
        </style>
        <div className="w-full max-w-5xl grid grid-cols-12 gap-6">
          <div className="col-span-4 bg-[#0a0a2f]/70 border border-[#4f9ecf] shadow-lg rounded-lg">
            <div className="p-4 border-b border-[#4f9ecf]">
              <button
                onClick={() => {
                  setActiveNote(null);
                  setTitle("");
                  setContent("");
                }}
                className="flex items-center w-full px-4 py-2 text-sm bg-[#ff2a6d] text-white rounded-lg hover:bg-[#ff2a6d]/80 orbitron"
              >
                <Plus className="h-4 w-4 mr-2" /> New Note
              </button>
            </div>
            <div className="divide-y divide-[#4f9ecf]/50">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`p-4 cursor-pointer hover:bg-[#12122A] ${
                    activeNote?.id === note.id ? "bg-[#12122A]" : ""
                  }`}
                  onClick={() => {
                    setActiveNote(note);
                    setTitle(note.title);
                    setContent(note.content);
                  }}
                >
                  <h3 className="font-medium text-[#4f9ecf] orbitron">
                    {note.title}
                  </h3>
                  <p className="text-sm text-[#7c4dff] roboto-mono truncate">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-8 bg-[#0a0a2f]/70 border border-[#4f9ecf] shadow-lg rounded-lg p-6">
            <input
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
              placeholder="Note title"
              className="w-full px-4 py-2 bg-[#12122A] text-white border border-[#4f9ecf] rounded-lg focus:ring-2 focus:ring-[#ff2a6d] focus:border-transparent roboto-mono"
            />
            <textarea
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setContent(e.target.value)
              }
              placeholder="Start writing..."
              className="w-full h-[calc(100vh-300px)] px-4 py-2 mt-4 bg-[#12122A] text-white border border-[#4f9ecf] rounded-lg focus:ring-2 focus:ring-[#ff2a6d] focus:border-transparent roboto-mono resize-none"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-[#ff2a6d] text-white rounded-lg hover:bg-[#ff2a6d]/80 orbitron"
              >
                <Save className="h-4 w-4 mr-2" /> Save
              </button>
              {activeNote && (
                <button
                  onClick={() => {
                    deleteNote(activeNote.id);
                    setActiveNote(null);
                    setTitle("");
                    setContent("");
                  }}
                  className="flex items-center px-4 py-2 bg-[#7c4dff] text-white rounded-lg hover:bg-[#7c4dff]/80 orbitron"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPage;