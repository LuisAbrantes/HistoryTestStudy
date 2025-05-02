import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import flashcardsData from '../data/flashcards.json';

interface FlashcardsProps {
    topicId: string;
}

const Flashcards = ({ topicId }: FlashcardsProps) => {
    const topicFlashcards =
        flashcardsData[topicId as keyof typeof flashcardsData] || [];
    const [cards, setCards] = useState(topicFlashcards);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    // Shuffle cards when the component mounts or topic changes
    useEffect(() => {
        shuffleCards();
    }, [topicId]);

    const shuffleCards = () => {
        const shuffled = [...topicFlashcards].sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setCurrentIndex(0);
        setFlipped(false);
    };

    const nextCard = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setFlipped(false);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setFlipped(false);
        }
    };

    // Add keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextCard();
            if (e.key === 'ArrowLeft') prevCard();
            if (e.key === ' ') setFlipped(!flipped);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex, flipped]);

    if (cards.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow">
                <p className="text-gray-600">
                    Não há flashcards disponíveis para este tópico.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold">Flashcards</h3>
                <button
                    onClick={shuffleCards}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                    Embaralhar
                </button>
            </div>

            <div className="mx-auto max-w-xl">
                <div className="relative h-64 sm:h-80 [perspective:1000px]">
                    <motion.div
                        className="absolute w-full h-full cursor-pointer"
                        animate={{ rotateY: flipped ? 180 : 0 }}
                        transition={{ duration: 0.6 }}
                        onClick={() => setFlipped(!flipped)}
                    >
                        {/* Front of card */}
                        <div
                            className={`absolute w-full h-full [backface-visibility:hidden] bg-white rounded-xl shadow-lg p-6 flex items-center justify-center ${
                                flipped ? 'hidden' : ''
                            }`}
                        >
                            <p className="text-xl text-center font-medium text-gray-800">
                                {cards[currentIndex].question}
                            </p>
                        </div>

                        {/* Back of card */}
                        <div
                            className={`absolute w-full h-full [backface-visibility:hidden] bg-blue-50 rounded-xl shadow-lg p-6 flex items-center justify-center [transform:rotateY(180deg)] ${
                                !flipped ? 'hidden' : ''
                            }`}
                        >
                            <p className="text-lg text-center text-gray-700">
                                {cards[currentIndex].answer}
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-6 flex justify-between">
                    <button
                        onClick={prevCard}
                        disabled={currentIndex === 0}
                        className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                    >
                        ← Anterior
                    </button>

                    <div className="text-center text-gray-600">
                        {currentIndex + 1} de {cards.length}
                    </div>

                    <button
                        onClick={nextCard}
                        disabled={currentIndex === cards.length - 1}
                        className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                    >
                        Próximo →
                    </button>
                </div>

                <div className="mt-4 text-center text-sm text-gray-500">
                    <p>
                        Clique no cartão para virar ou pressione a barra de
                        espaço
                    </p>
                    <p>Use as setas ← → para navegar entre os cartões</p>
                </div>
            </div>
        </div>
    );
};

export default Flashcards;
