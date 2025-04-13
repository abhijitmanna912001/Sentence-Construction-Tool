import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "./components/ui/card";

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
  userAnswer: string[];
  correctAnswer: string[];
  isCorrect: boolean;
};


function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

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
    const isCorrect = selectedWords.join(" ") === correctAnswer.join(" ");

    if (isCorrect) setScore((prev) => prev + 1);

    setAnswers([
      ...answers,
      {
        question: currentQuestion.question,
        userAnswer: selectedWords,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect,
      },
    ]);

    setSelectedWords([]);

    if (currentQuestionIndex === questions.length - 1) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const question = questions[currentQuestionIndex];

  const getCorrectFilledSentence = (
    sentence: string,
    correctWords: string[]
  ) => {
    let index = 0;
    return sentence.split("_____________").map((part, i) => (
      <span key={i}>
        {part}
        {index < correctWords.length && (
          <span className="font-bold text-black underline">
            {correctWords[index++]}
          </span>
        )}
      </span>
    ));
  };

  const getUserFilledSentence = (sentence: string, userWords: string[]) => {
    let index = 0;
    return sentence.split("_____________").map((part, i) => (
      <span key={i}>
        {part}
        {index < userWords.length && (
          <span className="font-bold text-black underline">
            {userWords[index++]}
          </span>
        )}
      </span>
    ));
  };

  if (questions.length === 0) return <p className="p-4">Loading...</p>;

  if (showResults) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Your Results</h2>
        <div className="w-full max-w-4xl space-y-4">
          {answers.map((answer, index) => (
            <Card key={index} className="rounded-xl border shadow-md bg-white">
              <CardHeader className="flex justify-between items-center">
                <span className="ml-auto text-sm font-medium text-gray-500">
                  {index + 1} / {questions.length}
                </span>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Prompt:</p>
                  <p className="font-medium text-gray-900">
                    {getCorrectFilledSentence(
                      answer.question,
                      answer.correctAnswer
                    )}{" "}
                  </p>

                  <p className="text-sm text-gray-600">Your Response:</p>
                  <p
                    className={`font-medium ${
                      answer.isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {getUserFilledSentence(answer.question, answer.userAnswer)}{" "}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm font-semibold">
                  {answer.isCorrect ? "✅ Correct" : "❌ Incorrect"}
                </p>
              </CardFooter>
            </Card>
          ))}
          <div className="text-right text-lg font-bold text-gray-800">
            Final Score: {score} / {questions.length}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Complete The Sentence
        </h1>
        <p className="text-center text-sm text-gray-600 mb-2">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <div className="text-lg leading-relaxed mb-6 bg-gray-50 p-4 rounded shadow border border-gray-200">
          {question.question}
        </div>
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
        <div className="text-center mb-4">
          <p className="font-medium mb-1 text-gray-600">Your Sentence:</p>
          <p className="text-lg font-bold text-black leading-relaxed">
            {getFilledSentence(question.question, selectedWords)}
          </p>
        </div>
        <div className="flex justify-between w-full">
          <Button onClick={handleReset} variant="default">
            Reset Sentence
          </Button>
          <Button onClick={handleNext} variant="default">
            {currentQuestionIndex === questions.length - 1
              ? "Finish"
              : "Next Question"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
