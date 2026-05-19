"use server";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

// Configure OpenRouter model selection
const aiModel = (model) => {
    // Map to the requested Nvidia reasoning model
    return openrouter("nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free");
};

// OpenRouter API is available via the provided key
const isApiAvailable = () => {
    return true;
};
/**
 * Helper to parse JSON from AI models that might wrap it in markdown block quotes
 */
function safelyParseJSON(text) {
    try {
        return JSON.parse(text);
    }
    catch (e) {
        // Try to extract JSON from markdown code blocks
        const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
            return JSON.parse(match[1]);
        }
        // Try to find the first array brackets if the above fails
        const startIdx = text.indexOf('[');
        const endIdx = text.lastIndexOf(']');
        if (startIdx >= 0 && endIdx >= startIdx) {
            return JSON.parse(text.substring(startIdx, endIdx + 1));
        }
        throw new Error("Could not parse JSON from AI response: " + text);
    }
}
/**
 * Generates a concise summary of the note content
 */
export async function summarizeNote(content) {
    if (!content.trim()) {
        return "Please add some content to your note before generating a summary.";
    }
    // If API is not available, use fallback
    if (!isApiAvailable()) {
        return generateFallbackSummary(content);
    }
    try {
        const { text } = await generateText({
            model: aiModel("google/gemma-4-26b-a4b-it:free"),
            prompt: `Summarize the following study notes in a comprehensive way that captures all the main points, key concepts, and important details:
  
      ${content}`,
            system: "You are an educational assistant that creates detailed, well-structured summaries of study notes. Include all key concepts, their relationships, and important details. Make the summary thorough enough to be useful for review purposes.",
        });
        return text;
    }
    catch (error) {
        console.error("Error generating summary:", error);
        // If API fails, use fallback
        return generateFallbackSummary(content);
    }
}
/**
 * Extracts important keywords and concepts from the note content
 */
export async function extractKeywords(content) {
    if (!content.trim()) {
        return [];
    }
    // If API is not available, use fallback
    if (!isApiAvailable()) {
        return generateFallbackKeywords(content);
    }
    try {
        const { text } = await generateText({
            model: aiModel("google/gemma-4-26b-a4b-it:free"),
            prompt: `Extract the most important keywords and concepts from these study notes. Return ONLY a JSON array of strings with no explanation:
      
      ${content}`,
            system: "You are an educational assistant that identifies key terms and concepts from study notes. Return only a valid JSON array of strings.",
        });
        // Parse the response as JSON
        try {
            const keywords = safelyParseJSON(text);
            if (Array.isArray(keywords)) {
                return keywords.slice(0, 15); // Limit to 15 keywords
            }
            return generateFallbackKeywords(content);
        }
        catch (e) {
            console.error("Failed to parse keywords response:", e);
            return generateFallbackKeywords(content);
        }
    }
    catch (error) {
        console.error("Error extracting keywords:", error);
        return generateFallbackKeywords(content);
    }
}
/**
 * Generates MCQ quiz questions based on the note content
 */
export async function generateQuiz(content) {
    if (!content.trim()) {
        return [];
    }
    // If API is not available, use fallback
    if (!isApiAvailable()) {
        return generateFallbackQuiz(content);
    }
    try {
        const { text } = await generateText({
            model: aiModel("google/gemma-4-26b-a4b-it:free"),
            prompt: `Generate 5 multiple-choice quiz questions based on these study notes. Each question should have 4 options (A, B, C, D) with only one correct answer. Return ONLY a JSON array of objects with this structure:
      {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0,
        "explanation": "Brief explanation of why this is correct"
      }
      
      Study notes:
      ${content}`,
            system: "You are an educational assistant that creates effective multiple-choice quiz questions to test understanding of study material. Make sure the questions test comprehension, not just memorization. Include plausible distractors for incorrect options. Return only a valid JSON array.",
        });
        // Parse the response as JSON
        try {
            const quiz = safelyParseJSON(text);
            if (Array.isArray(quiz)) {
                return quiz.slice(0, 5); // Ensure we have at most 5 questions
            }
            return generateFallbackQuiz(content);
        }
        catch (e) {
            console.error("Failed to parse quiz response:", e);
            return generateFallbackQuiz(content);
        }
    }
    catch (error) {
        console.error("Error generating quiz:", error);
        return generateFallbackQuiz(content);
    }
}
// Fallback functions that work without API
/**
 * Generates a more comprehensive summary without using the API
 */
