
import { GoogleGenAI, Type } from '@google/genai';
import type { UploadedFile } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (file: UploadedFile) => {
    return {
        inlineData: {
            data: file.base64,
            mimeType: file.file.type,
        },
    };
};

export const generateSvg = async (prompt: string, images: UploadedFile[]): Promise<string> => {
    const model = 'gemini-2.5-flash';

    const systemInstruction = `You are an expert SVG designer. Your task is to generate a single, complete, valid SVG code string based on the user's request.
- The SVG should be visually appealing, clean, and modern.
- Do NOT include any raster image formats (like PNG or JPG) inside the SVG.
- The SVG code must be self-contained and start with '<svg ...>' and end with '</svg>'.
- Ensure the SVG scales well and does not use fixed pixel sizes for its main container if possible, use viewBox.
- Return the output as a JSON object with a single key "svg".`;

    const textPart = {
        text: `Generate an SVG based on the following concept: "${prompt}". ${images.length > 0 ? 'Use the provided image(s) as inspiration for the style, color palette, and composition.' : ''}`,
    };

    const imageParts = images.map(fileToGenerativePart);

    const contents = {
        parts: [textPart, ...imageParts],
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        svg: {
                            type: Type.STRING,
                            description: 'The complete, valid SVG code string for the generated graphic.'
                        }
                    },
                    required: ['svg'],
                },
                temperature: 0.7,
            },
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);

        if (typeof result.svg === 'string' && result.svg.includes('<svg')) {
            return result.svg;
        } else {
            throw new Error('Invalid SVG format received from the API.');
        }

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error('Failed to generate SVG. Please check your prompt or try again later.');
    }
};
