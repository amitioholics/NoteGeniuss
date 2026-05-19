"use client";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
export default function NoteEditor({ note, onUpdateNote, isBlurred }) {
    const [content, setContent] = useState(note.content);
    const [isFocused, setIsFocused] = useState(false);
    const [copied, setCopied] = useState(false);
    // Update local state when the active note changes
    useEffect(() => {
        setContent(note.content);
    }, [note.id, note.content]);
    const handleContentChange = (e) => {
        setContent(e.target.value);
    };
    const handleBlur = () => {
        setIsFocused(false);
        if (content !== note.content) {
            onUpdateNote({
                ...note,
                content,
            });
        }
    };
    const handleFocus = () => {
        setIsFocused(true);
    };
    return (<div className="w-full animate-fade-in-up">
      <Textarea value={content} onChange={handleContentChange} onBlur={handleBlur} onFocus={handleFocus} placeholder="Start typing your notes here... ✨

💡 Tip: Use NoteGenius AI features to summarize, extract keywords, and create quizzes from your notes!" className={`min-h-[450px] sm:min-h-[400px] font-mono p-6 sm:p-4 text-base sm:text-sm resize-y transition-all duration-500 custom-scrollbar ${isFocused
            ? "border-[#4dc9f1]/50 shadow-[0_0_30px_rgba(77,201,241,0.1)]"
            : "border-white/10 hover:border-white/20"} ${isBlurred ? 'blur-md grayscale opacity-50' : 'bg-[#0c0c1f]/40 backdrop-blur-md rounded-[2rem]'}`}/>
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-muted-foreground animate-fade-in-up stagger-1 px-2">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="bg-white/5 px-2 py-1 rounded-md border border-white/5 whitespace-nowrap">
            {content.length} characters • {content.split(/\s+/).filter((word) => word.length > 0).length} words
          </span>
          {isFocused && (<span className="flex items-center gap-1.5 text-[#4dc9f1] animate-pulse">
              <Sparkles className="h-3 w-3"/>
              Neural optimizing...
            </span>)}
        </div>
        <div className="flex flex-row items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0">
          <Button variant="ghost" size="sm" onClick={() => {
            navigator.clipboard.writeText(content);
            setCopied(true);
            toast.success("Copied to clipboard!", {
                style: { borderRadius: '1rem', background: '#0c0c1f', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
            });
            setTimeout(() => setCopied(false), 2000);
        }} className="flex-1 sm:flex-none h-10 gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all text-xs">
            {copied ? <Check className="h-4 w-4 text-green-400"/> : <Copy className="h-4 w-4"/>}
            {copied ? "Copied" : "Copy Content"}
          </Button>
          <span className="text-[#4dc9f1]/60 font-bold tracking-[0.2em] text-[10px] sm:text-xs">NEURAL CORE</span>
        </div>
      </div>
    </div>);
}
