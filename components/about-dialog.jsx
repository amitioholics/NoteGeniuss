"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Mail, Heart, Sparkles, Brain, BookOpen, Lightbulb, Info, Zap, Code } from "lucide-react";
export default function AboutDialog() {
    const [open, setOpen] = useState(false);
    return (<Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-all shadow-lg">
          <Info className="h-4 w-4 mr-2"/>
          System Info
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl border-white/10 bg-[#0c0c1f]/80 backdrop-blur-2xl text-white rounded-3xl p-0 overflow-hidden shadow-2xl glow-primary">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Sparkles className="h-64 w-64 text-[#4dc9f1] rotate-12"/>
        </div>

        <div className="p-10 space-y-8 relative z-10">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-[#4dc9f1] to-[#c57eff]">
                <Brain className="h-6 w-6 text-[#0c0c1f]"/>
              </div>
              <Badge variant="outline" className="border-[#4dc9f1]/30 text-[#4dc9f1] text-[10px] uppercase font-bold tracking-tighter">v2.0 Cognition</Badge>
            </div>
            <DialogTitle className="text-4xl font-display font-bold">
              Note<span className="gradient-text">Genius</span> AI
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-lg">
              The premium cognitive interface for modern learners.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-[#4dc9f1] font-bold">Core Modules</h3>
              <div className="space-y-3">
                {[
            { icon: Zap, label: "Instant Synthesis", desc: "AI-powered summarization" },
            { icon: Lightbulb, label: "Concept Mapping", desc: "Entity & relation extraction" },
            { icon: BookOpen, label: "Neural Testing", desc: "Interactive intelligence checks" }
        ].map((item, i) => (<div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                    <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-[#4dc9f1] transition-colors mt-0.5"/>
                    <div>
                      <h4 className="font-semibold text-sm">{item.label}</h4>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-[#c57eff] font-bold">Architecture</h3>
              <div className="glass-card p-6 bg-white/5 space-y-4 h-full flex flex-col justify-between">
                <div className="flex flex-wrap gap-2">
                  {["Next.js 15", "TypeScript", "Tailwind", "GPT-4o", "Shadcn/ui", "Cognitive Ether"].map((tech, i) => (<Badge key={i} variant="secondary" className="bg-white/10 text-white border-none text-[10px]">{tech}</Badge>))}
                </div>
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4dc9f1] to-[#c57eff] flex items-center justify-center text-[#0c0c1f] font-bold text-xs ring-4 ring-white/5">
                      AR
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">Amit Singh Rajput</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Lead Architect</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="pt-6 flex justify-between items-center border-t border-white/5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Crafted with</span>
              <Heart className="h-3 w-3 text-[#c57eff] fill-[#c57eff]"/>
              <span>for universal intelligence.</span>
            </div>
            <div className="flex gap-4">
              <a href="mailto:amitsinghrajput263@gmail.com" className="text-muted-foreground hover:text-[#4dc9f1] transition-colors">
                <Mail className="h-4 w-4"/>
              </a>
              <a href="#" className="text-muted-foreground hover:text-[#c57eff] transition-colors">
                <Code className="h-4 w-4"/>
              </a>
            </div>
          </footer>
        </div>
      </DialogContent>
    </Dialog>);
}
