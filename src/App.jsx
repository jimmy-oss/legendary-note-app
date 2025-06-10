import { useState } from "react";
import { Plus, Trash2 } from "lucide-react"; // Optional: Add lucide icons

function App() {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState("");

  const addNote = () => {
    if (!input.trim()) return;
    setNotes([{ id: Date.now(), text: input }, ...notes]);
    setInput("");
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white px-6 py-10 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-teal-400 mb-10 animate-fadeIn">
          📝 Legendary Notes
        </h1>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's on your mind?"
            className="flex-1 p-4 rounded-xl bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-teal-500 focus:outline-none text-lg shadow-inner"
          />
          <button
            onClick={addNote}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-1 shadow transition"
          >
            <Plus size={18} /> Add
          </button>
        </div>

        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-gray-800 rounded-xl p-4 flex justify-between items-center shadow-md hover:shadow-lg transition group"
            >
              <span className="text-white text-lg">{note.text}</span>
              <button
                onClick={() => deleteNote(note.id)}
                className="text-red-400 hover:text-red-600 transition"
                title="Delete note"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          {notes.length === 0 && (
            <p className="text-center text-gray-500 italic animate-fadeIn">
              No notes yet. Start typing to create one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
