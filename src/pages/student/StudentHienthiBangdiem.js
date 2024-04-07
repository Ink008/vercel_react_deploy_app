import React, { useState, useEffect } from 'react';

const Scoreboard = () => {
  const [scores, setScores] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('/api/scores');
        if (!response.ok) {
          throw new Error('Lỗi khi tải bảng điểm.');
        }
        const data = await response.json();
        setScores(data);
      } catch (error) {
        setError('Đã có lỗi xảy ra khi tải bảng điểm.');
        console.error('Error:', error);
      }
    };

    fetchScores();
  }, []);

  return (
    <div>
      <h2>Bảng điểm</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Mã số sinh viên</th>
            <th>Tên</th>
            <th>Điểm</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score) => (
            <tr key={score.id}>
              <td>{score.student_id}</td>
              <td>{score.student_name}</td>
              <td>{score.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;
