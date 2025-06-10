import { useState, useEffect } from "react";
import { Moon, Sun, Plus, Trash2 } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("legend-notes");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("legend-theme") === "light" ? false : true;
  });
  const [tag, setTag] = useState("");

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem("legend-notes", JSON.stringify(notes));
  }, [notes]);

  // Save theme to localStorage
  useEffect(() => {
    localStorage.setItem("legend-theme", darkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const addNote = () => {
    if (!input.trim()) return;
    const newNote = {
      id: Date.now(),
      text: input,
      tag: tag.trim(),
    };
    setNotes([newNote, ...notes]);
    setInput("");
    setTag("");
    setShowEmoji(false);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  return (
    <div className={`min-h-screen transition bg-gradient-to-br ${darkMode ? "from-gray-950 via-gray-900 to-black text-white" : "from-white to-gray-100 text-gray-900"} px-6 py-10`}>
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-teal-500">📝 Legendary Notes</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-md"
            title="Toggle Theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Type your note..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={() => setShowEmoji((prev) => !prev)}
            className="px-3 py-2 bg-indigo-500 hover:bg-indigo-600 rounded text-white"
            title="Pick Emoji"
          >
            😊
          </button>
          <button
            onClick={addNote}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-1"
          >
            <Plus size={16} /> Add
          </button>
        </div>

        <div className="mb-4">
          <input
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Optional Tag (e.g., 🧠 Idea, 📚 Study)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </div>

        {showEmoji && (
          <div className="mb-6">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              theme={darkMode ? "dark" : "light"}
              lazyLoadEmojis={true}
            />
          </div>
        )}

        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-lg shadow-md flex justify-between items-start transition transform hover:scale-[1.01] ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}
            >
              <div>
                <p className="text-base">{note.text}</p>
                {note.tag && (
                  <span className="mt-1 inline-block px-2 py-1 text-sm text-teal-400 bg-gray-700 rounded">
                    {note.tag}
                  </span>
                )}
              </div>
              <button
                onClick={() => deleteNote(note.id)}
                className="text-red-500 hover:text-red-700 ml-4"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          {notes.length === 0 && (
            <p className="text-center text-gray-500 italic animate-fadeIn">
              No notes yet. Start writing your legendary journey ✨
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
