"use client";
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
export default function FileUploadDialog({ isOpen, onOpenChange, onTextExtracted }) {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => {
        setIsDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    };
    const handleFileSelect = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            validateAndSetFile(selectedFile);
        }
    };
    const validateAndSetFile = (file) => {
        const allowedTypes = [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "image/png",
            "image/jpeg",
            "image/jpg",
            "image/webp",
            "text/html"
        ];
        const extension = file.name.split(".").pop()?.toLowerCase();
        const isAllowedExtension = ["pdf", "docx", "pptx", "png", "jpg", "jpeg", "webp", "html", "htm"].includes(extension || "");
        if (allowedTypes.includes(file.type) || isAllowedExtension) {
            setFile(file);
        }
        else {
            toast.error("Unsupported file type. Please upload PDF, DOCX, PPTX, HTML, or Images.");
        }
    };
    const handleUpload = async () => {
        if (!file)
            return;
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await fetch("/api/extract-text", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                console.log("Extraction successful on client:", data);
                onTextExtracted(data.text, data.filename);
                toast.success("Text extracted successfully!");
                onOpenChange(false);
                setFile(null);
            }
            else {
                toast.error(data.error || "Failed to extract text");
            }
        }
        catch (error) {
            console.error("Upload error:", error);
            toast.error("An error occurred during upload");
        }
        finally {
            setLoading(false);
        }
    };
    return (<Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] border-white/10 bg-[#0c0c1f]/80 backdrop-blur-2xl text-white rounded-3xl p-0 overflow-hidden shadow-2xl glow-primary">
                <div className="p-8 space-y-6">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-display font-bold">
                            <span className="gradient-text">Cognitive</span> Upload
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                            Infuse your Laboratory with new knowledge from PDF, Word, or PowerPoint files.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        {!file ? (<div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`
                flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer
                ${isDragging ? "border-primary bg-primary/10 scale-[1.02]" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5"}
              `}>
                                <div className="bg-primary/10 p-4 rounded-full mb-4 animate-float">
                                    <Upload className="h-8 w-8 text-primary"/>
                                </div>
                                <p className="text-sm font-medium mb-1">Click or drag & drop</p>
                                <p className="text-xs text-muted-foreground">PDF, DOCX, PPTX, HTML, or Images (Max 10MB)</p>
                                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".pdf,.docx,.pptx,.html,.htm,.png,.jpg,.jpeg,.webp" className="hidden"/>
                            </div>) : (<div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-primary/20 animate-scale-in">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <FileText className="h-6 w-6 text-primary"/>
                                    </div>
                                    <div className="max-w-[200px]">
                                        <p className="text-sm font-medium truncate">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setFile(null)} disabled={loading} className="hover:bg-destructive/10 hover:text-destructive">
                                    <X className="h-4 w-4"/>
                                </Button>
                            </div>)}

                        <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-1">
                            <div className="flex items-center gap-1">
                                <Sparkles className="h-3 w-3 text-[#4dc9f1]"/>
                                <span>Deep Extraction</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Zap className="h-3 w-3 text-[#c57eff]"/>
                                <span>AI Optimized</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button onClick={handleUpload} disabled={!file || loading} className="w-full h-12 bg-[#4dc9f1] text-[#0c0c1f] hover:bg-[#4dc9f1]/90 font-bold rounded-2xl shadow-lg glow-primary transition-all">
                            {loading ? (<>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Analyzing...
                                </>) : (<>
                                    <Upload className="mr-2 h-4 w-4"/>
                                    Begin Extraction
                                </>)}
                        </Button>
                        <Button variant="ghost" className="text-muted-foreground hover:text-white" onClick={() => onOpenChange(false)} disabled={loading}>
                            Discard
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>);
}
