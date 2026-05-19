"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, FileText, Clock } from "lucide-react";
export default function NotesList({ notes, activeNoteId, onSelectNote, onDeleteNote }) {
    if (notes.length === 0) {
        return (<div className="text-center py-12 px-4 border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50"/>
        <h3 className="text-lg font-medium mb-2 gradient-text">No notes yet</h3>
        <p className="text-muted-foreground text-sm">Create your first note to get started</p>
      </div>);
    }
    return (<ScrollArea className="h-full pr-3 custom-scrollbar">
      <div className="space-y-4">
        {notes.map((note, index) => (<div key={note.id} className={`flex flex-col p-6 sm:p-5 rounded-[2rem] sm:rounded-2xl cursor-pointer transition-all duration-500 hover:scale-[1.02] ${note.id === activeNoteId
                ? "bg-[#4dc9f1]/10 border border-[#b762fd]/30 shadow-[0_0_20px_rgba(77,201,241,0.1)]"
                : "bg-white/5 border border-white/10 hover:bg-white/10"}`} onClick={() => onSelectNote(note)}>
            <div className="flex justify-between items-start gap-4">
              <div className="overflow-hidden flex-1">
                <div className="font-display font-black truncate text-xl sm:text-lg text-white group-hover:text-[#4dc9f1] transition-colors leading-tight">
                  {note.title}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3"/>
                  {new Date(note.updatedAt).toLocaleDateString()}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500" onClick={(e) => {
                e.stopPropagation();
                onDeleteNote(note.id);
            }}>
                <Trash2 className="h-4 w-4"/>
              </Button>
            </div>

            {note.tags.length > 0 && (<div className="flex flex-wrap gap-2 mt-4">
                {note.tags.slice(0, 2).map((tag, i) => (<div key={i} className="flex items-center text-[10px] font-bold text-[#4dc9f1] bg-[#4dc9f1]/10 px-2.5 py-1 rounded-full">
                    {tag}
                  </div>))}
              </div>)}

            {note.content && (<p className="text-sm text-muted-foreground mt-4 line-clamp-2 leading-relaxed">
                {note.content}
              </p>)}
          </div>))}
      </div>
    </ScrollArea>);
}