function generateFallbackSummary(content) {
    // If content is very short, return as is
    if (content.length < 200) {
        return content;
    }
    // Split content into paragraphs and sentences
    const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    const allSentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    // If few sentences, return all of them
    if (allSentences.length <= 5) {
        return allSentences.join(". ") + ".";
    }
    // Extract important sentences
    const importantSentences = [];
    // Always include first sentence of content
    if (allSentences.length > 0) {
        importantSentences.push(allSentences[0]);
    }
    // Include first sentences of paragraphs (often contain topic sentences)
    paragraphs.forEach((paragraph) => {
        const sentences = paragraph.split(/[.!?]+/).filter((s) => s.trim().length > 0);
        if (sentences.length > 0 && !importantSentences.includes(sentences[0])) {
            importantSentences.push(sentences[0]);
        }
    });
    // Extract potential keywords for importance scoring
    const potentialKeywords = generateFallbackKeywords(content);
    // Score sentences based on keyword presence
    const sentenceScores = new Map();
    allSentences.forEach((sentence) => {
        if (!importantSentences.includes(sentence)) {
            let score = 0;
            // Longer sentences often contain more information
            score += Math.min(sentence.length / 20, 3);
            // Sentences with keywords are important
            potentialKeywords.forEach((keyword) => {
                if (sentence.toLowerCase().includes(keyword.toLowerCase())) {
                    score += 2;
                }
            });
            sentenceScores.set(sentence, score);
        }
    });
    // Sort sentences by score and add top ones
    const sortedSentences = [...sentenceScores.entries()].sort((a, b) => b[1] - a[1]).map((entry) => entry[0]);
    // Add top scoring sentences (up to a reasonable limit)
    importantSentences.push(...sortedSentences.slice(0, 7));
    // Include last sentence for conclusion if not already included
    if (allSentences.length > 0 && !importantSentences.includes(allSentences[allSentences.length - 1])) {
        importantSentences.push(allSentences[allSentences.length - 1]);
    }
    // Sort sentences to maintain original order
    const orderedSentences = importantSentences.sort((a, b) => {
        return allSentences.indexOf(a) - allSentences.indexOf(b);
    });
    // Join sentences and return
    return orderedSentences.join(". ") + ".";
}
/**
 * Extracts basic keywords without using the API
 */
function generateFallbackKeywords(content) {
    // Simple algorithm to find potential keywords
    const words = content
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 3);
    const wordFrequency = {};
    // Count word frequency
    words.forEach((word) => {
        if (!commonWords.includes(word)) {
            wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        }
    });
    // Sort by frequency
    const sortedWords = Object.entries(wordFrequency)
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0]);
    // Return top 10 words as keywords
    return sortedWords.slice(0, 10);
}
/**
 * Generates MCQ quiz questions without using the API
 */
