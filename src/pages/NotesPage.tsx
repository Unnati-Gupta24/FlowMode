import React, { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { useStore } from "../store/store";
import { Note } from "../types";

export default function NotesPage() {
  const { notes, addNote, updateNote, deleteNote } = useStore();
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
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
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-4 bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <button
            onClick={() => {
              setActiveNote(null);
              setTitle("");
              setContent("");
            }}
            className="flex items-center w-full px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" /> New Note
          </button>
        </div>
        <div className="divide-y">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                activeNote?.id === note.id ? "bg-gray-50" : ""
              }`}
              onClick={() => {
                setActiveNote(note);
                setTitle(note.title);
                setContent(note.content);
              }}
            >
              <h3 className="font-medium text-gray-900">{note.title}</h3>
              <p className="text-sm text-gray-500 truncate">{note.content}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="col-span-8 bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="w-full h-[calc(100vh-300px)] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
        <div className="flex justify-between mt-4">
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
