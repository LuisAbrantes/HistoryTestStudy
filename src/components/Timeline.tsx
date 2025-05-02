import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import topicsData from '../data/topics.json';

interface TimelineProps {
    onPeriodSelect?: (topicId: string) => void;
}

const Timeline = ({ onPeriodSelect }: TimelineProps) => {
    const [activePeriod, setActivePeriod] = useState<string | null>(null);
    const [hoveredPeriod, setHoveredPeriod] = useState<string | null>(null);
    const { topics } = topicsData;

    // Sort topics chronologically
    const sortedTopics = [...topics].sort((a, b) => {
        const aStartYear = parseInt(a.period.split('-')[0]);
        const bStartYear = parseInt(b.period.split('-')[0]);
        return aStartYear - bStartYear;
    });

    // Calculate the full timeline range
    const startYear = Math.min(
        ...sortedTopics.map(t => parseInt(t.period.split('-')[0]))
    );
    const endYear = Math.max(
        ...sortedTopics.map(t =>
            parseInt(t.period.split('-')[1] || t.period.split('-')[0])
        )
    );
    const timelineSpan = endYear - startYear;

    const handlePeriodClick = (topicId: string) => {
        setActivePeriod(prev => (prev === topicId ? null : topicId));
        if (onPeriodSelect) {
            onPeriodSelect(topicId);
        }
    };

    // Facilitar a navegação de teclado
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!activePeriod) return;

            const currentIndex = sortedTopics.findIndex(
                topic => topic.id === activePeriod
            );
            if (currentIndex === -1) return;

            // Navegar com setas esquerda/direita
            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                const prevId = sortedTopics[currentIndex - 1].id;
                setActivePeriod(prevId);
                if (onPeriodSelect) onPeriodSelect(prevId);
            } else if (
                e.key === 'ArrowRight' &&
                currentIndex < sortedTopics.length - 1
            ) {
                const nextId = sortedTopics[currentIndex + 1].id;
                setActivePeriod(nextId);
                if (onPeriodSelect) onPeriodSelect(nextId);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activePeriod, onPeriodSelect, sortedTopics]);

    return (
        <section className="my-6 md:my-8 lg:my-12 rounded-lg md:rounded-xl lg:rounded-2xl bg-blue-600 overflow-hidden shadow-lg">
            {/* Cabeçalho - mantido com cores mais vivas conforme screenshot */}
            <div className="px-4 py-4 md:px-6 md:py-5 text-white">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 md:h-6 md:w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    Linha do Tempo Histórica
                </h2>
                <p className="text-sm md:text-base text-blue-100 mt-1">
                    Explore períodos importantes da História (1799-1875)
                </p>
            </div>

            {/* Conteúdo principal com fundo branco */}
            <div className="bg-white p-4 md:p-6">
                {/* Timeline container */}
                <div className="relative mb-16">
                    {/* Timeline base line com cor sólida conforme screenshot */}
                    <div className="h-2 bg-blue-500 rounded-full my-8 relative z-10 shadow-sm"></div>

                    {/* Marcadores verticais de divisão de era */}
                    <div className="absolute top-0 h-full w-full flex justify-between">
                        {[0, 1, 2, 3, 4].map((_, index) => (
                            <div
                                key={index}
                                className="border-l border-blue-200 h-full opacity-30"
                            ></div>
                        ))}
                    </div>

                    {/* Períodos na timeline */}
                    {sortedTopics.map(topic => {
                        const startYearTopic = parseInt(
                            topic.period.split('-')[0]
                        );
                        const endYearTopic = parseInt(
                            topic.period.split('-')[1] ||
                                topic.period.split('-')[0]
                        );

                        // Calculate position on timeline (percentage)
                        const startPosition =
                            ((startYearTopic - startYear) / timelineSpan) * 100;
                        const periodWidth = Math.max(
                            ((endYearTopic - startYearTopic) / timelineSpan) *
                                100,
                            4
                        );

                        const isActive = activePeriod === topic.id;
                        const isHovered = hoveredPeriod === topic.id;

                        return (
                            <div key={topic.id}>
                                {/* Period marker */}
                                <div
                                    className="absolute cursor-pointer group"
                                    style={{
                                        left: `${startPosition}%`,
                                        width: `${periodWidth}%`
                                    }}
                                >
                                    {/* Year indicator */}
                                    <div className="absolute bottom-full mb-2 text-xs font-medium text-gray-600 w-full text-center select-none">
                                        <span className="bg-white rounded-full px-1.5 py-0.5 shadow-sm border border-gray-100">
                                            {startYearTopic}
                                        </span>
                                    </div>

                                    {/* Interactive period bar - usando cores sólidas compatíveis com o screenshot */}
                                    <motion.div
                                        className={`absolute h-6 md:h-8 -top-3 rounded-full transition-all cursor-pointer ${
                                            isActive
                                                ? 'bg-blue-600 shadow-md'
                                                : isHovered
                                                ? 'bg-blue-500'
                                                : 'bg-blue-400 hover:bg-blue-500'
                                        }`}
                                        style={{ width: '100%' }}
                                        initial={{ y: 0 }}
                                        whileHover={{ y: -2 }}
                                        onClick={() =>
                                            handlePeriodClick(topic.id)
                                        }
                                        onHoverStart={() =>
                                            setHoveredPeriod(topic.id)
                                        }
                                        onHoverEnd={() =>
                                            setHoveredPeriod(null)
                                        }
                                    />

                                    {/* Event pin - simplificado para corresponder ao design */}
                                    <motion.div
                                        className={`absolute top-7 left-1/2 transform -translate-x-1/2 z-20 bg-white rounded-full border-2 ${
                                            isActive
                                                ? 'border-blue-600 w-5 h-5'
                                                : 'border-blue-400 w-4 h-4'
                                        }`}
                                        initial={{ scale: 1 }}
                                        animate={{
                                            scale: isActive ? 1.2 : 1,
                                            y: isActive ? -2 : 0
                                        }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 500,
                                            damping: 30
                                        }}
                                    />

                                    {/* Topic name label - adaptado para melhor visibilidade em diferentes tamanhos */}
                                    <div
                                        className={`absolute top-full pt-6 left-1/2 transform -translate-x-1/2 text-center
                      ${
                          isActive
                              ? 'font-semibold text-blue-800'
                              : 'font-medium text-gray-700'
                      }`}
                                    >
                                        <div
                                            className={`text-xs sm:text-sm truncate max-w-[90px] sm:max-w-[120px] md:max-w-[150px]`}
                                        >
                                            {topic.title}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Marcadores de ano na linha inferior */}
                    <div className="absolute bottom-[-46px] w-full flex justify-between text-[10px] md:text-xs text-gray-500">
                        <div className="text-left">{startYear}</div>
                        <div className="hidden xs:block">
                            {Math.floor(startYear + timelineSpan * 0.25)}
                        </div>
                        <div>{Math.floor(startYear + timelineSpan * 0.5)}</div>
                        <div className="hidden xs:block">
                            {Math.floor(startYear + timelineSpan * 0.75)}
                        </div>
                        <div className="text-right">{endYear}</div>
                    </div>
                </div>

                {/* Detalhes do período com animação */}
                <AnimatePresence mode="wait">
                    {activePeriod && (
                        <motion.div
                            key={activePeriod}
                            className="relative mt-16 bg-white rounded-md md:rounded-lg border border-blue-100 overflow-hidden shadow-md"
                            initial={{ opacity: 0, y: 20, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: 10, height: 0 }}
                            transition={{ duration: 0.3, type: 'spring' }}
                        >
                            {/* Barra colorida no topo */}
                            <div className="h-1 bg-blue-500"></div>

                            <div className="p-4 md:p-6">
                                {/* Cabeçalho com título e período */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-lg md:text-xl font-bold text-gray-800">
                                            {
                                                topics.find(
                                                    t => t.id === activePeriod
                                                )?.title
                                            }
                                        </h4>
                                        <div className="text-xs md:text-sm text-gray-600 flex items-center mt-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3 w-3 md:h-4 md:w-4 mr-1 text-blue-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            <span>
                                                Período:{' '}
                                                {
                                                    topics.find(
                                                        t =>
                                                            t.id ===
                                                            activePeriod
                                                    )?.period
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Botão de fechar */}
                                    <button
                                        onClick={() => setActivePeriod(null)}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none rounded-full p-1 hover:bg-gray-100"
                                        aria-label="Fechar detalhes"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                {/* Conteúdo */}
                                <div className="mt-3 md:mt-4">
                                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                                        {
                                            topics.find(
                                                t => t.id === activePeriod
                                            )?.summary
                                        }
                                    </p>

                                    {/* Fatos importantes */}
                                    <div className="mt-3 md:mt-4">
                                        <h5 className="font-medium text-gray-900 mb-2 flex items-center text-sm md:text-base">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3 w-3 md:h-4 md:w-4 mr-1 text-blue-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            Fatos Importantes
                                        </h5>
                                        <ul className="space-y-1 text-xs md:text-sm text-gray-600 ml-4 md:ml-5 list-disc">
                                            {activePeriod === 'napoleao' && (
                                                <>
                                                    <li>
                                                        Ascensão ao poder
                                                        através do golpe de 18
                                                        de Brumário (1799)
                                                    </li>
                                                    <li>
                                                        Criação do Código
                                                        Napoleônico (1804)
                                                    </li>
                                                    <li>
                                                        Derrotado na Batalha de
                                                        Waterloo (1815)
                                                    </li>
                                                </>
                                            )}
                                            {activePeriod === 'liberalismo' && (
                                                <>
                                                    <li>
                                                        Desenvolvimento de
                                                        teorias por Adam Smith e
                                                        John Locke
                                                    </li>
                                                    <li>
                                                        Defesa da liberdade
                                                        econômica e política
                                                    </li>
                                                    <li>
                                                        Base ideológica para as
                                                        revoluções burguesas
                                                    </li>
                                                </>
                                            )}
                                            {activePeriod ===
                                                'revolucoes-liberais' && (
                                                <>
                                                    <li>
                                                        Revolução de 1830 na
                                                        França
                                                    </li>
                                                    <li>
                                                        Primavera dos Povos
                                                        (1848)
                                                    </li>
                                                    <li>
                                                        Avanço de ideais
                                                        nacionalistas e
                                                        democráticos
                                                    </li>
                                                </>
                                            )}
                                            {activePeriod === 'socialismos' && (
                                                <>
                                                    <li>
                                                        Surgimento do socialismo
                                                        utópico no início do
                                                        século XIX
                                                    </li>
                                                    <li>
                                                        Publicação do Manifesto
                                                        Comunista (1848)
                                                    </li>
                                                    <li>
                                                        Comuna de Paris (1871)
                                                    </li>
                                                </>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Botão de saiba mais */}
                                    <div className="mt-4 md:mt-6 flex">
                                        <button
                                            className="flex items-center text-blue-600 hover:text-blue-800 text-xs md:text-sm font-medium transition-colors"
                                            onClick={() => {
                                                if (onPeriodSelect)
                                                    onPeriodSelect(
                                                        activePeriod
                                                    );
                                            }}
                                        >
                                            Explorar conteúdo completo
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-3 w-3 md:h-4 md:w-4 ml-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Legenda */}
                <div className="mt-6 md:mt-8 flex flex-wrap justify-center text-[10px] md:text-xs text-gray-600 gap-2 md:gap-4">
                    <div className="flex items-center">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-400 rounded-full mr-1"></div>
                        <span>Evento Histórico</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-600 rounded-full mr-1"></div>
                        <span>Período Selecionado</span>
                    </div>
                    <div className="flex items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 md:h-4 md:w-4 text-gray-600 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        <span>Use as setas para navegar</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Timeline;