function generateFallbackQuiz(content) {
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const keywords = generateFallbackKeywords(content);
    const quiz = [];
    // Generate MCQ questions based on content
    for (let i = 0; i < Math.min(5, Math.floor(sentences.length / 2)); i++) {
        const sentenceIndex = Math.floor((i * sentences.length) / Math.min(5, Math.floor(sentences.length / 2)));
        const sentence = sentences[sentenceIndex]?.trim();
        if (!sentence || sentence.length < 20)
            continue;
        // Find a keyword to create a question about
        let keywordToAsk = "";
        const contextSentence = sentence;
        for (const keyword of keywords) {
            if (sentence.toLowerCase().includes(keyword.toLowerCase())) {
                keywordToAsk = keyword;
                break;
            }
        }
        if (keywordToAsk) {
            // Create a "What is" question
            const question = `According to the notes, what is mentioned about "${keywordToAsk}"?`;
            // Create options
            const correctOption = sentence;
            const options = [correctOption];
            // Generate plausible distractors
            const otherSentences = sentences.filter((s) => s !== sentence && s.length > 15);
            // Add modified versions of other sentences as distractors
            for (let j = 0; j < 3 && j < otherSentences.length; j++) {
                let distractor = otherSentences[j];
                // Modify the distractor slightly to make it plausible but incorrect
                if (keywords.length > 1) {
                    const otherKeyword = keywords.find((k) => k !== keywordToAsk);
                    if (otherKeyword) {
                        distractor = distractor.replace(new RegExp(otherKeyword, "gi"), keywordToAsk);
                    }
                }
                options.push(distractor);
            }
            // Fill remaining options if needed
            while (options.length < 4) {
                options.push(`This information is not mentioned in the notes`);
            }
            // Shuffle options and find correct answer index
            const correctAnswer = 0; // We'll shuffle but keep track
            const shuffledOptions = [...options];
            // Simple shuffle
            for (let k = shuffledOptions.length - 1; k > 0; k--) {
                const j = Math.floor(Math.random() * (k + 1));
                [shuffledOptions[k], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[k]];
            }
            const finalCorrectIndex = shuffledOptions.indexOf(correctOption);
            quiz.push({
                question,
                options: shuffledOptions,
                correctAnswer: finalCorrectIndex,
                explanation: `This information is directly stated in the notes.`,
            });
        }
    }
    // Generate definition-based questions
    if (keywords.length >= 2 && quiz.length < 3) {
        const keyword = keywords[0];
        const question = `Which of the following best describes "${keyword}" based on the notes?`;
        // Find sentence containing the keyword
        const relevantSentence = sentences.find((s) => s.toLowerCase().includes(keyword.toLowerCase()));
        if (relevantSentence) {
            const options = [
                relevantSentence,
                `${keyword} is not discussed in these notes`,
                `${keyword} is briefly mentioned without detail`,
                `${keyword} is the main topic of the entire document`,
            ];
            // Shuffle options
            const shuffledOptions = [...options];
            for (let k = shuffledOptions.length - 1; k > 0; k--) {
                const j = Math.floor(Math.random() * (k + 1));
                [shuffledOptions[k], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[k]];
            }
            quiz.push({
                question,
                options: shuffledOptions,
                correctAnswer: shuffledOptions.indexOf(relevantSentence),
                explanation: `This is the information provided about ${keyword} in the notes.`,
            });
        }
    }
    // If we couldn't generate enough questions, add some generic ones
    while (quiz.length < 3) {
        quiz.push({
            question: "What is one of the main topics covered in these notes?",
            options: [
                keywords[0] || "Main topic",
                "This topic is not covered",
                "All topics are equally important",
                "The notes don't have a clear focus",
            ],
            correctAnswer: 0,
            explanation: "This appears to be one of the key topics based on frequency of mention.",
        });
    }
    return quiz;
}
/**
 * Generates multiple variations of math questions from the provided text.
 */
