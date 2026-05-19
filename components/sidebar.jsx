"use client";
import React from "react";
import { BookOpen, Brain, Plus, Upload, LayoutDashboard, Settings, HelpCircle, Sparkles, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
export default function Sidebar({ activeTab, setActiveTab, onNewNote, onUpload }) {
    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "notes", label: "My Notes", icon: BookOpen },
        { id: "mathlab", label: "Math Practice", icon: Calculator },
    ];
    return (<aside className="hidden md:flex w-72 h-[calc(100vh-2rem)] sticky top-4 flex-col gap-6 p-6 glass rounded-[2rem] m-4 shadow-2xl">
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 py-2">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#4dc9f1] to-[#c57eff] rounded-xl blur-lg opacity-50 animate-pulse"/>
                    <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-[#4dc9f1] to-[#c57eff]">
                        <Sparkles className="h-5 w-5 text-[#0c0c1f]"/>
                    </div>
                </div>
                <span className="text-xl font-display font-bold gradient-text tracking-tight">NoteGenius</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-2 mt-4">
                {navItems.map((item) => (<button key={item.id} onClick={() => setActiveTab(item.id)} className={cn("group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium relative overflow-hidden", activeTab === item.id
                ? "bg-gradient-to-r from-[#4dc9f1]/15 to-[#c57eff]/15 text-white border border-white/10 shadow-lg"
                : "text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent")}>
                        {activeTab === item.id && (<div className="absolute inset-0 bg-gradient-to-r from-[#4dc9f1]/10 to-[#c57eff]/10 animate-shimmer"/>)}
                        <item.icon className={cn("h-5 w-5 transition-all duration-300", activeTab === item.id
                ? "text-[#4dc9f1] drop-shadow-[0_0_8px_rgba(77,201,241,0.5)]"
                : "text-muted-foreground group-hover:text-white")}/>
                        <span className="relative z-10">{item.label}</span>
                    </button>))}
            </nav>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
                <Button onClick={onNewNote} className="group relative w-full overflow-hidden bg-gradient-to-r from-[#4dc9f1] via-[#6ed3f5] to-[#c57eff] text-[#0c0c1f] font-bold rounded-2xl h-12 shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-none">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"/>
                    <Plus className="h-5 w-5 mr-2"/>
                    <span className="relative z-10">New Note</span>
                </Button>
                <Button onClick={onUpload} variant="outline" className="w-full border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl h-12 transition-all duration-300">
                    <Upload className="h-5 w-5 mr-2"/>
                    Upload File
                </Button>
            </div>

            {/* Footer Links */}
            <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-1">
                <button onClick={() => toast.info("Settings", { description: "Laboratory configuration coming soon!" })} className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300">
                    <Settings className="h-4 w-4"/>
                    Settings
                </button>
                <button onClick={() => toast.info("Help Center", { description: "Neural guidance is being prepared." })} className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300">
                    <HelpCircle className="h-4 w-4"/>
                    Help Center
                </button>
            </div>
        </aside>);
}
