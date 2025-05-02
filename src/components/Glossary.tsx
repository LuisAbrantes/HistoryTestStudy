import { useState, useEffect, ReactNode } from 'react';

// Define glossary terms - these would ideally come from a data file
const glossaryTerms = {
    'napoleão bonaparte':
        'General e imperador francês que dominou grande parte da Europa entre 1799 e 1815.',
    'bloqueio continental':
        'Política econômica imposta por Napoleão para isolar economicamente a Grã-Bretanha.',
    'código napoleônico':
        'Conjunto de leis civis estabelecido por Napoleão que influenciou sistemas legais em todo o mundo.',
    liberalismo:
        'Corrente de pensamento político e econômico que defende a liberdade individual, a propriedade privada e limitação do poder do Estado.',
    'liberalismo econômico':
        'Doutrina que defende a não intervenção do Estado na economia (laissez-faire).',
    'liberalismo político':
        'Defesa das liberdades civis e direitos individuais contra o poder do Estado.',
    revolução:
        'Transformação rápida e profunda da estrutura política, social ou econômica de um Estado.',
    'primavera dos povos':
        'Série de revoluções democráticas e nacionalistas que ocorreram na Europa em 1848.',
    nacionalismo:
        'Ideologia que valoriza a nação e a identidade nacional acima de outros aspectos.',
    socialismo:
        'Doutrina política e econômica que defende a propriedade coletiva dos meios de produção.',
    'socialismo utópico':
        'Primeiras teorias socialistas que propunham sociedades ideais sem base científica.',
    'socialismo científico':
        'Teoria desenvolvida por Marx e Engels baseada na análise histórica e econômica.',
    'comuna de paris':
        'Governo revolucionário formado pelos trabalhadores de Paris em 1871.',
    'mais-valia':
        'Conceito marxista que representa a diferença entre o valor produzido pelo trabalho e o salário pago ao trabalhador.',
    burguesia:
        'Classe social detentora dos meios de produção no sistema capitalista.',
    proletariado:
        'Classe social que, no sistema capitalista, vende sua força de trabalho em troca de salário.',
    'luta de classes':
        'Conceito marxista que entende a história como resultado do conflito entre as classes sociais.',
    'revolução industrial':
        'Processo de transformação econômica e social iniciado na Inglaterra no século XVIII.',
    'sufrágio universal':
        'Direito de voto estendido a todos os cidadãos adultos.',
    'congresso de viena':
        'Conferência entre embaixadores das potências europeias para reorganizar a Europa após as Guerras Napoleônicas.'
};

interface GlossaryContextProviderProps {
    children: ReactNode;
}

export const GlossaryContextProvider = ({
    children
}: GlossaryContextProviderProps) => {
    useEffect(() => {
        // Process text content to add glossary tooltips
        const processTextNodes = () => {
            // Seleciona apenas elementos de texto dentro de conteúdo real da página
            const textElements = document.querySelectorAll(
                '.prose p, .prose li, .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6, .topic-content p, .topic-content li'
            );

            textElements.forEach(element => {
                // Lista expandida de elementos a serem ignorados
                if (
                    element.getAttribute('data-glossary-processed') ||
                    element.closest('.glossary-tooltip') ||
                    element.closest('button') ||
                    element.closest('nav') ||
                    element.closest('.topic-info') ||
                    element.closest('#liberalismo-info') ||
                    element.closest('input') ||
                    element.closest('form') ||
                    element.parentElement?.classList.contains(
                        'topic-definition'
                    )
                ) {
                    return;
                }

                let html = element.innerHTML;

                // Check for each glossary term
                Object.keys(glossaryTerms).forEach(term => {
                    // Create regex to find the term with word boundaries
                    const regex = new RegExp(`\\b${term}\\b`, 'gi');

                    if (regex.test(html)) {
                        // Replace term with highlighted span with Tailwind classes
                        html = html.replace(regex, match => {
                            return `<span class="border-b border-dotted border-blue-500 cursor-help" data-term="${term.toLowerCase()}">${match}</span>`;
                        });
                    }
                });

                element.innerHTML = html;
                element.setAttribute('data-glossary-processed', 'true');
            });

            // Add event listeners to the newly created spans
            const termElements = document.querySelectorAll('[data-term]');
            termElements.forEach(term => {
                term.addEventListener('mouseenter', showTooltip);
                term.addEventListener('mouseleave', hideTooltip);
            });
        };

        const showTooltip = (event: Event) => {
            const target = event.target as HTMLElement;
            const term = target.getAttribute('data-term');

            if (!term) return;

            // Create tooltip with Tailwind classes
            const tooltip = document.createElement('div');
            tooltip.className =
                'fixed bg-blue-50 border border-blue-200 p-3 rounded-md shadow-md z-50 max-w-xs';
            tooltip.innerHTML = `<strong>${
                term.charAt(0).toUpperCase() + term.slice(1)
            }</strong>: ${glossaryTerms[term as keyof typeof glossaryTerms]}`;

            // Position tooltip
            const rect = target.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX}px`;
            tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;

            // Add tooltip to document
            document.body.appendChild(tooltip);

            // Store reference to the tooltip on the term element
            target.setAttribute('data-tooltip-id', Date.now().toString());
            tooltip.setAttribute(
                'data-tooltip-id',
                target.getAttribute('data-tooltip-id') || ''
            );
        };

        const hideTooltip = (event: Event) => {
            const target = event.target as HTMLElement;
            const tooltipId = target.getAttribute('data-tooltip-id');

            if (tooltipId) {
                const tooltip = document.querySelector(
                    `[data-tooltip-id="${tooltipId}"]`
                );
                if (tooltip) {
                    document.body.removeChild(tooltip);
                }
            }
        };

        // Aguardar que o DOM esteja completamente carregado antes de processar
        setTimeout(() => {
            processTextNodes();

            // Process text nodes when content changes
            const observer = new MutationObserver(mutations => {
                let shouldProcess = false;

                mutations.forEach(mutation => {
                    if (
                        mutation.type === 'childList' &&
                        mutation.addedNodes.length > 0
                    ) {
                        shouldProcess = true;
                    }
                });

                if (shouldProcess) {
                    // Adicionei timeout para aguardar carregamento completo após mudanças
                    setTimeout(processTextNodes, 200);
                }
            });

            // Start observing the document body
            observer.observe(document.body, { childList: true, subtree: true });

            // Cleanup
            return () => {
                observer.disconnect();

                // Remove event listeners
                const termElements = document.querySelectorAll('[data-term]');
                termElements.forEach(term => {
                    term.removeEventListener('mouseenter', showTooltip);
                    term.removeEventListener('mouseleave', hideTooltip);
                });
            };
        }, 500);
    }, []);

    return <>{children}</>;
};

const Glossary = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTerms, setFilteredTerms] = useState<
        { term: string; definition: string }[]
    >([]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredTerms(
                Object.entries(glossaryTerms).map(([term, definition]) => ({
                    term,
                    definition
                }))
            );
        } else {
            setFilteredTerms(
                Object.entries(glossaryTerms)
                    .filter(
                        ([term, definition]) =>
                            term
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                            definition
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                    )
                    .map(([term, definition]) => ({
                        term,
                        definition
                    }))
            );
        }
    }, [searchTerm]);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Glossário</h3>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar termos..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {filteredTerms.length > 0 ? (
                    filteredTerms.map(({ term, definition }) => (
                        <div
                            key={term}
                            className="border-b border-gray-100 pb-3"
                        >
                            <h4 className="font-medium text-blue-700 capitalize">
                                {term}
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">
                                {definition}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">
                        Nenhum termo encontrado.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Glossary;
