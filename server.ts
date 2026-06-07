import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini SDK securely using backend environment variable
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use body parsing middle wares with limits to facilitate high-res base64 images uploads
  app.use(express.json({ limit: "20mb" }));
  app.use(express.urlencoded({ limit: "20mb", extended: true }));

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Main analyze endpoint
  app.post("/api/analyze", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { textQuery, image, mimeType } = req.body;

      if (!apiKey) {
        res.status(500).json({
          error: "GEMINI_API_KEY is not defined in the server environment.",
        });
        return;
      }

      if (!textQuery && !image) {
        res.status(400).json({
          error: "Please provide a query or upload an image to analyze.",
        });
        return;
      }

      // Prepare parts for Gemini API
      const parts: any[] = [];

      // Add image part if present
      if (image && mimeType) {
        // Strip out base64 prefixes if the client sent them
        const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        });
      }

      // Frame an extensive, highly expert system instruction and prompt context
      let promptText = `
You are an expert AI Yoga Therapist and Ayurvedic Wellness Consultant.
Your task is to analyze the user's input (which may be a handwritten/printed prescription note, disease name, pranayama, list of symptoms, or custom wellness query in Marathi, Hindi, or English) and produce a structured, high-quality, holistic Ayurvedic and Yoga plan.

If an image is uploaded:
- Perform highly accurate OCR (optical character recognition) on the text in the image.
- Translate and transcribe the text if it is in Marathi or Hindi.
- Discover any mentioned diseases, health issues, ingredients, specific asanas, home remedies, or ayurvedic herbs mentioned in the image.

Analyze the query/OCR results and formulate:
1. A disease description / diagnosis context (mapped to English and Marathi/Hindi equivalents).
2. Appropriate Pranayama activities suitable for this condition, detailing specific benefits, critical contraindications or warnings, and step-by-step instructions on how to perform them (steps).
3. Highly therapeutic Yoga Asanas detailing how they heal the condition, precautions to be taken, and step-by-step instructions on how to practice them safely (steps).
4. Classical and safe Ayurvedic Home Remedies (e.g., using ginger, cumin, tulsi, triphala, etc. as appropriate).
5. Detailed Diet plan indicating 'what to eat' (beneficial foods/pathya) and 'what to avoid' (prohibited foods/apathya).
6. Compassionate Medical advice and disclaimers.

User text query context: "${textQuery || "Analyze the attached image regarding wellness advice"}"
`;

      parts.push({ text: promptText });

      // Call models/gemini-3.5-flash with structured JSON response
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts },
        config: {
          systemInstruction:
            "You are a compassionate, professional expert Yoga Therapist and Ayurvedic Wellness Consultant. You always follow safe classical standards of yoga therapy and ayurveda.",
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              disease: {
                type: Type.STRING,
                description:
                  "Name of the condition in English and Marathi/Hindi if applicable (e.g., 'Heart Disease / हृदयरोग' or 'Diabetes / मधुमेह')",
              },
              pranayama: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Pranayama name" },
                    benefits: {
                      type: Type.STRING,
                      description: "Detailed, healing benefits specifically tailored to this condition",
                    },
                    caution: {
                      type: Type.STRING,
                      description: "Crucial cautions or contraindications for this specific condition",
                    },
                    steps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Step-by-step instructions on how to perform this pranayama (2-4 clear steps)",
                    },
                  },
                  required: ["name", "benefits", "caution", "steps"],
                },
              },
              asanas: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING, description: "Asana name" },
                    benefits: {
                      type: Type.STRING,
                      description: "Why this pose is recommended/how it activates energy systems",
                    },
                    caution: {
                      type: Type.STRING,
                      description: "Precautions to take while practicing specifically for this condition",
                    },
                    steps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Step-by-step instructions on how to practice this asana safely (2-4 clear steps)",
                    },
                  },
                  required: ["name", "benefits", "caution", "steps"],
                },
              },
              home_remedies: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of safe, accessible ayurvedic home remedies, herbs, or formulations",
              },
              diet: {
                type: Type.OBJECT,
                properties: {
                  what_to_eat: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Foods to favor (Pathya)",
                  },
                  what_to_avoid: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Foods to strictly limit or avoid (Apathya)",
                  },
                },
                required: ["what_to_eat", "what_to_avoid"],
              },
              medical_advice: {
                type: Type.STRING,
                description:
                  "Standard medical disclaimer advising consultation, combined with custom Ayurvedic guidance and translation or OCR notes if any Marathi/Hindi text is decoded.",
              },
            },
            required: [
              "disease",
              "pranayama",
              "asanas",
              "home_remedies",
              "diet",
              "medical_advice",
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No response text returned from Gemini API.");
      }

      // Parse JSON
      const parsedData = JSON.parse(responseText.trim());
      res.json(parsedData);
    } catch (error: any) {
      console.error("Analysis Error:", error);
      res.status(500).json({
        error: error.message || "An unexpected error occurred during wellness analysis.",
      });
    }
  });

  // Serve static assets out of Vite or the built directory
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
