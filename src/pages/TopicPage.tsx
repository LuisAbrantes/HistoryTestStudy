import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import Flashcards from '../components/Flashcards';
import Quiz from '../components/Quiz';
import ExcalidrawMindMap from '../components/ExcalidrawMindMap';
import TopicContent from '../components/TopicContent';
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
                    <motion.h1
                        className="text-3xl font-bold text-blue-800 mb-2"
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                    >
                        {currentTopic.title}
                    </motion.h1>
                    <p className="text-gray-600">
                        Período: {currentTopic.period}
                    </p>
                </div>

                {/* Subtopic navigation */}
                <div className="flex mb-6 overflow-x-auto pb-2 -mx-2 px-2">
                    {currentTopic.subtopics.map((subtopic, index) => (
                        <motion.button
                            key={subtopic.id}
                            className={`flex-shrink-0 px-4 py-2 rounded-md mr-2 ${
                                subtopic.id === currentSubtopic.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                            onClick={() =>
                                navigate(`/${topicId}/${subtopic.id}`)
                            }
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {index + 1}. {subtopic.title}
                        </motion.button>
                    ))}
                </div>

                {/* Content tabs */}
                <div className="mb-6 border-b border-gray-200">
                    <div className="flex space-x-4">
                        <motion.button
                            className={`py-3 px-4 border-b-2 font-medium ${
                                activeTab === 'content'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('content')}
                            whileTap={{ scale: 0.95 }}
                        >
                            Conteúdo (C)
                        </motion.button>
                        <motion.button
                            className={`py-3 px-4 border-b-2 font-medium ${
                                activeTab === 'flashcards'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('flashcards')}
                            whileTap={{ scale: 0.95 }}
                        >
                            Flashcards (F)
                        </motion.button>
                        <motion.button
                            className={`py-3 px-4 border-b-2 font-medium ${
                                activeTab === 'quiz'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('quiz')}
                            whileTap={{ scale: 0.95 }}
                        >
                            Quiz (Q)
                        </motion.button>
                        <motion.button
                            className={`py-3 px-4 border-b-2 font-medium ${
                                activeTab === 'mindmap'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('mindmap')}
                            whileTap={{ scale: 0.95 }}
                        >
                            Mapa Mental (M)
                        </motion.button>
                    </div>
                </div>

                {/* Tab content */}
                <div className="mb-10">
                    {activeTab === 'content' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TopicContent
                                topic={currentTopic}
                                subtopic={currentSubtopic}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'flashcards' && topicId && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Flashcards topicId={topicId} />
                        </motion.div>
                    )}

                    {activeTab === 'quiz' && topicId && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Quiz topicId={topicId} />
                        </motion.div>
                    )}

                    {activeTab === 'mindmap' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ExcalidrawMindMap topicId={topicId!} />
                        </motion.div>
                    )}
                </div>

                {/* Topic summary */}
                {activeTab === 'content' && (
                    <motion.div
                        className="bg-blue-50 rounded-lg p-4 border border-blue-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h3 className="font-medium text-blue-800 mb-2">
                            Sumário do Tópico
                        </h3>
                        <p className="text-blue-700 text-sm">
                            {currentTopic.summary}
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default TopicPage;
