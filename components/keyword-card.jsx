"use client";
import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
export default function KeywordCard({ keyword, index }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(keyword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch (err) {
            console.error("Failed to copy keyword:", err);
        }
    };
    return (<div className={`group relative glass-card p-4 cursor-pointer animate-scale-in stagger-${(index % 5) + 1} hover:border-[#c57eff]/40 transition-all duration-300`} onClick={handleCopy}>
      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3 w-3 text-[#c57eff] opacity-50 group-hover:opacity-100 transition-opacity"/>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Concept #{index + 1}</span>
          </div>
          <p className="font-semibold text-sm text-white leading-tight group-hover:text-[#c57eff] transition-colors">{keyword}</p>
        </div>

        <div className="ml-3">
          {copied ? (<Check className="h-4 w-4 text-green-400 animate-bounce-in"/>) : (<div className="p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Copy className="h-3 w-3 text-[#c57eff]"/>
            </div>)}
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#c57eff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>);
}
