import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";

type Question = {
  questionId: string;
  question: string;
  questionType: string;
  answerType: string;
  options: string[];
  correctAnswer: string[];
};

type Answer = {
  question: string;
  userAnswer: string;
  isCorrect: boolean;
};

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]); // Store answers
  const [score, setScore] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:3001/questions")
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching questions:", err));
  }, []);

  const handleWordClick = (word: string) => {
    if (selectedWords.length < 4 && !selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const handleReset = () => {
    setSelectedWords([]);
  };

  const getFilledSentence = (sentence: string, selectedWords: string[]) => {
    let index = 0;
    return sentence.split("_____________").map((part, i) => (
      <span key={i}>
        {part}
        {index < selectedWords.length && (
          <span className="font-bold text-black">{selectedWords[index++]}</span>
        )}
      </span>
    ));
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswer;

    // Check if the user's answer is correct
    const isCorrect = selectedWords.join(" ") === correctAnswer.join(" ");

    // Update the score if correct
    if (isCorrect) setScore((prev) => prev + 1);

    // Store the user's answer
    setAnswers([
      ...answers,
      {
        question: currentQuestion.question,
        userAnswer: selectedWords.join(" "),
        isCorrect,
      },
    ]);

    // Move to the next question
    setSelectedWords([]);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleFinish = () => {
    // Show final score
    alert(`Your score: ${score} out of ${questions.length}`);
  };

  const question = questions[currentQuestionIndex];

  if (questions.length === 0) return <p className="p-4">Loading...</p>;
  if (currentQuestionIndex >= questions.length)
    return <div>All questions completed! Check your results below.</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Complete The Sentence
        </h1>

        {/* Display the current question */}
        <div className="text-lg leading-relaxed mb-6 bg-gray-50 p-4 rounded shadow border border-gray-200">
          {question.question}
        </div>

        {/* Options to fill the blanks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {question.options.map((word) => (
            <Button
              key={word}
              variant="outline"
              onClick={() => handleWordClick(word)}
              disabled={selectedWords.includes(word)}
              className="text-black"
            >
              {word}
            </Button>
          ))}
        </div>

        {/* User's sentence */}
        <div className="text-center mb-4">
          <p className="font-medium mb-1 text-gray-600">Your Sentence:</p>
          <p className="text-lg font-bold text-black leading-relaxed">
            {getFilledSentence(question.question, selectedWords)}
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between w-full">
          <Button onClick={handleReset} variant="default">
            Reset Sentence
          </Button>
          <Button
            onClick={
              currentQuestionIndex === questions.length - 1
                ? handleFinish
                : handleNext
            }
            variant="default"
          >
            {currentQuestionIndex === questions.length - 1
              ? "Finish"
              : "Next Question"}
          </Button>
        </div>
      </div>

      {/* Show all answers at the end */}
      {currentQuestionIndex >= questions.length && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Your Results</h2>
          {answers.map((answer, index) => (
            <div key={index} className="mb-4">
              <div>
                <strong>Question:</strong> {answer.question}
              </div>
              <div>
                <strong>Your Answer:</strong> {answer.userAnswer}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                {answer.isCorrect ? "Correct" : "Incorrect"}
              </div>
            </div>
          ))}
          <div className="mt-4 text-lg font-bold">
            Your Score: {score} out of {questions.length}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