export async function generateMathVariations(content, variationCount = 3) {
    if (!content.trim()) {
        return [];
    }
    // If API is not available, use fallback
    if (!isApiAvailable()) {
        return generateFallbackMathVariations(content, variationCount);
    }
    try {
        const { text } = await generateText({
            model: aiModel("google/gemma-4-26b-a4b-it:free"),
            prompt: `Identify the main mathematical problems (e.g. algebra, geometry, word problems) in the following raw extracted text. 
      WARNING: The text is from a raw PDF extraction, so it may contain junk headers (like "Monday, November", "Page 1", "Section-A"), unformatted mathematical symbols, or broken lines. IGNORE ALL non-mathematical headings, dates, page numbers, and formatting noise!
      
      For each genuine math problem found:
      1. Reconstruct it cleanly under "originalProblem". Fix broken math symbols if possible (e.g., "x2" should be "x^2", "x3" -> "x^3", fractions as a/b).
      2. Determine its "category".
      3. Generate exactly ${variationCount} logical "variations" of the problem. Variations must test the same mathematical concepts but use different numbers or contexts to provide extra practice.
      
      Return ONLY a JSON array of objects with this exact structure:
      [
        {
          "originalProblem": "Cleaned up exact problem statement",
          "category": "e.g., Algebra, Arithmetic, Geometry",
          "variations": ["Variation 1", "Variation 2", "Variation 3"]
        }
      ]
      
      Text content:
      ${content}`,
            system: "You are an expert mathematics teacher designed to help students practice by generating distinct, high-quality variations of math questions. You must parse raw, messy OCR text, filter out irrelevant headers/dates, correctly interpret the math, and return only a valid JSON array of objects.",
        });
        try {
            const result = safelyParseJSON(text);
            if (Array.isArray(result) && result.length > 0) {
                return result;
            }
            // If it returned an empty array, it might mean no math was found!
            if (Array.isArray(result) && result.length === 0) {
                // Let's force it to generate at least one default based on the logic puzzle fallback instruction
                return [
                    {
                        originalProblem: "Analyze the numerical concepts or logic found in the text.",
                        category: "General Analysis",
                        variations: [
                            "How would the outcome change if the numbers were doubled?",
                            "What is the underlying relationship between the key figures mentioned?",
                            "Create a similar logical scenario based on the text's principles."
                        ]
                    }
                ];
            }
            return generateFallbackMathVariations(content, variationCount);
        }
        catch (e) {
            console.error("Failed to parse math variations response:", e);
            return generateFallbackMathVariations(content, variationCount);
        }
    }
    catch (error) {
        console.error("Error generating math variations:", error);
        return generateFallbackMathVariations(content, variationCount);
    }
}

/**
 * Solves mathematical problems extracted from text
 */
export async function solveMathProblems(content) {
    if (!content.trim()) {
        return [];
    }
    
    // If API is not available, use fallback
    if (!isApiAvailable()) {
        return generateFallbackMathVariations(content, 1);
    }
    
    try {
        const { text } = await generateText({
            model: aiModel("google/gemma-4-26b-a4b-it:free"),
            prompt: `Identify the main mathematical problems in the following raw extracted text.
      WARNING: The text is from a raw PDF extraction. IGNORE ALL non-mathematical headings, dates, page numbers, and formatting noise!
      
      For each genuine math problem found:
      1. Reconstruct it cleanly under "originalProblem".
      2. Determine its "category".
      3. Provide a clear, step-by-step mathematical solution under "solution".
      
      Return ONLY a JSON array of objects with this exact structure:
      [
        {
          "originalProblem": "Cleaned up exact problem statement",
          "category": "e.g., Algebra, Arithmetic, Geometry",
          "solution": "Step 1: ... \\nStep 2: ... \\nFinal Answer: ..."
        }
      ]
      
      Text content:
      ${content}`,
            system: "You are an expert mathematics teacher. You must parse messy OCR text, filter out irrelevant headers, correctly interpret the math, and provide step-by-step solutions.",
        });
        
        try {
            const result = safelyParseJSON(text);
            if (Array.isArray(result) && result.length > 0) {
                return result;
            }
            return [];
        } catch (e) {
            console.error("Failed to parse solutions response:", e);
            return [];
        }
    } catch (error) {
        console.error("Error generating solutions:", error);
        return [];
    }
}

/**
 * Fallback to generate realistic mock variations when API is not available or rate-limited
 */
