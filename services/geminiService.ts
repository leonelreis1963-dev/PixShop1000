/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * Chama o endpoint do proxy da API do lado do servidor para interagir com a API Gemini de forma segura.
 * @param formData Os dados do formulário contendo a ação, imagens e prompts.
 * @returns Uma promessa que resolve para a URL de dados da imagem gerada.
 */
const callApi = async (formData: FormData): Promise<string> => {
    try {
        const response = await fetch('/api/proxy', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            // Tenta analisar o corpo do erro para uma mensagem específica do nosso proxy.
            const errorData = await response.json().catch(() => ({ message: 'A resposta do servidor não é um JSON válido.' }));
            // Prioriza a mensagem do servidor, se existir.
            throw new Error(errorData.message || `A solicitação da API falhou com o status ${response.status}`);
        }

        const result = await response.json();
        // Verifica se a resposta contém a URL da imagem esperada.
        if (!result.imageUrl) {
            throw new Error('A resposta da API não continha uma URL de imagem.');
        }
        return result.imageUrl;
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
        console.error("A chamada da API falhou:", errorMessage);
        // Propaga o erro para ser exibido na UI.
        throw new Error(errorMessage);
    }
};

/**
 * Gera uma imagem editada com base em um prompt de texto e um ponto específico.
 * @param originalImage O arquivo de imagem original.
 * @param userPrompt O prompt de texto descrevendo a edição desejada.
 * @param hotspot As coordenadas {x, y} na imagem para focar a edição.
 * @returns Uma promessa que resolve para a URL de dados da imagem editada.
 */
export const generateEditedImage = async (
    originalImage: File,
    userPrompt: string,
    hotspot: { x: number, y: number }
): Promise<string> => {
    const formData = new FormData();
    formData.append('action', 'edit');
    formData.append('originalImage', originalImage);
    formData.append('userPrompt', userPrompt);
    formData.append('hotspotX', String(hotspot.x));
    formData.append('hotspotY', String(hotspot.y));
    return callApi(formData);
};

/**
 * Gera uma imagem com o fundo removido.
 * @param originalImage O arquivo de imagem original.
 * @returns Uma promessa que resolve para a URL de dados da imagem com um fundo transparente.
 */
export const generateRemovedBackgroundImage = async (
    originalImage: File,
): Promise<string> => {
    const formData = new FormData();
    formData.append('action', 'remove-background');
    formData.append('originalImage', originalImage);
    return callApi(formData);
};

/**
 * Gera uma imagem com um ajuste global aplicado.
 * @param originalImage O arquivo de imagem original.
 * @param adjustmentPrompt O prompt de texto descrevendo o ajuste desejado.
 * @returns Uma promessa que resolve para a URL de dados da imagem ajustada.
 */
export const generateAdjustedImage = async (
    originalImage: File,
    adjustmentPrompt: string,
): Promise<string> => {
    const formData = new FormData();
    formData.append('action', 'adjust');
    formData.append('originalImage', originalImage);
    formData.append('adjustmentPrompt', adjustmentPrompt);
    return callApi(formData);
};

/**
 * Gera uma nova imagem combinando elementos de uma imagem principal e uma imagem de origem.
 * @param mainImage A imagem base a ser editada.
 * @param sourceImage A imagem contendo os elementos a serem transferidos.
 * @param userPrompt Um prompt descrevendo como combinar as imagens.
 * @returns Uma promessa que resolve para a URL de dados da imagem combinada.
 */
export const generateCombinedImage = async (
    mainImage: File,
    sourceImage: File,
    userPrompt: string,
): Promise<string> => {
    const formData = new FormData();
    formData.append('action', 'combine');
    formData.append('mainImage', mainImage);
    formData.append('sourceImage', sourceImage);
    formData.append('userPrompt', userPrompt);
    return callApi(formData);
};