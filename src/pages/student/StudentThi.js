import React, { useState, useEffect } from 'react';

const Exam = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questions');
        if (!response.ok) {
          throw new Error('Lỗi khi tải câu hỏi.');
        }
        const data = await response.json();
        setQuestions(data);
        initializeAnswers(data);
      } catch (error) {
        setError('Đã có lỗi xảy ra khi tải câu hỏi.');
        console.error('Error:', error);
      }
    };

    fetchQuestions();
  }, []);

  const initializeAnswers = (questions) => {
    const initialAnswers = {};
    questions.forEach((question) => {
      initialAnswers[question.id] = null;
    });
    setAnswers(initialAnswers);
  };

  const handleAnswerChange = (e, questionId) => {
    const { value } = e.target;
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/submit-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });
      if (!response.ok) {
        throw new Error('Lỗi khi nộp bài thi.');
      }
      const result = await response.json();
      // Xử lý kết quả thi nếu cần
    } catch (error) {
      setError('Đã có lỗi xảy ra khi nộp bài thi.');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Thi</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        {questions.map((question) => (
          <div key={question.id}>
            <p>{question.content}</p>
            <select
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(e, question.id)}
            >
              <option value="">-- Chọn câu trả lời --</option>
              {question.answers.map((answer) => (
                <option key={answer.id} value={answer.id}>
                  {answer.content}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button type="submit">Nộp bài</button>
      </form>
    </div>
  );
};

export default Exam;
