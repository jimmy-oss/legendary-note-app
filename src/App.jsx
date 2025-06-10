import { useState, useEffect } from "react";
import { Moon, Sun, Plus, Trash2, Download } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";

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
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem("legend-notes", JSON.stringify(notes));
  }, [notes]);

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
      isPinned: false,
    };
    setNotes([newNote, ...notes]);
    setInput("");
    setTag("");
    setShowEmoji(false);
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  const togglePin = (id) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );
  };

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  const filteredNotes = notes
    .filter((note) => {
      const term = searchTerm.toLowerCase();
      return (
        note.text.toLowerCase().includes(term) ||
        note.tag.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => b.isPinned - a.isPinned);

  const exportNotes = (format) => {
    const content =
      format === "md"
        ? notes.map((n) => `**${n.tag || "Note"}**\n\n${n.text}`).join("\n\n---\n\n")
        : notes.map((n) => `[${n.tag || "Note"}]: ${n.text}`).join("\n\n");

    const blob = new Blob([content], {
      type: format === "md" ? "text/markdown" : "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `legendary_notes.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`min-h-screen transition bg-gradient-to-br ${
        darkMode
          ? "from-gray-950 via-gray-900 to-black text-white"
          : "from-white to-gray-100 text-gray-900"
      } px-6 py-10`}
    >
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

        <div className="flex items-start gap-2 mb-4">
          <textarea
            rows={3}
            className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y max-h-48"
            placeholder="Type your note..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex flex-col gap-2">
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
        </div>

        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Optional Tag (e.g., 📚 Study)"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
          <input
            className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="🔍 Search notes or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => exportNotes("txt")}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded flex items-center gap-2"
          >
            <Download size={16} /> Export .txt
          </button>
          <button
            onClick={() => exportNotes("md")}
            className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded flex items-center gap-2"
          >
            <Download size={16} /> Export .md
          </button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {filteredNotes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`p-4 rounded-lg shadow-md flex justify-between items-start ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                }`}
              >
                <div>
                  <p className="whitespace-pre-wrap">{note.text}</p>
                  {note.tag && (
                    <span className="mt-1 inline-block px-2 py-1 text-sm text-teal-400 bg-gray-700 rounded">
                      {note.tag}
                    </span>
                  )}
                </div>
                <div className="ml-4 flex flex-col items-end gap-2">
                  <button
                    onClick={() => togglePin(note.id)}
                    className="text-yellow-400 hover:text-yellow-600"
                    title={note.isPinned ? "Unpin" : "Pin"}
                  >
                    {note.isPinned ? "📍" : "📌"}
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredNotes.length === 0 && (
            <p className="text-center text-gray-500 italic animate-fadeIn">
              No results found. Try a different tag or keyword.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
