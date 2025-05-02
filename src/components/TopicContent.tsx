import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface TopicContentProps {
    topic: {
        id: string;
        title: string;
        period: string;
        summary: string;
        subtopics: Array<{
            id: string;
            title: string;
            content: string;
        }>;
    };
    subtopic: {
        id: string;
        title: string;
        content: string;
    };
    onNavigate?: (subtopicId: string) => void;
}

const TopicContent = ({ topic, subtopic, onNavigate }: TopicContentProps) => {
    const [fontSize, setFontSize] = useState('normal');
    const [highlightMode, setHighlightMode] = useState(false);
    const navigate = useNavigate();

    // Function to handle navigation between subtopics
    const handleNavigation = (direction: 'prev' | 'next') => {
        const currentIndex = topic.subtopics.findIndex(
            s => s.id === subtopic.id
        );

        if (direction === 'prev' && currentIndex > 0) {
            const prevSubtopic = topic.subtopics[currentIndex - 1];
            if (onNavigate) {
                onNavigate(prevSubtopic.id);
            } else {
                navigate(`/${topic.id}/${prevSubtopic.id}`);
            }
        } else if (
            direction === 'next' &&
            currentIndex < topic.subtopics.length - 1
        ) {
            const nextSubtopic = topic.subtopics[currentIndex + 1];
            if (onNavigate) {
                onNavigate(nextSubtopic.id);
            } else {
                navigate(`/${topic.id}/${nextSubtopic.id}`);
            }
        }
    };

    // Função para processar o conteúdo do subtópico e destacar termos importantes
    const processContent = (content: string) => {
        if (!content) return '';

        // Lista de termos importantes para destacar automaticamente
        const importantTerms = {
            'napoleão bonaparte':
                'Líder militar e político francês que se tornou imperador da França (1769-1821)',
            'bloqueio continental':
                'Política econômica imposta por Napoleão para isolar economicamente a Grã-Bretanha',
            'congresso de viena':
                'Conferência entre potências europeias para reorganizar a Europa após as Guerras Napoleônicas',
            'código napoleônico':
                'Conjunto de leis civis estabelecido por Napoleão que modernizou o sistema jurídico',
            'luís xviii':
                'Rei da França após a queda de Napoleão, governou de 1814 a 1824',
            'carlos x':
                'Rei da França de 1824 a 1830, deposto na Revolução de 1830',
            'luís filipe':
                'O "rei burguês" que governou a França de 1830 a 1848',
            'revolução de 1830':
                'Também conhecida como as "Jornadas Gloriosas", derrubou Carlos X',
            'primavera dos povos':
                'Ondas revolucionárias de 1848 que ocorreram em vários países europeus',
            liberalismo:
                'Corrente de pensamento que defende liberdades individuais e economia de mercado',
            'socialismo utópico':
                'Primeiras teorias socialistas com propostas consideradas idealistas',
            'socialismo científico':
                'Teoria desenvolvida por Marx e Engels baseada na análise histórica e material',
            'comuna de paris':
                'Governo revolucionário formado pelos trabalhadores parisienses em 1871',
            'karl marx':
                'Filósofo e economista alemão, autor de O Capital e do Manifesto Comunista',
            'manifesto comunista':
                'Publicação de 1848 escrita por Marx e Engels que estabelece os princípios comunistas',
            'adam smith':
                'Economista escocês considerado o pai do liberalismo econômico',
            'mais-valia':
                'Conceito marxista que representa a diferença entre o valor do trabalho e o salário pago',
            'charles fourier':
                'Pensador socialista utópico francês que propôs os falanstérios'
        };

        // Substituir os termos importantes por elementos destacados
        let processedContent = content;

        Object.entries(importantTerms).forEach(([term, definition]) => {
            const regex = new RegExp(`\\b${term}\\b`, 'gi');
            if (regex.test(processedContent)) {
                // Marca o termo como destacado (para o modo de destaque)
                processedContent = processedContent.replace(regex, match => {
                    return `<span class="term-highlight ${
                        highlightMode ? 'active' : ''
                    }" data-definition="${definition}">${match}</span>`;
                });
            }
        });

        return processedContent;
    };

    const fontSizeClass = {
        small: 'text-sm',
        normal: 'text-base',
        large: 'text-lg',
        xlarge: 'text-xl'
    }[fontSize];

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Cabeçalho do conteúdo */}
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                    {subtopic.title}
                </h2>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setHighlightMode(!highlightMode)}
                        className={`px-3 py-1 rounded text-sm font-medium transition ${
                            highlightMode
                                ? 'bg-yellow-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        title="Destacar termos importantes"
                    >
                        {highlightMode
                            ? 'Desativar Destaques'
                            : 'Destacar Termos'}
                    </button>
                    <div className="flex border rounded overflow-hidden">
                        <button
                            onClick={() => setFontSize('small')}
                            className={`px-2 py-1 text-xs ${
                                fontSize === 'small'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-white text-gray-700'
                            }`}
                            title="Texto pequeno"
                        >
                            A-
                        </button>
                        <button
                            onClick={() => setFontSize('normal')}
                            className={`px-2 py-1 text-xs ${
                                fontSize === 'normal'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-white text-gray-700'
                            }`}
                            title="Texto normal"
                        >
                            A
                        </button>
                        <button
                            onClick={() => setFontSize('large')}
                            className={`px-2 py-1 text-xs ${
                                fontSize === 'large'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-white text-gray-700'
                            }`}
                            title="Texto grande"
                        >
                            A+
                        </button>
                        <button
                            onClick={() => setFontSize('xlarge')}
                            className={`px-2 py-1 text-xs ${
                                fontSize === 'xlarge'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-white text-gray-700'
                            }`}
                            title="Texto muito grande"
                        >
                            A++
                        </button>
                    </div>
                </div>
            </div>

            {/* Corpo do conteúdo */}
            <div className="p-6">
                <div
                    className={`prose max-w-none topic-content ${fontSizeClass}`}
                >
                    <div
                        dangerouslySetInnerHTML={{
                            __html: processContent(subtopic.content)
                        }}
                        className={highlightMode ? 'highlight-mode' : ''}
                    />
                </div>

                {/* Dicas de estudo */}
                <motion.div
                    className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <h3 className="text-blue-800 font-medium mb-2">
                        Dicas para a prova:
                    </h3>
                    <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
                        {topic.id === 'napoleao' && (
                            <>
                                <li>
                                    Entenda bem o Bloqueio Continental e suas
                                    consequências para o Brasil
                                </li>
                                <li>
                                    Lembre-se das principais características do
                                    Código Napoleônico
                                </li>
                                <li>
                                    Compreenda a importância do Congresso de
                                    Viena na restauração europeia
                                </li>
                            </>
                        )}
                        {topic.id === 'liberalismo' && (
                            <>
                                <li>
                                    Compare os princípios do liberalismo
                                    econômico com o liberalismo político
                                </li>
                                <li>
                                    Entenda o conceito de "mão invisível" de
                                    Adam Smith
                                </li>
                                <li>
                                    Identifique as contradições entre teoria
                                    liberal e prática
                                </li>
                            </>
                        )}
                        {topic.id === 'revolucoes-liberais' && (
                            <>
                                <li>
                                    Relacione as causas e consequências da
                                    Revolução de 1830
                                </li>
                                <li>
                                    Compare o governo de Luís Filipe com os
                                    governos anteriores
                                </li>
                                <li>
                                    Entenda por que 1848 é chamado de "Primavera
                                    dos Povos"
                                </li>
                            </>
                        )}
                        {topic.id === 'socialismos' && (
                            <>
                                <li>
                                    Diferencie claramente socialismo utópico de
                                    socialismo científico
                                </li>
                                <li>
                                    Compreenda a importância da Comuna de Paris
                                    para o pensamento marxista
                                </li>
                                <li>
                                    Saiba explicar o conceito de mais-valia e
                                    luta de classes
                                </li>
                            </>
                        )}
                    </ul>
                </motion.div>

                {/* Navegação entre subtópicos */}
                <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                    {topic.subtopics.findIndex(s => s.id === subtopic.id) >
                    0 ? (
                        <button
                            onClick={() => handleNavigation('prev')}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                            ← Anterior
                        </button>
                    ) : (
                        <div></div>
                    )}

                    {topic.subtopics.findIndex(s => s.id === subtopic.id) <
                    topic.subtopics.length - 1 ? (
                        <button
                            onClick={() => handleNavigation('next')}
                            className="flex items-center text-blue-600 hover:text-blue-800"
                        >
                            Próximo →
                        </button>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>

            {/* Estilos adicionais para os destaques */}
            <style>{`
                .term-highlight {
                    position: relative;
                    border-bottom: 1px dotted #3b82f6;
                    cursor: help;
                }
                
                .term-highlight.active {
                    background-color: #fffbeb;
                    border-bottom: 2px solid #f59e0b;
                    padding: 0 2px;
                }

                .term-highlight:hover::after {
                    content: attr(data-definition);
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    min-width: 200px;
                    max-width: 300px;
                    background-color: #1e40af;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 14px;
                    z-index: 10;
                    text-align: center;
                    white-space: normal;
                    line-height: 1.4;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }

                .highlight-mode .term-highlight:not(:hover)::after {
                    display: none;
                }
                
                @media (max-width: 640px) {
                    .term-highlight:hover::after {
                        left: 0;
                        transform: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default TopicContent;
