import { useEffect, useState } from "react";

type Question = {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: string[];
};

const App = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/questions`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
      });
  }, []);

  const handleSelectedWord = (word: string) => {
    if (!selectedWords.includes(word)) {
      setSelectedWords([...selectedWords, word]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {questions.length > 0 ? (
        <div>
          <h1 className="text-xl font-semibold mb-4">Complete The Sentence</h1>
          <div className="mb-4">
            <p>{questions[0].question}</p>
            <div className="flex flex-wrap gap-4 mt-4">
              {questions[0].options.map((option, index) => (
                <button
                  onClick={() => handleSelectedWord(option)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  key={index}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Your Sentence: </h2>
            <p className="italic">
              {(() => {
                const parts = questions[0].question.split("__________");
                return parts.map((part, index) => (
                  <span key={index}>
                    {part}
                    {index < selectedWords.length && (
                      <span className="inline-block border-b-2 border-gray-400 font-bold mx-1">
                        {selectedWords[index]}
                      </span>
                    )}
                  </span>
                ));
              })()}
            </p>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
