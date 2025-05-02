import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import quizzesData from '../data/quizzes.json';

interface QuizProps {
    topicId: string;
}

interface Question {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
}

const Quiz = ({ topicId }: QuizProps) => {
    const topicQuestions =
        quizzesData[topicId as keyof typeof quizzesData] || [];
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState<{
        [key: number]: number;
    }>({});
    const [showExplanation, setShowExplanation] = useState(false);

    // Initialize or reset quiz when topic changes
    useEffect(() => {
        generateQuiz();
    }, [topicId]);

    const generateQuiz = () => {
        // Shuffle and limit to 5 questions
        const shuffled = [...topicQuestions].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(5, shuffled.length));

        setQuestions(selected);
        setCurrentQuestion(0);
        setScore(0);
        setShowResults(false);
        setSelectedAnswers({});
        setShowExplanation(false);
    };

    const handleAnswer = (optionIndex: number) => {
        // If already answered, do nothing
        if (selectedAnswers[currentQuestion] !== undefined) {
            return;
        }

        // Record selected answer
        const newSelectedAnswers = {
            ...selectedAnswers,
            [currentQuestion]: optionIndex
        };
        setSelectedAnswers(newSelectedAnswers);

        // Update score if correct
        if (optionIndex === questions[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }

        // Show explanation
        setShowExplanation(true);
    };

    const handleNextQuestion = () => {
        setShowExplanation(false);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    if (questions.length === 0) {
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow">
                <p className="text-gray-600">
                    Não há questões disponíveis para este tópico.
                </p>
            </div>
        );
    }

    return (
        <motion.div
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="mb-4 flex justify-between items-center">
                <h3 className="text-xl font-semibold">Quiz</h3>
                <motion.button
                    onClick={generateQuiz}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Novo Quiz
                </motion.button>
            </div>

            {/* Progress indicator */}
            {!showResults && (
                <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                        <motion.div
                            className="h-2.5 rounded-full bg-blue-600"
                            initial={{ width: 0 }}
                            animate={{
                                width: `${
                                    ((currentQuestion + 1) / questions.length) *
                                    100
                                }%`
                            }}
                            transition={{ duration: 0.3 }}
                        ></motion.div>
                    </div>
                    <div className="text-sm text-gray-500">
                        Questão {currentQuestion + 1} de {questions.length}
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {showResults ? (
                    <motion.div
                        key="results"
                        className="text-center py-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h3 className="text-2xl font-bold mb-4">
                            Resultado Final
                        </h3>
                        <motion.div
                            className="text-5xl font-bold mb-6"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{
                                delay: 0.2,
                                type: 'spring',
                                stiffness: 200
                            }}
                        >
                            {score} / {questions.length}
                        </motion.div>

                        <div className="mb-6">
                            <p className="text-lg">
                                {score === questions.length
                                    ? 'Excelente! Você acertou todas as questões!'
                                    : score >= questions.length * 0.8
                                    ? 'Muito bom! Você está dominando este tópico.'
                                    : score >= questions.length * 0.6
                                    ? 'Bom trabalho! Continue estudando para melhorar.'
                                    : 'Continue estudando este tópico para fixar melhor o conteúdo.'}
                            </p>
                        </div>

                        <motion.button
                            onClick={generateQuiz}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Novo Quiz
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="mb-6">
                            <h4 className="text-lg font-medium mb-4">
                                {questions[currentQuestion].question}
                            </h4>

                            <div className="space-y-3">
                                {questions[currentQuestion].options.map(
                                    (option, index) => {
                                        const isAnswered =
                                            selectedAnswers[currentQuestion] !==
                                            undefined;
                                        const isSelected =
                                            selectedAnswers[currentQuestion] ===
                                            index;
                                        const isCorrect =
                                            questions[currentQuestion]
                                                .correctAnswer === index;

                                        let optionClass =
                                            'p-3 border rounded-md ';

                                        if (!isAnswered) {
                                            optionClass +=
                                                'cursor-pointer hover:bg-gray-50';
                                        } else if (isSelected && isCorrect) {
                                            optionClass +=
                                                'bg-green-100 border-green-500';
                                        } else if (isSelected && !isCorrect) {
                                            optionClass +=
                                                'bg-red-100 border-red-500';
                                        } else if (isCorrect) {
                                            optionClass +=
                                                'bg-green-50 border-green-300';
                                        }

                                        return (
                                            <motion.div
                                                key={index}
                                                onClick={() =>
                                                    !isAnswered &&
                                                    handleAnswer(index)
                                                }
                                                className={optionClass}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    delay: index * 0.1,
                                                    duration: 0.2
                                                }}
                                                whileHover={
                                                    !isAnswered
                                                        ? { scale: 1.02 }
                                                        : {}
                                                }
                                            >
                                                <div className="flex items-center">
                                                    <div
                                                        className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                                                            isAnswered
                                                                ? isCorrect
                                                                    ? 'bg-green-500 text-white'
                                                                    : isSelected
                                                                    ? 'bg-red-500 text-white'
                                                                    : 'bg-gray-200'
                                                                : 'bg-gray-200'
                                                        }`}
                                                    >
                                                        {String.fromCharCode(
                                                            65 + index
                                                        )}
                                                    </div>
                                                    <span>{option}</span>
                                                </div>
                                            </motion.div>
                                        );
                                    }
                                )}
                            </div>
                        </div>

                        {/* Explanation section */}
                        <AnimatePresence>
                            {showExplanation &&
                                questions[currentQuestion].explanation && (
                                    <motion.div
                                        className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h5 className="font-medium text-blue-800 mb-2">
                                            Explicação:
                                        </h5>
                                        <p className="text-blue-900">
                                            {
                                                questions[currentQuestion]
                                                    .explanation
                                            }
                                        </p>
                                    </motion.div>
                                )}
                        </AnimatePresence>

                        <div className="mt-6 flex justify-between">
                            {selectedAnswers[currentQuestion] === undefined ? (
                                <div className="text-sm text-gray-500 italic">
                                    Selecione uma resposta para continuar
                                </div>
                            ) : (
                                <motion.button
                                    onClick={handleNextQuestion}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {currentQuestion < questions.length - 1
                                        ? 'Próxima'
                                        : 'Ver Resultado'}
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Quiz;
