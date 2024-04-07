import React, { useState } from 'react';

const SearchExam = () => {
  const [examName, setExamName] = useState('');
  const [exams, setExams] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/exams?name=${examName}`);
      if (!response.ok) {
        throw new Error('Lỗi khi tìm kiếm kỳ thi.');
      }
      const data = await response.json();
      setExams(data);
    } catch (error) {
      setError('Đã có lỗi xảy ra trong quá trình tìm kiếm.');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Tìm kiếm kỳ thi</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={examName}
          onChange={(e) => setExamName(e.target.value)}
          placeholder="Nhập tên kỳ thi"
        />
        <button type="submit">Tìm kiếm</button>
      </form>
      <ul>
        {exams.map((exam) => (
          <li key={exam.id}>
            <div>Tên kỳ thi: {exam.name}</div>
            <div>Thời gian: {exam.time}</div>
            <div>Số lượng câu hỏi: {exam.question_no}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchExam;
