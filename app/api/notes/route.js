export const runtime = "nodejs";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
// Path to our JSON file that stores notes
const DATA_FILE = path.join(process.cwd(), "data", "notes.json");
// Ensure the data directory exists
const ensureDataDir = () => {
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
};
// Read notes from the JSON file
const getNotes = () => {
    ensureDataDir();
    try {
        const data = fs.readFileSync(DATA_FILE, "utf8");
        return JSON.parse(data);
    }
    catch (error) {
        console.error("Error reading notes:", error);
        return [];
    }
};
// Write notes to the JSON file
const saveNotes = (notes) => {
    ensureDataDir();
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
        return true;
    }
    catch (error) {
        console.error("Error saving notes:", error);
        return false;
    }
};
// GET handler to retrieve all notes
export async function GET() {
    const notes = getNotes();
    return NextResponse.json(notes);
}
// POST handler to create a new note
export async function POST(request) {
    try {
        const newNote = await request.json();
        // Validate the note
        if (!newNote.title || typeof newNote.content !== "string") {
            return NextResponse.json({ error: "Invalid note data" }, { status: 400 });
        }
        // Add timestamps and ID if not provided
        const noteToSave = {
            id: newNote.id || Date.now().toString(),
            title: newNote.title,
            content: newNote.content,
            tags: newNote.tags || [],
            createdAt: newNote.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const notes = getNotes();
        notes.push(noteToSave);
        if (saveNotes(notes)) {
            return NextResponse.json(noteToSave, { status: 201 });
        }
        else {
            return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
        }
    }
    catch (error) {
        console.error("Error creating note:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
// PUT handler to update a note
export async function PUT(request) {
    try {
        const updatedNote = await request.json();
        // Validate the note
        if (!updatedNote.id || !updatedNote.title) {
            return NextResponse.json({ error: "Invalid note data" }, { status: 400 });
        }
        const notes = getNotes();
        const noteIndex = notes.findIndex((note) => note.id === updatedNote.id);
        if (noteIndex === -1) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }
        // Update the note
        notes[noteIndex] = {
            ...notes[noteIndex],
            ...updatedNote,
            updatedAt: new Date().toISOString(),
        };
        if (saveNotes(notes)) {
            return NextResponse.json(notes[noteIndex]);
        }
        else {
            return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
        }
    }
    catch (error) {
        console.error("Error updating note:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
// DELETE handler to delete a note
export async function DELETE(request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        if (!id) {
            return NextResponse.json({ error: "Note ID is required" }, { status: 400 });
        }
        const notes = getNotes();
        const filteredNotes = notes.filter((note) => note.id !== id);
        if (notes.length === filteredNotes.length) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }
        if (saveNotes(filteredNotes)) {
            return NextResponse.json({ success: true });
        }
        else {
            return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
        }
    }
    catch (error) {
        console.error("Error deleting note:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
