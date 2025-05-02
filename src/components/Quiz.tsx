import { useState, useEffect } from 'react';
import quizzesData from '../data/quizzes.json';

interface QuizProps {
  topicId: string;
}

const Quiz = ({ topicId }: QuizProps) => {
  const topicQuestions = quizzesData[topicId as keyof typeof quizzesData] || [];
  const [questions, setQuestions] = useState<typeof topicQuestions>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<{[key: number]: number}>({});

  // Initialize or reset quiz when topic changes
  useEffect(() => {
    generateNewQuiz();
  }, [topicId]);

  const generateNewQuiz = () => {
    // Shuffle and limit to 5 questions
    const shuffled = [...topicQuestions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(5, shuffled.length));
    
    setQuestions(selected);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResults(false);
    setAnsweredQuestions({});
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (answeredQuestions[currentQuestion] !== undefined) return;
    
    setSelectedOption(optionIndex);
    
    // Update answered questions
    setAnsweredQuestions({
      ...answeredQuestions,
      [currentQuestion]: optionIndex
    });
    
    // Update score if correct
    if (optionIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowResults(true);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <p className="text-gray-600">Não há questões disponíveis para este tópico.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold">Quiz</h3>
        <button 
          onClick={generateNewQuiz}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Novo Quiz
        </button>
      </div>

      {showResults ? (
        <div className="text-center py-8">
          <h3 className="text-2xl font-bold mb-4">Resultado Final</h3>
          <div className="text-5xl font-bold mb-6">
            {score} / {questions.length}
          </div>
          <p className="mb-6 text-gray-600">
            {score === questions.length 
              ? "Parabéns! Você acertou todas as questões!" 
              : "Continue estudando para melhorar seu conhecimento."}
          </p>
          <button
            onClick={generateNewQuiz}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md"
          >
            Tentar Novamente
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-2 text-sm text-gray-500">
            Questão {currentQuestion + 1} de {questions.length}
          </div>
          
          <h4 className="text-lg font-medium mb-4">
            {questions[currentQuestion].question}
          </h4>
          
          <div className="space-y-3 mb-6">
            {questions[currentQuestion].options.map((option, index) => {
              const isSelected = answeredQuestions[currentQuestion] === index;
              const isCorrect = questions[currentQuestion].correctAnswer === index;
              const isAnswered = answeredQuestions[currentQuestion] !== undefined;
              
              let optionClass = "border border-gray-300 rounded-md p-3 cursor-pointer hover:bg-gray-50";
              
              if (isAnswered) {
                if (isSelected && isCorrect) {
                  optionClass = "border-2 border-green-500 bg-green-50 rounded-md p-3";
                } else if (isSelected && !isCorrect) {
                  optionClass = "border-2 border-red-500 bg-red-50 rounded-md p-3";
                } else if (isCorrect) {
                  optionClass = "border-2 border-green-500 bg-green-50 rounded-md p-3";
                } else {
                  optionClass = "border border-gray-300 rounded-md p-3 opacity-60";
                }
              }
              
              return (
                <div 
                  key={index}
                  className={optionClass}
                  onClick={() => handleOptionSelect(index)}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 mr-2 border border-gray-400 rounded-full flex items-center justify-center">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div>{option}</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={answeredQuestions[currentQuestion] === undefined}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === questions.length - 1 ? "Ver Resultado" : "Próxima Questão"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
