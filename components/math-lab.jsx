"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, Upload, Zap, Brain, Download } from "lucide-react";
import { toast } from "sonner";
import { generateMathVariations } from "@/lib/ai-helpers";
import FileUploadDialog from "@/components/file-upload-dialog";
import { Textarea } from "@/components/ui/textarea";
export default function MathLab() {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [extractedText, setExtractedText] = useState("");
    const [manualText, setManualText] = useState("");
    const [variationsData, setVariationsData] = useState([]);
    const handleFileTextExtracted = async (text, filename) => {
        setIsUploadOpen(false);
        setExtractedText(text);
        setManualText(text);
        toast.success(`Extracted text from ${filename}. You can now review it or ask the AI to solve it!`);
    };
    const handleManualGenerate = async () => {
        if (!manualText.trim())
            return toast.error("Please paste some math questions first.");
        setExtractedText(manualText);
        toast.info("Analyzing Math Problems", {
            description: `Starting AI analysis on manual input...`,
        });
        setLoading(true);
        try {
            const results = await generateMathVariations(manualText, 3);
            setVariationsData(results);
            if (results.length > 0) {
                toast.success("Variations Generated");
            }
            else {
                toast.error("No math problems detected in this text.");
            }
        }
        catch (e) {
            console.error(e);
            toast.error("Failed to generate variations.");
        }
        finally {
            setLoading(false);
        }
    };

    const handleGenerateMore = async () => {
        toast.info("Generating More Variations", {
            description: `Asking AI for additional practice problems...`,
        });
        setLoading(true);
        try {
            const moreResults = await generateMathVariations(extractedText, 3);
            
            setVariationsData(prev => {
                const newData = [...prev];
                moreResults.forEach(newProblem => {
                    const existingIdx = newData.findIndex(p => p.originalProblem === newProblem.originalProblem);
                    if (existingIdx >= 0) {
                        newData[existingIdx] = {
                            ...newData[existingIdx],
                            variations: [...(newData[existingIdx].variations || []), ...(newProblem.variations || [])]
                        };
                    } else {
                        newData.push(newProblem);
                    }
                });
                return newData;
            });
            toast.success("Added more variations!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to generate more variations.");
        } finally {
            setLoading(false);
        }
    };

    const handleExportMath = () => {
        if (!variationsData || variationsData.length === 0) return;

        let problemsHTML = '';
        variationsData.forEach((item, index) => {
            let variationsHTML = '';
            item.variations?.forEach((v, vIdx) => {
                variationsHTML += `<div class="variation"><span class="v-num">${vIdx + 1}.</span> ${v}</div>`;
            });

            problemsHTML += `
                <div class="problem-block">
                    <div class="problem-header">
                        <span class="badge">${item.category || 'Math'}</span>
                        <span class="label">Problem ${index + 1}</span>
                    </div>
                    <div class="original">${item.originalProblem}</div>
                    <div class="variations-title">AI-Generated Variations</div>
                    <div class="variations">${variationsHTML}</div>
                </div>`;
        });

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<!DOCTYPE html>
<html><head><title>Math Practice Set - NoteGenius</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; color: #1a1a2e; padding: 40px; background: #fff; }
  .header { text-align: center; margin-bottom: 40px; padding-bottom: 24px; border-bottom: 3px solid #4dc9f1; }
  .header h1 { font-size: 28px; font-weight: 900; color: #0c0c1f; }
  .header p { font-size: 12px; color: #888; margin-top: 6px; }
  .problem-block { margin-bottom: 32px; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; page-break-inside: avoid; }
  .problem-header { background: #f4f6fa; padding: 12px 20px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid #e0e0e0; }
  .badge { background: #4dc9f1; color: #fff; font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px; }
  .label { font-size: 12px; color: #666; font-weight: 600; }
  .original { padding: 16px 20px; font-size: 14px; line-height: 1.7; border-left: 3px solid #4dc9f1; margin: 16px 20px; background: #f9fbff; border-radius: 0 8px 8px 0; font-style: italic; color: #333; white-space: pre-line; }
  .variations-title { padding: 0 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #7c3aed; margin-top: 8px; }
  .variations { padding: 12px 20px 20px; }
  .variation { padding: 10px 16px; margin-bottom: 8px; background: #faf8ff; border: 1px solid #ede9fe; border-radius: 8px; font-size: 13px; line-height: 1.7; color: #333; white-space: pre-line; }
  .v-num { font-weight: 700; color: #7c3aed; margin-right: 4px; }
  .footer { text-align: center; margin-top: 40px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-size: 10px; color: #aaa; }
  @media print { body { padding: 20px; } .problem-block { break-inside: avoid; } }
</style></head><body>
  <div class="header">
    <h1>📐 AI Math Practice Set</h1>
    <p>Generated by NoteGenius • ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>
  ${problemsHTML}
  <div class="footer">Generated with NoteGenius AI — notegenius.app</div>
</body></html>`);
        printWindow.document.close();
        printWindow.onload = () => {
            printWindow.print();
        };
        toast.success("PDF export ready! Use 'Save as PDF' in the print dialog.");
    };

    return (<div className="space-y-8 animate-fade-in-up">
      <header className="space-y-2">
        <h1 className="text-4xl font-display font-bold">
          <span className="gradient-text">Math</span> Laboratory
        </h1>
        <p className="text-muted-foreground text-lg">Upload a PDF with math questions to generate fresh practice variations.</p>
      </header>
      
      <div className="glass-card p-8 min-h-[600px] rounded-[2.5rem] flex flex-col">
        {!loading && variationsData.length === 0 && (<div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="text-center w-full max-w-2xl">
              <h2 className="text-2xl font-display font-bold text-white mb-2">Generate Math Practice</h2>
              <p className="text-muted-foreground mb-6">Type or paste math questions below, or upload a document to extract them automatically.</p>
              
              <Textarea value={manualText} onChange={(e) => setManualText(e.target.value)} placeholder="E.g. Which of the following equations has the sum of its roots as 3? (A) x^2+3x-5=0 ..." className="min-h-[200px] bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 rounded-2xl p-5 mb-6 focus-visible:ring-[#4dc9f1] focus-visible:ring-1"/>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button onClick={handleManualGenerate} disabled={!manualText.trim()} className="bg-gradient-to-r from-[#4dc9f1] to-[#c57eff] text-[#0c0c1f] hover:opacity-90 rounded-2xl font-bold shadow-xl border-none h-12 px-8">
                  <Zap className="h-5 w-5 mr-2"/>
                  Generate Variations
                </Button>
                
                <Button onClick={() => setIsUploadOpen(true)} variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl font-semibold h-12 px-8">
                  <Upload className="h-5 w-5 mr-2 text-[#4dc9f1]"/>
                  Upload PDF / Image
                </Button>
              </div>
            </div>
          </div>)}

        {loading && (<div className="flex-1 flex flex-col items-center justify-center gap-6">
            <div className="p-6 rounded-full bg-white/5 animate-pulse relative">
              <div className="absolute inset-0 border-t-2 border-[#4dc9f1] animate-spin rounded-full line-clamp-1"/>
              <Brain className="h-12 w-12 text-[#4dc9f1]"/>
            </div>
            <h3 className="text-xl font-bold text-white tracking-widest animate-pulse">Extracting Neural Patterns...</h3>
          </div>)}

        {variationsData.length > 0 && !loading && (<div className="space-y-8 max-w-4xl mx-auto w-full">
            <div className="flex justify-between items-center bg-white/5 p-4 py-3 rounded-2xl border border-white/5">
              <h2 className="text-lg flex items-center gap-2 font-display font-bold text-white">
                <Zap className="h-5 w-5 text-[#4dc9f1]"/> Generated Math Practice Set
              </h2>
              <div className="flex gap-2">
                <Button onClick={handleExportMath} variant="outline" className="h-9 text-xs rounded-xl border-white/10 text-[#c57eff] hover:bg-white/10">
                  <Download className="h-3 w-3 mr-2" />
                  Export PDF
                </Button>
                <Button onClick={() => setIsUploadOpen(true)} variant="outline" className="h-9 text-xs rounded-xl border-white/10 hover:bg-white/10">
                  Upload New File
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {variationsData.map((item, idx) => (<div key={idx} className="glass-card overflow-hidden rounded-2xl border border-white/10 group">
                  <div className="bg-gradient-to-r from-white/5 to-transparent p-5 border-b border-white/5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-[#4dc9f1]/20 text-[#4dc9f1] text-[10px] font-bold uppercase tracking-widest rounded-full">{item.category}</span>
                      <span className="text-xs text-muted-foreground">Original Question</span>
                    </div>
                    <p className="text-sm font-medium text-white/90 leading-relaxed italic border-l-2 border-[#4dc9f1] pl-4 whitespace-pre-line">{item.originalProblem}</p>
                  </div>
                  
                  <div className="p-5 bg-black/20">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center">
                      <Calculator className="h-3 w-3 mr-2 text-[#c57eff]"/> AI Variations
                    </h3>
                    <div className="space-y-3">
                      {item.variations?.map((variation, vIdx) => (<div key={vIdx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                          <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line"><span className="text-[#c57eff] font-bold mr-2">{vIdx + 1}.</span> {variation}</p>
                        </div>))}
                    </div>
                  </div>
                </div>))}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button onClick={handleGenerateMore} className="bg-gradient-to-r from-[#c57eff] to-[#4dc9f1] text-[#0c0c1f] hover:opacity-90 rounded-2xl font-bold shadow-xl border-none h-12 px-8">
                <Zap className="h-5 w-5 mr-2" />
                Generate More Variations
              </Button>
            </div>
          </div>)}
      </div>

      <FileUploadDialog isOpen={isUploadOpen} onOpenChange={setIsUploadOpen} onTextExtracted={handleFileTextExtracted}/>
    </div>);
}
