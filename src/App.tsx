import { useEffect, useState } from "react";

type Question = {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: string[];
};

const App = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/questions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching questions: ", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-4">Loading questions...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Sentence Construction Questions</h1>
      {questions.map((q) => (
        <div
          key={q.questionId}
          className="p-4 rounded-2xl shadow bg-white border"
        >
          <p className="mb-2 text-lg">{q.question}</p>
          <ul className="list-disc pl-5 space-y-1">
            {q.options.map((opt) => (
              <li key={opt}>{opt}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default App;
