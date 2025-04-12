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

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

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
    const parts = sentence.split("_____________");

    return parts.map((part, i) => (
      <span key={i}>
        {part}
        {i < parts.length - 1 &&
          (index < selectedWords.length ? (
            <span className="font-bold text-black">
              {selectedWords[index++]}
            </span>
          ) : (
            <span className="text-gray-400 underline">_____________</span>
          ))}
      </span>
    ));
  };



  if (questions.length === 0) return <p className="p-4">Loading...</p>;

  const question = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Complete The Sentence
        </h1>
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

        {selectedWords.length > 0 && (
          <div className="text-center mb-4">
            <p className="font-medium mb-1 text-gray-600">Your Sentence:</p>
            <p className="text-lg font-bold text-black leading-relaxed">
              {getFilledSentence(question.question, selectedWords)}
            </p>
          </div>
        )}

        <div className="flex justify-center">
          <Button onClick={handleReset} variant="default">
            Reset Sentence
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
