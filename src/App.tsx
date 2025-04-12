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

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedWords([]); // Reset the words for the next question
    }
  };

  const getFilledSentence = (sentence: string, selectedWords: string[]) => {
    const blanks = sentence.split("_____________");
    let index = 0;

    // For each part of the sentence (split by blank)
    return blanks.map((part, i) => (
      <span key={i}>
        {part}
        {index < selectedWords.length && (
          <span className="font-bold text-black">{selectedWords[index++]}</span>
        )}
        {/* Only show the blank if there are still words to be selected */}
        {i < blanks.length - 1 &&
          index < selectedWords.length &&
          "_____________" // Keep the blank if there are more words to select
        }
      </span>
    ));
  };

  const question = questions[currentQuestionIndex];

  if (questions.length === 0) return <p className="p-4">Loading...</p>;

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

        <div className="text-center mb-4">
          <p className="font-medium mb-1 text-gray-600">Your Sentence:</p>
          <p className="text-lg font-bold text-black leading-relaxed">
            {selectedWords.length > 0
              ? getFilledSentence(question.question, selectedWords)
              : question.question.replace(/_____________/g, "_____")}
          </p>
        </div>

        <div className="flex justify-between w-full">
          <Button onClick={handleReset} variant="default">
            Reset Sentence
          </Button>
          <Button
            onClick={handleNext}
            variant="default"
            disabled={selectedWords.length < 4}
          >
            Next Question
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
