/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Configuração para Vercel Edge Functions para melhor desempenho
export const config = {
    runtime: 'edge',
};

// Helper para converter ArrayBuffer para Base64
const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

// Helper para converter um objeto File do FormData em uma Parte da API Gemini
const fileToPart = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const base64 = arrayBufferToBase64(buffer);
    return {
        inlineData: {
            mimeType: file.type,
            data: base64,
        },
    };
};

const handleApiResponse = (
    response: GenerateContentResponse,
    context: string
): string => {
    if (response.promptFeedback?.blockReason) {
        const { blockReason, blockReasonMessage } = response.promptFeedback;
        throw new Error(`Solicitação bloqueada: ${blockReason}. ${blockReasonMessage || ''}`);
    }

    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePart?.inlineData) {
        const { mimeType, data } = imagePart.inlineData;
        return `data:${mimeType};base64,${data}`;
    }

    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
        throw new Error(`Geração de imagem parou: ${finishReason}. Verifique as configurações de segurança.`);
    }
    
    throw new Error(`O modelo de IA não retornou uma imagem para ${context}.`);
};


export default async function POST(request: Request) {
    // **NOVA VERIFICAÇÃO DE DIAGNÓSTICO**
    // Verifica a chave de API PRIMEIRO para um diagnóstico claro.
    if (!process.env.API_KEY) {
        console.error("Erro: A variável de ambiente API_KEY não foi encontrada.");
        return new Response(JSON.stringify({ message: 'A chave de API não está configurada no servidor. Verifique as variáveis de ambiente no painel da Vercel.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    
    try {
        const formData = await request.formData();
        const action = formData.get('action') as string;
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        let imageUrl = '';
        const model = 'gemini-2.5-flash-image';

        switch (action) {
            case 'edit': {
                const originalImage = formData.get('originalImage') as File;
                const userPrompt = formData.get('userPrompt') as string;
                const hotspotX = Number(formData.get('hotspotX'));
                const hotspotY = Number(formData.get('hotspotY'));

                const originalImagePart = await fileToPart(originalImage);
                const prompt = `You are an expert photo editor AI. Perform a natural, localized edit. User Request: "${userPrompt}". Focus on coordinates (x: ${hotspotX}, y: ${hotspotY}). Blend seamlessly. The rest of the image must remain identical. Fulfill requests to adjust skin tone but refuse to change fundamental race or ethnicity. Return ONLY the final edited image.`;
                const textPart = { text: prompt };

                const response = await ai.models.generateContent({ model, contents: { parts: [originalImagePart, textPart] } });
                imageUrl = handleApiResponse(response, 'edição');
                break;
            }
            case 'remove-background': {
                const originalImage = formData.get('originalImage') as File;
                const originalImagePart = await fileToPart(originalImage);
                const prompt = `You are an expert photo editor AI. Remove the background and replace it with a pure white background (#FFFFFF). Preserve the main subject perfectly with clean edges. Do not alter the subject. Return ONLY the final image with the white background.`;
                const textPart = { text: prompt };

                const response = await ai.models.generateContent({ model, contents: { parts: [originalImagePart, textPart] } });
                imageUrl = handleApiResponse(response, 'remoção de fundo');
                break;
            }
            case 'adjust': {
                const originalImage = formData.get('originalImage') as File;
                const adjustmentPrompt = formData.get('adjustmentPrompt') as string;
                const originalImagePart = await fileToPart(originalImage);
                const prompt = `You are an expert photo editor AI. Perform a natural, global adjustment to the entire image. User Request: "${adjustmentPrompt}". The result must be photorealistic. Fulfill requests to adjust skin tone but refuse to change fundamental race or ethnicity. Return ONLY the final adjusted image.`;
                const textPart = { text: prompt };

                const response = await ai.models.generateContent({ model, contents: { parts: [originalImagePart, textPart] } });
                imageUrl = handleApiResponse(response, 'ajuste');
                break;
            }
            case 'combine': {
                const mainImage = formData.get('mainImage') as File;
                const sourceImage = formData.get('sourceImage') as File;
                const userPrompt = formData.get('userPrompt') as string;

                const mainImagePart = await fileToPart(mainImage);
                const sourceImagePart = await fileToPart(sourceImage);
                const prompt = `You are an expert photo editor AI. Combine elements from two images. Image 1 is the primary image. Image 2 is the source. User Request: "${userPrompt}". Transfer the element from Image 2 to Image 1, blending it realistically, matching lighting, shadows, and perspective. The rest of Image 1 must remain identical. Fulfill requests to adjust skin tone but refuse to change fundamental race or ethnicity. Return ONLY the final edited image.`;
                const textPart = { text: prompt };

                const response = await ai.models.generateContent({ model, contents: { parts: [mainImagePart, sourceImagePart, textPart] } });
                imageUrl = handleApiResponse(response, 'combinação');
                break;
            }
            default:
                throw new Error('Ação inválida.');
        }

        return new Response(JSON.stringify({ imageUrl }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido no servidor.';
        console.error('Erro no proxy da API:', err);
        return new Response(JSON.stringify({ message: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}