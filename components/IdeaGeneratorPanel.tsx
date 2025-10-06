/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

type JewelryStyle = 'Minimalista' | 'Clássico' | 'Moderno' | 'Ousado';
type Environment = 'Estúdio' | 'Casual' | 'Luxuoso' | 'Natureza';

const IdeaGeneratorPanel: React.FC = () => {
    const [style, setStyle] = useState<JewelryStyle>('Minimalista');
    const [material, setMaterial] = useState('ouro delicado');
    const [environment, setEnvironment] = useState<Environment>('Estúdio');
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

    const generatePrompt = () => {
        let promptParts = {
            photoType: "Foto de catálogo de joias de luxo, ",
            subject: `um colar ${style.toLowerCase()} de ${material}, `,
            modelAndPose: '',
            lightingAndEnvironment: '',
            quality: "foco nítido na joia, altamente detalhado, qualidade 8k."
        };

        switch (environment) {
            case 'Estúdio':
                promptParts.lightingAndEnvironment = "fundo neutro e limpo, ";
                switch (style) {
                    case 'Minimalista':
                        promptParts.modelAndPose = "close-up do perfil de uma modelo com o cabelo preso em um coque elegante para alongar o pescoço, exibindo o colar. ";
                        promptParts.lightingAndEnvironment += "iluminação lateral suave que destaca o brilho delicado. ";
                        break;
                    case 'Clássico':
                        promptParts.modelAndPose = "modelo com expressão serena olhando para a câmera, mão tocando levemente a clavícula para chamar a atenção para o colar. ";
                        promptParts.lightingAndEnvironment += "iluminação de estúdio profissional, suave e difusa. ";
                        break;
                    case 'Moderno':
                        promptParts.modelAndPose = "modelo com um corte de cabelo geométrico, pose angular que complementa o design do colar. ";
                        promptParts.lightingAndEnvironment += "iluminação de alto contraste com sombras definidas. ";
                        break;
                    case 'Ousado':
                        promptParts.modelAndPose = "close-up do colo de uma modelo usando um top escuro, destacando o colar statement. ";
                        promptParts.lightingAndEnvironment += "iluminação dramática que cria um brilho intenso na peça. ";
                        break;
                }
                break;
            case 'Casual':
                promptParts.photoType = "Foto de lifestyle, ";
                promptParts.lightingAndEnvironment = "fundo de um café charmoso ou uma rua urbana, levemente desfocado, ";
                switch (style) {
                    case 'Minimalista':
                        promptParts.modelAndPose = "modelo vestindo uma camisa de linho branca com botões abertos, mostrando uma camada de colares finos. ";
                        promptParts.lightingAndEnvironment += "luz natural suave vinda de uma janela. ";
                        break;
                    case 'Clássico':
                         promptParts.modelAndPose = "modelo sorrindo, sentada em um café, com o colar como um detalhe elegante em seu visual do dia a dia. ";
                         promptParts.lightingAndEnvironment += "luz natural e quente. ";
                         break;
                    case 'Moderno':
                        promptParts.modelAndPose = "modelo caminhando em uma rua da cidade, o colar capturado em movimento. ";
                        promptParts.lightingAndEnvironment += "luz do dia brilhante. ";
                        break;
                    case 'Ousado':
                        promptParts.modelAndPose = "modelo em um festival ou evento ao ar livre, o colar statement é o ponto focal de seu look. ";
                        promptParts.lightingAndEnvironment += "luz dourada do fim de tarde. ";
                        break;
                }
                break;
            case 'Luxuoso':
                promptParts.photoType = "Fotografia de editorial de moda, ";
                promptParts.lightingAndEnvironment = "ambiente de um evento de gala ou um interior opulento, ";
                 switch (style) {
                    case 'Minimalista':
                        promptParts.modelAndPose = "modelo usando um vestido de noite simples, onde o delicado colar é o único ponto de brilho. ";
                        promptParts.lightingAndEnvironment += "iluminação suave e etérea. ";
                        break;
                    case 'Clássico':
                         promptParts.modelAndPose = "modelo em um vestido de veludo, pose clássica e elegante, destacando um colar de pérolas ou diamantes. ";
                         promptParts.lightingAndEnvironment += "luz de candelabro quente e cintilante. ";
                         break;
                    case 'Moderno':
                    case 'Ousado':
                        promptParts.modelAndPose = "modelo usando um vestido de noite preto com um decote em V profundo, o colar statement repousa perfeitamente em sua pele. ";
                        promptParts.lightingAndEnvironment += "iluminação dramática, quase como um holofote sobre a joia. ";
                        break;
                }
                break;
            case 'Natureza':
                 promptParts.photoType = "Foto de estilo de vida em ambiente externo, ";
                 promptParts.lightingAndEnvironment = "fundo de uma praia ao pôr do sol, uma floresta exuberante ou um campo de flores, ";
                 switch (style) {
                    case 'Minimalista':
                    case 'Moderno':
                        promptParts.modelAndPose = "modelo com cabelo ao vento, o delicado colar brilhando contra sua pele bronzeada. ";
                        promptParts.lightingAndEnvironment += "luz natural dourada do final da tarde. ";
                        break;
                    case 'Clássico':
                    case 'Ousado':
                         promptParts.modelAndPose = "modelo em um vestido esvoaçante em um campo de flores, o colar complementando a beleza natural. ";
                         promptParts.lightingAndEnvironment += "luz do dia suave e difusa. ";
                         break;
                }
                break;
        }

        const fullPrompt = `${promptParts.photoType}${promptParts.modelAndPose}${promptParts.subject}${promptParts.lightingAndEnvironment}${promptParts.quality}`;
        setGeneratedPrompt(fullPrompt);
    };

    const handleCopy = () => {
        if (!generatedPrompt) return;
        navigator.clipboard.writeText(generatedPrompt).then(() => {
            setCopySuccess('Copiado!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, (err) => {
            setCopySuccess('Falha ao copiar');
            console.error('Could not copy text: ', err);
        });
    };

    const renderOptionButton = (option: JewelryStyle | Environment, type: 'style' | 'environment') => {
        const isActive = type === 'style' ? style === option : environment === option;
        const setter = type === 'style' ? setStyle : setEnvironment;

        return (
            <button
                onClick={() => setter(option as any)}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 active:scale-95 ${
                    isActive
                        ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20'
                        : 'bg-white/10 hover:bg-white/20 text-gray-200'
                }`}
            >
                {option}
            </button>
        );
    }

    return (
        <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col gap-5 animate-fade-in backdrop-blur-sm">
            <div className="text-center">
                <h3 className="text-xl font-bold text-gray-200">Gerador de Ideias para Fotos</h3>
                <p className="text-md text-gray-400 mt-1">Crie o prompt perfeito para a foto de seu colar.</p>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">1. Qual o estilo da joia?</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {renderOptionButton('Minimalista', 'style')}
                    {renderOptionButton('Clássico', 'style')}
                    {renderOptionButton('Moderno', 'style')}
                    {renderOptionButton('Ousado', 'style')}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="material-input" className="text-sm font-medium text-gray-400">2. Descreva o material principal</label>
                <input
                    id="material-input"
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Ex: 'ouro com um pequeno diamante'"
                    className="flex-grow bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full text-base"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-400">3. Qual o ambiente desejado?</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {renderOptionButton('Estúdio', 'environment')}
                    {renderOptionButton('Casual', 'environment')}
                    {renderOptionButton('Luxuoso', 'environment')}
                    {renderOptionButton('Natureza', 'environment')}
                </div>
            </div>

            <button
                onClick={generatePrompt}
                className="w-full mt-2 bg-gradient-to-br from-green-600 to-green-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base"
            >
                Gerar Prompt
            </button>

            {generatedPrompt && (
                <div className="mt-4 animate-fade-in flex flex-col gap-2">
                     <h4 className="text-lg font-semibold text-gray-200">Seu Prompt Personalizado:</h4>
                    <div className="relative">
                        <textarea
                            readOnly
                            value={generatedPrompt}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-300 resize-none text-base"
                            rows={5}
                        />
                        <button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-1 px-3 rounded-md text-sm transition-all"
                        >
                            {copySuccess || 'Copiar'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IdeaGeneratorPanel;