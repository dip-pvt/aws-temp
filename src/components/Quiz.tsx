import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import { quizQuestions } from '../data/awsData';
import { cn } from '../lib/utils';

export function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (selectedOption === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-auto border border-slate-100"
      >
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
        <p className="text-slate-600 mb-6">
          You scored <span className="font-bold text-orange-600">{score}</span> out of <span className="font-bold">{quizQuestions.length}</span>
        </p>
        <button
          onClick={resetQuiz}
          className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
      </motion.div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">AWS Knowledge Check</h2>
        <span className="text-sm font-medium text-slate-500">
          Question {currentQuestion + 1} of {quizQuestions.length}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h3 className="text-lg font-medium text-slate-800 mb-6 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3 mb-8">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = isAnswered && index === question.correctAnswer;
            const isWrong = isAnswered && isSelected && index !== question.correctAnswer;

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={isAnswered}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group",
                  !isAnswered && "hover:border-orange-300 hover:bg-orange-50/50",
                  !isAnswered && isSelected && "border-orange-500 bg-orange-50 ring-1 ring-orange-500",
                  isAnswered && isCorrect && "border-green-500 bg-green-50 ring-1 ring-green-500",
                  isAnswered && isWrong && "border-red-500 bg-red-50 ring-1 ring-red-500",
                  isAnswered && !isCorrect && !isWrong && "opacity-50 border-slate-200"
                )}
              >
                <span className={cn(
                  "font-medium",
                  isSelected ? "text-orange-900" : "text-slate-700",
                  isCorrect && "text-green-900",
                  isWrong && "text-red-900"
                )}>
                  {option}
                </span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                {isAnswered && isWrong && <XCircle className="w-5 h-5 text-red-600" />}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100"
            >
              <p className="text-sm text-slate-600">
                <span className="font-bold text-slate-900">Explanation:</span> {question.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-end">
          {!isAnswered ? (
            <button
              onClick={handleCheckAnswer}
              disabled={selectedOption === null}
              className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-orange-200"
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              {currentQuestion + 1 === quizQuestions.length ? 'Finish Quiz' : 'Next Question'}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
