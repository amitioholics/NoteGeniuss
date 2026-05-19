"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus, Brain, BookOpen, Lightbulb, TrendingUp, Zap, Clock, FileText, ArrowRight, X, Save, Menu, LayoutDashboard, Upload, Calculator } from "lucide-react";
import { toast } from "sonner";
import NoteEditor from "@/components/note-editor";
import NotesList from "@/components/notes-list";
import Sidebar from "@/components/sidebar";
import AboutDialog from "@/components/about-dialog";
import KeywordCard from "@/components/keyword-card";
import FileUploadDialog from "@/components/file-upload-dialog";
import MathLab from "@/components/math-lab";
import { summarizeNote, extractKeywords, generateQuiz } from "@/lib/ai-helpers";
export default function Home() {
    const [notes, setNotes] = useState([]);
    const [activeNote, setActiveNote] = useState(null);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [mounted, setMounted] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isLabFocused, setIsLabFocused] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    useEffect(() => {
        if (isLabFocused) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }
    }, [isLabFocused]);
    useEffect(() => {
        setMounted(true);
        const savedNotes = localStorage.getItem("notegenius-notes");
        if (savedNotes) {
            try {
                setNotes(JSON.parse(savedNotes));
            }
            catch (e) {
                console.error("Failed to load notes", e);
            }
        }
    }, []);
    useEffect(() => {
        if (mounted) {
            localStorage.setItem("notegenius-notes", JSON.stringify(notes));
        }
    }, [notes, mounted]);
    const handleCreateNote = () => {
        const newNote = {
            id: Date.now().toString(),
            title: "Untitled Note",
            content: "",
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setNotes([newNote, ...notes]);
        setActiveNote(newNote);
        setActiveTab("editor");
    };
    const handleUpdateNote = (updatedNote) => {
        const updatedNotes = notes.map((note) => note.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date().toISOString() } : note);
        setNotes(updatedNotes);
        setActiveNote(updatedNote);
    };
    const handleDeleteNote = (noteId) => {
        const updatedNotes = notes.filter((note) => note.id !== noteId);
        setNotes(updatedNotes);
        if (activeNote?.id === noteId) {
            setActiveNote(null);
            setActiveTab("dashboard");
        }
    };
    const handleSelectNote = (note) => {
        setActiveNote(note);
        setActiveTab("editor");
    };
    const handleFileTextExtracted = (text, filename) => {
        const newNote = {
            id: Date.now().toString(),
            title: filename.split(".")[0] || "New Note from File",
            content: text,
            tags: ["uploaded"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setNotes((prevNotes) => [newNote, ...prevNotes]);
        setActiveNote(newNote);
        setActiveTab("editor");
        setIsUploadOpen(false);
    };
    if (!mounted)
        return null;
    return (<div className="flex min-h-screen bg-[#0c0c1f] text-foreground font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onNewNote={handleCreateNote} onUpload={() => setIsUploadOpen(true)}/>

      {/* Mobile Top Header - Enhanced Premium Sizing */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-[100] h-20 glass-card rounded-none border-t-0 border-x-0 border-b-white/10 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#4dc9f1] to-[#c57eff] shadow-lg shadow-[#4dc9f1]/20">
            <Sparkles className="h-5 w-5 text-[#0c0c1f]"/>
          </div>
          <span className="font-display font-black text-xl text-white tracking-tight">NoteGenius</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="text-white hover:bg-white/10 rounded-2xl h-12 w-12 flex items-center justify-center p-0">
          <Menu className="h-7 w-7"/>
        </Button>
      </header>

      {/* Mobile Menu Overlay - Full Screen Premium */}
      {isMobileMenuOpen && (<div className="md:hidden fixed inset-0 z-[200] animate-fade-in bg-[#0c0c1f]/90 backdrop-blur-xl flex flex-col p-6">
          <div className="flex justify-between items-center h-20 mb-8 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#4dc9f1] to-[#c57eff]">
                <Sparkles className="h-5 w-5 text-[#0c0c1f]"/>
              </div>
              <span className="font-display font-black text-xl text-white">NoteGenius</span>
            </div>
            <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center p-0">
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-white"/>
            </Button>
          </div>

          <div className="flex-1 flex flex-col gap-6 animate-scale-in">
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] px-4 opacity-50">Neural Workspaces</h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "Overview & Analytics" },
                { id: "notes", label: "Library", icon: BookOpen, desc: "Cognitive Knowledge Base" },
                { id: "mathlab", label: "Math Practice", icon: Calculator, desc: "AI Problem Generator" },
            ].map((item) => (<button key={item.id} onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                }} className={`group flex items-center gap-4 p-4 rounded-[1.5rem] border transition-all duration-300 text-left ${activeTab === item.id
                    ? "bg-gradient-to-r from-[#4dc9f1]/20 to-[#c57eff]/20 border-white/10 shadow-xl"
                    : "bg-white/5 border-transparent hover:bg-white/10"}`}>
                    <div className={`p-2.5 rounded-xl ${activeTab === item.id ? "bg-gradient-to-br from-[#4dc9f1] to-[#c57eff] text-[#0c0c1f]" : "bg-white/10 text-white"}`}>
                      <item.icon className="h-5 w-5"/>
                    </div>
                    <div>
                      <div className={`font-display font-bold text-base ${activeTab === item.id ? "text-white" : "text-muted-foreground"}`}>{item.label}</div>
                      <div className="text-[10px] text-muted-foreground/50">{item.desc}</div>
                    </div>
                  </button>))}
              </div>
            </div>

            <div className="mt-auto space-y-4 pb-4">
              <Button onClick={() => {
                handleCreateNote();
                setIsMobileMenuOpen(false);
            }} className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#4dc9f1] via-[#6ed3f5] to-[#c57eff] text-[#0c0c1f] font-black text-base shadow-2xl border-none">
                <Plus className="h-5 w-5 mr-2"/>
                Create New Note
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={() => {
                setIsUploadOpen(true);
                setIsMobileMenuOpen(false);
            }} className="h-12 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 text-sm">
                  <Upload className="h-4 w-4 mr-2"/>
                  Upload
                </Button>
                <Button variant="ghost" className="h-12 rounded-xl text-muted-foreground hover:text-white text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </div>)}

      <main className="flex-1 p-6 sm:p-10 md:p-8 overflow-y-auto mt-20 md:mt-0 custom-scrollbar">
        {activeTab === "dashboard" && (<div className="space-y-8 animate-fade-in-up">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl xs:text-5xl sm:text-6xl font-display font-black tracking-tight leading-tight">
                  Good evening, <span className="gradient-text">Genius</span>
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg max-w-lg">
                  Your neural laboratory is synchronized and ready for deep cognitive processing.
                </p>
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <div className="flex-1 sm:flex-none">
                  <AboutDialog />
                </div>
                <div className="flex-1 sm:flex-none">
                  <FileUploadDialog isOpen={isUploadOpen} onOpenChange={setIsUploadOpen} onTextExtracted={handleFileTextExtracted}/>
                </div>
              </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { label: "Total Notes", value: notes.length, icon: BookOpen, color: "from-[#4dc9f1] to-[#0ea5e9]", glow: "glow-primary" },
                { label: "AI Insights", value: notes.reduce((acc, n) => acc + (n.tags.length > 0 ? 1 : 0), 0), icon: Brain, color: "from-[#c57eff] to-[#7a3bf5]", glow: "glow-purple" },
                { label: "Study Streak", value: "5 Days", icon: TrendingUp, color: "from-green-400 to-emerald-500", glow: "glow-green" },
            ].map((stat, i) => (<div key={i} className="group glass-card p-6 relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`}/>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                      <stat.icon className="h-6 w-6 text-[#0c0c1f]"/>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-white mt-0.5">{stat.value}</p>
                    </div>
                  </div>
                </div>))}
            </div>

            {/* Recent Notes Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-display font-semibold text-white">Recent Notes</h2>
                  <p className="text-sm text-muted-foreground mt-1">Jump back into your latest work</p>
                </div>
                <Button variant="ghost" onClick={() => setActiveTab("notes")} className="text-[#4dc9f1] hover:text-[#4dc9f1]/80 hover:bg-[#4dc9f1]/10 rounded-xl transition-all">
                  View all
                  <ArrowRight className="h-4 w-4 ml-2"/>
                </Button>
              </div>

              {notes.length === 0 ? (<div className="glass-card p-16 text-center flex flex-col items-center gap-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4dc9f1]/5 to-[#c57eff]/5"/>
                  <div className="relative p-5 rounded-full bg-gradient-to-br from-[#4dc9f1]/10 to-[#c57eff]/10 text-[#4dc9f1] animate-float ring-1 ring-white/10">
                    <BookOpen className="h-14 w-14"/>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-semibold text-white">No notes yet</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm">Start by creating a new note or uploading a PDF, DOCX, or PPTX file.</p>
                  </div>
                  <Button onClick={handleCreateNote} className="relative bg-gradient-to-r from-[#4dc9f1] to-[#c57eff] text-[#0c0c1f] hover:opacity-90 rounded-2xl font-bold h-12 px-8 shadow-xl transition-all hover:scale-105">
                    <Plus className="h-5 w-5 mr-2"/>
                    Create First Note
                  </Button>
                </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notes.slice(0, 6).map((note) => (<div key={note.id} onClick={() => handleSelectNote(note)} className="group glass-card p-6 cursor-pointer relative overflow-hidden hover:border-[#4dc9f1]/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(77,201,241,0.15)]">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#4dc9f1]/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"/>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#4dc9f1]/10 to-[#4dc9f1]/5 text-[#4dc9f1] group-hover:from-[#4dc9f1]/20 group-hover:to-[#4dc9f1]/10 transition-all">
                            <FileText className="h-5 w-5"/>
                          </div>
                          <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-full">
                            <Clock className="h-3 w-3"/>
                            {new Date(note.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-xl font-display font-bold group-hover:text-[#4dc9f1] transition-colors line-clamp-1 text-white">{note.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mt-2 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">{note.content || "Synthesis in progress..."}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {note.tags.slice(0, 3).map((tag, i) => (<Badge key={i} variant="secondary" className="bg-gradient-to-r from-[#4dc9f1]/10 to-[#c57eff]/10 text-[#4dc9f1] border border-[#4dc9f1]/20 text-[10px] rounded-full px-2.5 py-1">
                              {tag}
                            </Badge>))}
                        </div>
                      </div>
                    </div>))}
                </div>)}
            </section>

            {/* AI Insight Banner - Updated Premium Style */}
            <section className="glass-card p-6 sm:p-10 relative overflow-hidden group rounded-[2rem] sm:rounded-[2.5rem]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4dc9f1]/5 via-[#c57eff]/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"/>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-[#4dc9f1]/20 to-[#c57eff]/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"/>
              <div className="relative z-10 flex flex-col md:flex-row items-center sm:items-start md:items-center gap-6 sm:gap-10">
                <div className="relative group/icon">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4dc9f1] to-[#c57eff] rounded-3xl blur-2xl opacity-40 group-hover/icon:opacity-100 transition-opacity"/>
                  <div className="relative p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#1c1c3a] to-[#0c0c1f] border border-white/10 group-hover:border-[#4dc9f1]/50 transition-all duration-500 shadow-2xl">
                    <Zap className="h-10 w-10 sm:h-12 sm:w-12 text-[#4dc9f1] animate-pulse-slow"/>
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left space-y-4">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Sparkles className="h-4 w-4 text-[#4dc9f1]"/>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4dc9f1]">Neural Insight</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-display font-black text-white leading-tight">Elevate your learning with AI</h2>
                  <p className="text-muted-foreground text-sm sm:text-lg max-w-xl opacity-80 leading-relaxed">
                    NoteGenius identifies core concepts and patterns in your notes to improve your long-term retention and synthesis.
                  </p>
                  <Button onClick={() => {
                if (activeNote) {
                    setActiveTab("editor");
                    toast.info("Opening AI Lab", {
                        description: "Focusing on your active note's insights.",
                    });
                }
                else {
                    setActiveTab("notes");
                    toast.info("Select a note", {
                        description: "Pick a note to explore its AI-generated insights.",
                    });
                }
            }} className="w-full sm:w-auto mt-4 bg-white text-[#0c0c1f] hover:bg-white/90 rounded-2xl font-black h-12 sm:h-14 px-8 shadow-2xl transition-all hover:scale-105 group/btn border-none">
                    <span>Explore Insights</span>
                    <ArrowRight className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform"/>
                  </Button>
                </div>
              </div>
            </section>
          </div>)}

        {activeTab === "notes" && (<div className="space-y-8 animate-fade-in-up">
            <header className="space-y-2">
              <h1 className="text-4xl font-display font-bold">
                My <span className="gradient-text">Laboratory</span>
              </h1>
              <p className="text-muted-foreground text-lg">Browse and manage your entire note collection.</p>
            </header>
            <div className="glass-card p-8 min-h-[600px] rounded-[2.5rem]">
              <NotesList notes={notes} activeNoteId={activeNote?.id} onSelectNote={handleSelectNote} onDeleteNote={handleDeleteNote}/>
            </div>
          </div>)}

        {activeTab === "editor" && (<div className="h-full flex flex-col space-y-8 animate-fade-in-up">
            {activeNote ? (<div className="flex flex-col h-full gap-6">
                {/* Editor Header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-white/5">
                  <div className="flex-1 space-y-3 w-full">
                    <Input value={activeNote.title} onChange={(e) => handleUpdateNote({ ...activeNote, title: e.target.value })} className="text-3xl sm:text-4xl font-display font-bold bg-transparent border-none p-0 focus-visible:ring-0 placeholder:opacity-30 h-auto text-white w-full" placeholder="Untitled Note"/>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full">
                        <Clock className="h-3 w-3"/>
                        <span className="hidden xs:inline">Last optimized:</span> {new Date(activeNote.updatedAt).toLocaleTimeString()}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeNote.tags.map((tag, i) => (<Badge key={i} variant="secondary" className="bg-gradient-to-r from-[#4dc9f1]/10 to-[#c57eff]/10 text-[#4dc9f1] border border-[#4dc9f1]/20 text-[10px] sm:text-xs rounded-full">
                            {tag}
                          </Badge>))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none rounded-2xl border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-xs h-10 sm:h-11" onClick={() => setActiveTab("dashboard")}>
                      Dashboard
                    </Button>
                    <Button onClick={() => {
                    toast.success("Note saved successfully!", {
                        description: "Your changes are synced back to the local laboratory.",
                        icon: <Save className="h-4 w-4"/>,
                    });
                }} className="flex-1 sm:flex-none group bg-gradient-to-r from-[#4dc9f1] to-[#c57eff] text-[#0c0c1f] hover:opacity-90 rounded-2xl font-bold shadow-xl glow-primary border-none transition-all hover:scale-105 text-xs h-10 sm:h-11">
                      <Sparkles className="h-4 w-4 mr-2"/>
                      Save Note
                    </Button>
                  </div>
                </header>

                <div className="flex-1 relative">
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 min-h-[500px] lg:h-[calc(100vh-16rem)] transition-all duration-700 ${isLabFocused ? 'scale-[0.98] blur-sm opacity-20 pointer-events-none' : ''}`}>
                    <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden">
                      <div className="glass-card p-1 flex-1 flex flex-col overflow-hidden relative rounded-[2rem]">
                        <NoteEditor note={activeNote} onUpdateNote={handleUpdateNote} isBlurred={isLabFocused}/>
                      </div>
                      <div className="glass-card p-5 flex items-center gap-4 rounded-2xl">
                        <TagsInput tags={activeNote.tags} onUpdateTags={(tags) => handleUpdateNote({ ...activeNote, tags })}/>
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                      <div className="h-full">
                        <Tabs defaultValue="summary" className="w-full h-full flex flex-col">
                          <TabsList className="w-full grid grid-cols-3 bg-gradient-to-r from-white/5 via-white/5 to-white/5 p-1.5 rounded-2xl h-14 border border-white/10 shadow-xl">
                            <TabsTrigger value="summary" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#4dc9f1] data-[state=active]:to-[#0ea5e9] data-[state=active]:text-[#0c0c1f] data-[state=active]:font-bold transition-all duration-300">Summary</TabsTrigger>
                            <TabsTrigger value="keywords" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#c57eff] data-[state=active]:to-[#7a3bf5] data-[state=active]:text-[#0c0c1f] data-[state=active]:font-bold transition-all duration-300">AI Lab</TabsTrigger>
                            <TabsTrigger value="quiz" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-emerald-500 data-[state=active]:text-[#0c0c1f] data-[state=active]:font-bold transition-all duration-300">Quiz</TabsTrigger>
                          </TabsList>
                          <div className="mt-6 flex-1">
                            <TabsContent value="summary" className="mt-0 h-full"><SummaryTab note={activeNote} onTriggerFocus={() => setIsLabFocused(true)}/></TabsContent>
                            <TabsContent value="keywords" className="mt-0 h-full"><KeywordsTab note={activeNote} onTriggerFocus={() => setIsLabFocused(true)}/></TabsContent>
                            <TabsContent value="quiz" className="mt-0 h-full"><QuizTab note={activeNote} onTriggerFocus={() => setIsLabFocused(true)}/></TabsContent>
                          </div>
                        </Tabs>
                      </div>
                    </div>
                  </div>

                  {/* Focus Overlay */}
                  {isLabFocused && (<div className="fixed inset-0 z-[300] flex items-center justify-center animate-scale-in p-4 sm:p-4">
                      <div className="absolute inset-0 bg-[#0c0c1f]/60 backdrop-blur-md" onClick={() => setIsLabFocused(false)}/>
                      <div className="w-full max-w-4xl h-[90vh] sm:h-[800px] glass-card p-6 sm:p-8 shadow-2xl relative overflow-hidden bg-[#1c1c3a]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] sm:rounded-[40px] glow-primary">
                        <div className="flex justify-between items-center mb-6 sm:mb-8 border-b border-white/5 pb-4 sm:pb-6">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#4dc9f1] to-[#c57eff]">
                              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-[#0c0c1f]"/>
                            </div>
                            <h2 className="text-xl sm:text-3xl font-display font-bold gradient-text">Neural Workspace</h2>
                          </div>
                          <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/10 h-10 w-10 sm:h-12 sm:w-12 p-0" onClick={() => setIsLabFocused(false)}>
                            <X className="h-5 w-5 sm:h-6 sm:w-6"/>
                          </Button>
                        </div>

                        <div className="h-[calc(100%-6rem)] sm:h-[calc(100%-8rem)] overflow-y-auto pr-2 sm:pr-4 custom-scrollbar">
                          <Tabs defaultValue="quiz" className="w-full h-full flex flex-col">
                            <TabsList className="w-fit self-center grid grid-cols-3 bg-white/5 p-1 rounded-2xl h-12 sm:h-14 mb-6 sm:mb-8 border border-white/5">
                              <TabsTrigger value="summary" className="px-4 sm:px-10 rounded-xl data-[state=active]:bg-[#4dc9f1] data-[state=active]:text-[#0c0c1f] transition-all text-xs sm:text-sm">Summary</TabsTrigger>
                              <TabsTrigger value="keywords" className="px-4 sm:px-10 rounded-xl data-[state=active]:bg-[#c57eff] data-[state=active]:text-[#0c0c1f] transition-all text-xs sm:text-sm">Concepts</TabsTrigger>
                              <TabsTrigger value="quiz" className="px-4 sm:px-10 rounded-xl data-[state=active]:bg-green-400 data-[state=active]:text-[#0c0c1f] transition-all text-xs sm:text-sm">Final Quiz</TabsTrigger>
                            </TabsList>
                            <div className="flex-1">
                              <TabsContent value="summary" className="mt-0 h-full max-w-2xl mx-auto"><SummaryTab note={activeNote}/></TabsContent>
                              <TabsContent value="keywords" className="mt-0 h-full"><KeywordsTab note={activeNote}/></TabsContent>
                              <TabsContent value="quiz" className="mt-0 h-full"><QuizTab note={activeNote}/></TabsContent>
                            </div>
                          </Tabs>
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>) : (<div className="flex-1 flex flex-col items-center justify-center gap-6">
                <div className="p-8 rounded-full bg-white/5 text-muted-foreground opacity-20 animate-float">
                  <Brain className="h-24 w-24"/>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-display font-bold text-white">Select a Note</h2>
                  <p className="text-muted-foreground mt-2">Pick a note from your library to start the AI Lab experience.</p>
                </div>
                <Button onClick={() => setActiveTab("notes")} variant="outline" className="rounded-xl border-white/10 hover:bg-white/5">View Library</Button>
              </div>)}
          </div>)}

        {activeTab === "mathlab" && (<MathLab />)}
      </main>

      <FileUploadDialog isOpen={isUploadOpen} onOpenChange={setIsUploadOpen} onTextExtracted={handleFileTextExtracted}/>
    </div>);
}
// Sub-components for Tabs
function SummaryTab({ note, onTriggerFocus }) {
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleGenerateSummary = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await summarizeNote(note.content);
            setSummary(result);
            if (onTriggerFocus)
                onTriggerFocus();
        }
        catch (err) {
            console.error("Failed to generate summary:", err);
            setError("There was an issue with the AI service. Using basic summarization instead.");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="space-y-6">
      {!summary && !error && (<div className="flex flex-col items-center gap-6 p-8 glass-card border-dashed border-[#4dc9f1]/20">
          <div className="text-center">
            <Brain className="h-12 w-12 text-[#4dc9f1] mx-auto mb-4 animate-float"/>
            <h3 className="text-xl font-bold text-white">Generate Summary</h3>
            <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">
              Distill your notes into core takeaways instantly.
            </p>
          </div>
          <Button onClick={handleGenerateSummary} disabled={loading} className="w-full bg-[#4dc9f1]/10 text-[#4dc9f1] hover:bg-[#4dc9f1]/20 border border-[#4dc9f1]/30">
            {loading ? "Generating..." : "Generate Summary"}
          </Button>
        </div>)}

      {summary && (<div className="space-y-4 animate-fade-in-up">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#4dc9f1] flex items-center gap-2">
              <Zap className="h-4 w-4"/>
              Summary
            </h3>
            <Button variant="ghost" size="sm" onClick={handleGenerateSummary} disabled={loading} className="text-[10px] h-6">
              Regenerate
            </Button>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl text-sm leading-relaxed text-muted-foreground border border-white/5 min-h-[200px]">
            {summary}
          </div>
        </div>)}
    </div>);
}
function KeywordsTab({ note, onTriggerFocus }) {
    const [keywords, setKeywords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleExtractKeywords = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await extractKeywords(note.content);
            setKeywords(result);
            if (onTriggerFocus)
                onTriggerFocus();
        }
        catch (err) {
            console.error("Failed to extract keywords:", err);
            setError("Failed to extract keywords.");
        }
        finally {
            setLoading(false);
        }
    };
    return (<div className="space-y-6">
      {keywords.length === 0 && (<div className="flex flex-col items-center gap-6 p-8 glass-card border-dashed border-[#c57eff]/20">
          <div className="text-center">
            <Lightbulb className="h-12 w-12 text-[#c57eff] mx-auto mb-4 animate-float"/>
            <h3 className="text-xl font-bold text-white">Extract Concepts</h3>
            <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">
              Identify high-value terms for focused study.
            </p>
          </div>
          <Button onClick={handleExtractKeywords} disabled={loading} className="w-full bg-[#c57eff]/10 text-[#c57eff] hover:bg-[#c57eff]/20 border border-[#c57eff]/30">
            {loading ? "Extracting..." : "Identify Keywords"}
          </Button>
        </div>)}

      {keywords.length > 0 && (<div className="space-y-4 animate-fade-in-up">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-[#c57eff] flex items-center gap-2">
              <Brain className="h-4 w-4"/>
              Key Concepts
            </h3>
            <Badge className="bg-[#c57eff]/10 text-[#c57eff] border-none text-[10px]">{keywords.length}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {keywords.map((keyword, i) => (<KeywordCard key={i} keyword={keyword} index={i}/>))}
          </div>
        </div>)}
    </div>);
}
function QuizTab({ note, onTriggerFocus }) {
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState({});
    const handleGenerateQuiz = async () => {
        setLoading(true);
        try {
            const result = await generateQuiz(note.content);
            setQuizQuestions(result);
            setSelectedAnswers({});
            setShowResults({});
            if (onTriggerFocus)
                onTriggerFocus();
        }
        catch (err) {
            console.error("Failed to generate quiz:", err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleAnswerSelect = (qIdx, oIdx) => {
        if (showResults[qIdx])
            return;
        setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
        setShowResults(prev => ({ ...prev, [qIdx]: true }));
    };
    return (<div className="space-y-6">
      {quizQuestions.length === 0 && (<div className="flex flex-col items-center gap-6 p-8 glass-card border-dashed border-green-500/20">
          <div className="text-center">
            <BookOpen className="h-12 w-12 text-green-400 mx-auto mb-4 animate-float"/>
            <h3 className="text-xl font-bold text-white">Generate Quiz</h3>
            <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">
              Challenge yourself with AI-generated test questions.
            </p>
          </div>
          <Button onClick={handleGenerateQuiz} disabled={loading} className="w-full bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30">
            {loading ? "Generating..." : "Launch Quiz"}
          </Button>
        </div>)}

      {quizQuestions.length > 0 && (<div className="space-y-6 animate-fade-in-up pb-8">
          <header className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-green-400 flex items-center gap-2">
              <Zap className="h-4 w-4"/>
              Quiz Mode
            </h3>
            <Button variant="ghost" size="sm" onClick={handleGenerateQuiz} className="text-[10px] h-6">New Quiz</Button>
          </header>
          {quizQuestions.map((q, qIdx) => (<div key={qIdx} className="glass-card p-4 space-y-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Question {qIdx + 1}</p>
              <p className="text-sm font-semibold text-white leading-relaxed">{q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, oIdx) => {
                    const isSelected = selectedAnswers[qIdx] === oIdx;
                    const isCorrect = oIdx === q.correctAnswer;
                    const revealed = showResults[qIdx];
                    let style = "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10";
                    if (revealed) {
                        if (isCorrect)
                            style = "bg-green-500/20 border-green-500/50 text-green-400";
                        else if (isSelected)
                            style = "bg-red-500/20 border-red-500/50 text-red-400";
                        else
                            style = "bg-white/5 border-transparent opacity-30";
                    }
                    else if (isSelected) {
                        style = "bg-[#4dc9f1]/20 border-[#4dc9f1] text-white";
                    }
                    return (<button key={oIdx} onClick={() => handleAnswerSelect(qIdx, oIdx)} disabled={revealed} className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all ${style}`}>
                      {opt}
                    </button>);
                })}
              </div>
              {showResults[qIdx] && q.explanation && (<p className="text-[10px] text-muted-foreground bg-white/5 p-2 rounded-lg border border-white/5 italic">
                  {q.explanation}
                </p>)}
            </div>))}
        </div>)}
    </div>);
}
function TagsInput({ tags, onUpdateTags }) {
    const [newTag, setNewTag] = useState("");
    const handleAddTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            onUpdateTags([...tags, newTag.trim()]);
            setNewTag("");
        }
    };
    return (<div className="flex items-center gap-3 w-full">
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar max-w-[200px]">
        {tags.map((tag, i) => (<Badge key={i} variant="secondary" className="bg-white/10 text-white border-white/10 whitespace-nowrap">
            {tag}
            <button onClick={() => onUpdateTags(tags.filter((t) => t !== tag))} className="ml-1.5 hover:text-red-400">
              <X className="h-3 w-3"/>
            </button>
          </Badge>))}
      </div>
      <div className="flex-1 flex gap-2">
        <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddTag()} placeholder="New tag..." className="h-8 bg-white/5 border-white/10 text-xs rounded-lg"/>
        <Button onClick={handleAddTag} size="sm" className="h-8 rounded-lg bg-white/10 hover:bg-white/20">
          <Plus className="h-3 w-3"/>
        </Button>
      </div>
    </div>);
}
