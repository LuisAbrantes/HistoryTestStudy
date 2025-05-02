import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Flashcards from '../components/Flashcards';
import Quiz from '../components/Quiz';
import ExcalidrawMindMap from '../components/ExcalidrawMindMap';
import topicsData from '../data/topics.json';

const TopicPage = () => {
    const { topicId, subtopicId } = useParams<{
        topicId: string;
        subtopicId?: string;
    }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<
        'content' | 'flashcards' | 'quiz' | 'mindmap'
    >('content');
    const { topics } = topicsData;

    // Find the current topic from the data
    const currentTopic = topics.find(t => t.id === topicId);

    // Find the current subtopic if specified, otherwise use the first one
    const currentSubtopic = subtopicId
        ? currentTopic?.subtopics.find(s => s.id === subtopicId)
        : currentTopic?.subtopics[0];

    // Set up keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only process if not in an input field
            if (
                e.target instanceof HTMLInputElement ||
                e.target instanceof HTMLTextAreaElement
            ) {
                return;
            }

            if (e.key === 'f' || e.key === 'F') {
                setActiveTab('flashcards');
            } else if (e.key === 'q' || e.key === 'Q') {
                setActiveTab('quiz');
            } else if (e.key === 'c' || e.key === 'C') {
                setActiveTab('content');
            } else if (e.key === 'm' || e.key === 'M') {
                setActiveTab('mindmap');
            } else if ((e.key === 'n' || e.key === 'N') && currentTopic) {
                // Go to next subtopic
                const currentIndex = currentTopic.subtopics.findIndex(
                    s => s.id === currentSubtopic?.id
                );
                if (currentIndex < currentTopic.subtopics.length - 1) {
                    navigate(
                        `/${topicId}/${
                            currentTopic.subtopics[currentIndex + 1].id
                        }`
                    );
                }
            } else if ((e.key === 'p' || e.key === 'P') && currentTopic) {
                // Go to previous subtopic
                const currentIndex = currentTopic.subtopics.findIndex(
                    s => s.id === currentSubtopic?.id
                );
                if (currentIndex > 0) {
                    navigate(
                        `/${topicId}/${
                            currentTopic.subtopics[currentIndex - 1].id
                        }`
                    );
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [topicId, subtopicId, currentTopic, currentSubtopic, navigate]);

    if (!currentTopic || !currentSubtopic) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl text-gray-700">
                    Tópico não encontrado
                </h2>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                    Voltar para a Página Inicial
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Topic header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-blue-800 mb-2">
                        {currentTopic.title}
                    </h1>
                    <p className="text-gray-600">
                        Período: {currentTopic.period}
                    </p>
                </div>

                {/* Subtopic navigation */}
                <div className="flex mb-6 overflow-x-auto pb-2 -mx-2 px-2">
                    {currentTopic.subtopics.map((subtopic, index) => (
                        <button
                            key={subtopic.id}
                            className={`flex-shrink-0 px-4 py-2 rounded-md mr-2 ${
                                subtopic.id === currentSubtopic.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            onClick={() =>
                                navigate(`/${topicId}/${subtopic.id}`)
                            }
                        >
                            {index + 1}. {subtopic.title}
                        </button>
                    ))}
                </div>

                {/* Content tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <div className="flex space-x-4">
                        <button
                            className={`py-3 px-4 border-b-2 font-medium ${
                                activeTab === 'content'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('content')}
                        >
                            Conteúdo (C)
                        </button>
                        <button
                            className={`py-3 px-4 border-b-2 font-medium ${
                                activeTab === 'flashcards'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('flashcards')}
                        >
                            Flashcards (F)
                        </button>
                        <button
                            className={`py-3 px-4 border-b-2 font-medium ${
                                activeTab === 'quiz'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('quiz')}
                        >
                            Quiz (Q)
                        </button>
                        <button
                            className={`py-3 px-4 border-b-2 font-medium ${
                                activeTab === 'mindmap'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('mindmap')}
                        >
                            Mapa Mental (M)
                        </button>
                    </div>
                </div>

                {/* Tab content */}
                <div className="mb-10">
                    {activeTab === 'content' && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                {currentSubtopic.title}
                            </h2>

                            {/* This would be replaced with actual content */}
                            <div className="prose prose-blue max-w-none">
                                <p className="mb-4">
                                    {currentSubtopic.content ||
                                        'Conteúdo detalhado virá aqui. Esta é apenas uma versão de demonstração da plataforma.'}
                                </p>

                                <p className="text-gray-600 italic">
                                    Conteúdo completo e atualizado será
                                    adicionado posteriormente.
                                </p>

                                {/* Navigation buttons */}
                                <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                                    {currentTopic.subtopics.findIndex(
                                        s => s.id === currentSubtopic.id
                                    ) > 0 ? (
                                        <button
                                            onClick={() => {
                                                const currentIndex =
                                                    currentTopic.subtopics.findIndex(
                                                        s =>
                                                            s.id ===
                                                            currentSubtopic.id
                                                    );
                                                navigate(
                                                    `/${topicId}/${
                                                        currentTopic.subtopics[
                                                            currentIndex - 1
                                                        ].id
                                                    }`
                                                );
                                            }}
                                            className="flex items-center text-blue-600 hover:text-blue-800"
                                        >
                                            ← Anterior
                                        </button>
                                    ) : (
                                        <div></div>
                                    )}

                                    {currentTopic.subtopics.findIndex(
                                        s => s.id === currentSubtopic.id
                                    ) <
                                    currentTopic.subtopics.length - 1 ? (
                                        <button
                                            onClick={() => {
                                                const currentIndex =
                                                    currentTopic.subtopics.findIndex(
                                                        s =>
                                                            s.id ===
                                                            currentSubtopic.id
                                                    );
                                                navigate(
                                                    `/${topicId}/${
                                                        currentTopic.subtopics[
                                                            currentIndex + 1
                                                        ].id
                                                    }`
                                                );
                                            }}
                                            className="flex items-center text-blue-600 hover:text-blue-800"
                                        >
                                            Próximo →
                                        </button>
                                    ) : (
                                        <div></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'flashcards' && (
                        <Flashcards topicId={topicId} />
                    )}

                    {activeTab === 'quiz' && <Quiz topicId={topicId} />}

                    {activeTab === 'mindmap' && (
                        <ExcalidrawMindMap topicId={topicId} />
                    )}
                </div>

                {/* Topic summary */}
                {activeTab === 'content' && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <h3 className="font-medium text-blue-800 mb-2">
                            Sumário do Tópico
                        </h3>
                        <p className="text-blue-700 text-sm">
                            {currentTopic.summary}
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default TopicPage;