function generateFallbackMathVariations(content, count) {
    const result = [];
    // Extract questions by looking for numbers followed by a dot (e.g. "1. ") or fallback to the whole text if no numbering exists
    let questions = content.split(/(?=\b\d+\.\s)/).map(q => q.trim()).filter(q => q.length > 5 && /\d/.test(q) && !q.includes("Document Math Extraction:"));
    if (questions.length === 0) {
        questions = [content.trim()];
    }
    questions.forEach((qText) => {
        let mathConcept = "Mathematical Concept";
        const lowerQ = qText.toLowerCase();
        // Attempt categorization
        if (lowerQ.includes("equation") || lowerQ.includes("roots") || lowerQ.includes("polynomial"))
            mathConcept = "Algebraic Equations";
        else if (lowerQ.includes("tangent") || lowerQ.includes("circle") || lowerQ.includes("radius") || lowerQ.includes("angle"))
            mathConcept = "Geometry";
        else if (lowerQ.includes("volume") || lowerQ.includes("cone") || lowerQ.includes("cylinder"))
            mathConcept = "Surface Area & Volume";
        else if (lowerQ.includes("multiples") || lowerQ.includes("sum") || lowerQ.includes("progression"))
            mathConcept = "Arithmetic Progressions";
        else if (lowerQ.includes("probability") || lowerQ.includes("dice") || lowerQ.includes("coin"))
            mathConcept = "Probability";
        else if (lowerQ.includes("sin") || lowerQ.includes("cos") || lowerQ.includes("tan"))
            mathConcept = "Trigonometry";
        // Dynamic Variation Generator: Manipulate numbers in the text intelligently
        const generateVariation = (multiplier, adder) => {
            return qText.replace(/\b(\d+)(\.\d+)?\b/g, (match, p1) => {
                // Don't manipulate question numbers like "1." if they're at the start
                if (qText.startsWith(match + ".") && qText.indexOf(match) === 0)
                    return match;
                // Don't manipulate tiny exponents (like x^2) or small choices
                const num = parseInt(p1);
                if (num <= 3)
                    return match;
                let newNum = Math.round((num * multiplier) + adder);
                if (newNum <= 0)
                    newNum = num + 2; // Prevent negative limits breaking physical properties
                return newNum.toString();
            });
        };
        result.push({
            originalProblem: qText,
            category: mathConcept,
            variations: [
                generateVariation(2, 0).replace("(A)", "(A) [Calculated Value 1]"),
                generateVariation(1.5, 2).replace("(A)", "(A) [Calculated Value 2]"),
                generateVariation(0.5, 5).replace("(A)", "(A) [Calculated Value 3]")
            ]
        });
    });
    return result;
}
// List of common words to ignore when generating keywords
const commonWords = [
    "about",
    "above",
    "after",
    "again",
    "against",
    "all",
    "and",
    "any",
    "are",
    "because",
    "been",
    "before",
    "being",
    "below",
    "between",
    "both",
    "but",
    "can",
    "did",
    "does",
    "doing",
    "down",
    "during",
    "each",
    "few",
    "for",
    "from",
    "further",
    "had",
    "has",
    "have",
    "having",
    "her",
    "here",
    "hers",
    "herself",
    "him",
    "himself",
    "his",
    "how",
    "into",
    "its",
    "itself",
    "just",
    "more",
    "most",
    "myself",
    "nor",
    "not",
    "now",
    "off",
    "once",
    "only",
    "other",
    "our",
    "ours",
    "ourselves",
    "out",
    "over",
    "own",
    "same",
    "she",
    "should",
    "some",
    "such",
    "than",
    "that",
    "the",
    "their",
    "theirs",
    "them",
    "themselves",
    "then",
    "there",
    "these",
    "they",
    "this",
    "those",
    "through",
    "too",
    "under",
    "until",
    "very",
    "was",
    "were",
    "what",
    "when",
    "where",
    "which",
    "while",
    "who",
    "whom",
    "why",
    "will",
    "with",
    "you",
    "your",
    "yours",
    "yourself",
    "yourselves",
];
