import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import API_URL from '../../Config';


const Exam = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const exam_id = queryParameters.get("exam_id");
  const [examTime, setExamTime] = useState(0);
  const [exam, setExam] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [mssv, setMssv] = useState('');
  const [validStudent, setValidStudent] = useState(false);
  const [examTitle, setExamTitle] = useState('');
  const [showStudentInfo, setShowStudentInfo] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isExamInProgress, setIsExamInProgress] = useState(false); // Biến đánh dấu trạng thái bài thi
  const [studentInfoConfirmed, setStudentInfoConfirmed] = useState(false); // Biến đánh dấu xác nhận mã sinh viên và bắt đầu bài thi
  const [examStarted, setExamStarted] = useState(false); // Biến đánh dấu bắt đầu làm bài thi
  const [message, setMessage] = useState('Đang nộp');
  
  useEffect(() => {
    fetchExamContent();
    fetchExamInfo();
  }, []);

  useEffect(() => {
    if (countdownStarted) {
      startCountdown();
    }
  }, [countdownStarted]);

  useEffect(() => {
    // Kiểm tra trạng thái bài thi khi tải lại trang
    const handleUnload = (e) => {
      // Hiển thị cảnh báo khi người dùng thoát ra khi bài thi đang diễn ra
      if (isExamInProgress && !submitted) {
        e.preventDefault();
        e.returnValue = ''; // Cài đặt thông điệp cảnh báo cho trình duyệt
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);
  
  useEffect(() => {
    // Tự động nộp bài khi thời gian kết thúc và thông tin sinh viên đã được xác nhận
    if (remainingTime === 0 && isExamInProgress && !submitted && studentInfoConfirmed) {
      handleSubmit();
    }
  }, [remainingTime, isExamInProgress, submitted, studentInfoConfirmed]);

  useEffect(() => {
    // Lưu trạng thái bắt đầu làm bài thi vào localStorage
    localStorage.setItem('examStarted', JSON.stringify(examStarted));
  }, [examStarted]);

  useEffect(() => {
    // Kiểm tra nếu trạng thái bắt đầu làm bài thi đã được lưu trước đó
    const storedExamStarted = JSON.parse(localStorage.getItem('examStarted'));
    if (storedExamStarted) {
      setExamStarted(true);
    }
  }, []);

  const convertTimeToSeconds = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':');
    return parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
  };

  const fetchExamInfo = () => {
    fetch(`${API_URL}/hocsinh/examcontent?exam_id=${exam_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Lỗi khi tải thông tin đề thi.');
        }
        return res.json();
      })
      .then((data) => {
        const timeInSeconds = convertTimeToSeconds(data.time);
        setExamTime(timeInSeconds);
        setRemainingTime(timeInSeconds);
        setExamTitle(data.title);
      })
      .catch((error) => {
        console.error('Lỗi fetch thông tin đề thi:', error);
      });
  };

  const fetchExamContent = () => {
    fetch(`${API_URL}/hocsinh/examcontent?exam_id=${exam_id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Lỗi khi tải nội dung đề thi.');
        }
        return res.json();
      })
      .then((data) => {
        setExam(data);
        setLoading(false);
        setIsExamInProgress(true); // Bắt đầu bài thi khi nội dung đề thi được tải thành công
        setExamStarted(true); // Đã bắt đầu làm bài thi
      })
      .catch((error) => {
        console.error('Lỗi fetch nội dung đề thi:', error);
        setLoading(false);
      });
  };

  const fetchTotalGrade = async (body) => {
    try {
      const response = await fetch(`${API_URL}/hocsinh/totalgrade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Lỗi khi lấy điểm tổng kết.');
      }

      const data = await response.json();
      setMessage('Đã nộp bài thi, cảm ơn bạn đã tham gia!');

      // Cập nhật state hoặc thực hiện các hành động khác với dữ liệu nhận được từ backend
      console.log(data); // In ra dữ liệu nhận được từ backend để kiểm tra
    } catch (error) {
      console.error('Đã có lỗi xảy ra khi lấy điểm tổng kết:', error);
    }
  };

  useEffect(() => {
    fetchTotalGrade(); // Gọi hàm fetchTotalGrade khi component được render
  }, []);

  const handleAnswerChange = (questionId, answerId) => {
    setSelectedAnswer(prevAnswers => {
      // Nếu đáp án đã được chọn trước đó, hãy kiểm tra xem nó có trong mảng không
      if (prevAnswers[questionId]) {
        // Nếu có, hãy kiểm tra xem đáp án mới được chọn đã được chọn trước đó chưa
        const index = prevAnswers[questionId].indexOf(answerId);
        if (index !== -1) {
          // Nếu đã được chọn trước đó, loại bỏ nó khỏi mảng
          const updatedAnswers = [...prevAnswers[questionId]];
          updatedAnswers.splice(index, 1);
          return {
            ...prevAnswers,
            [questionId]: updatedAnswers,
          };
        } else {
          // Nếu chưa được chọn trước đó, thêm nó vào mảng
          return {
            ...prevAnswers,
            [questionId]: [...prevAnswers[questionId], answerId],
          };
        }
      } else {
        // Nếu câu hỏi chưa có đáp án nào được chọn, tạo một mảng mới và thêm đáp án vào đó
        return {
          ...prevAnswers,
          [questionId]: [answerId],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Tạo mảng submittedAnswers
    const submittedAnswers = Object.entries(selectedAnswer).map(([questionId, answerIds]) => ({
      id: parseInt(questionId),
      answers: Array.isArray(answerIds) ? answerIds.map(id => parseInt(id)) : [parseInt(answerIds)],
    }));

    // In ra submittedAnswers để kiểm tra trước khi gửi
    console.log("Submitted Answers:", submittedAnswers);

    try {
      let body = {
        student_id: parseInt(mssv),
        exam_id: parseInt(exam_id),
        questions: submittedAnswers
      };

      console.log(body);
      setSubmitted(true);
      fetchTotalGrade(body);

    } catch (error) {
      console.error('Đã có lỗi xảy ra khi nộp bài thi:', error);
      setErrorMessage('Đã có lỗi xảy ra khi nộp bài thi.');
    }
  };

  const handleMssvChange = (e) => {
    setMssv(e.target.value);
    setValidStudent(false);
  };

  const handleCheckMssv = async () => {
    try {
      const response = await fetch(`${API_URL}/hocsinh/mssv?mssv=${mssv}`);
      if (!response.ok) {
        throw new Error('Lỗi khi kiểm tra mã sinh viên.');
      }
      const data = await response.json();
      const validMssvs = data.map(item => item.id); // Lấy danh sách các MSSV từ dữ liệu backend
      if (validMssvs.includes(parseInt(mssv))) {
        setValidStudent(true);
        setShowStudentInfo(false);
        setCountdownStarted(true);
        setErrorMessage(null); // Đặt errorMessage thành null khi MSSV hợp lệ
        setStudentInfoConfirmed(true); // Đặt biến này thành true khi xác nhận mã sinh viên thành công
      } else {
        setValidStudent(false);
        setErrorMessage('Mã sinh viên không hợp lệ. Vui lòng kiểm tra lại.');
      }
    } catch (error) {
      console.error('Đã có lỗi xảy ra khi kiểm tra mã sinh viên:', error);
      setValidStudent(false);
      setErrorMessage('Đã có lỗi xảy ra khi kiểm tra mã sinh viên.');
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // Render thông điệp lỗi
  const renderErrorMessage = () => {
    if (errorMessage) {
      return (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container">
      <h1 className="card-footer text-muted text-center bg-white mt-3" style={{ position: 'fixed', top: '55px', left: '50%', transform: 'translateX(-50%)', zIndex: 999, border: '3px solid #8B4513', borderRadius: '5px', padding: '5px', width: 'fit-content' }}>
        Thời gian thi: {Math.floor(remainingTime / 3600)}:{Math.floor((remainingTime % 3600) / 60)}:{remainingTime % 60}
      </h1>
      <br />
      <br />
      <div className="row justify-content-center mt-5">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="mb-3">
              
                <h1 className="card-title text-center"> {exam.name}</h1>
                {showStudentInfo && (
                  <>
                    <label htmlFor="mssv" className="form-label">Mã Sinh Viên</label>
                    <input
                      type="text"
                      className="form-control"
                      id="mssv"
                      value={mssv}
                      onChange={handleMssvChange}
                    />
                    <button className="btn btn-primary mt-2 w-100" onClick={handleCheckMssv}>Kiểm tra</button>
                  </>
                )}
              </div>
              {renderErrorMessage()}
              {!showStudentInfo && (
                <>
                  {loading ? (
                    <p className="text-center">Loading...</p>
                  ) : validStudent && exam.questions.length > 0 ? (
                    <>
                      <form onSubmit={handleSubmit}>
                        {exam.questions.map((question) => (
                          <div key={question.id} className="mb-3">
                            <p>{question.content}</p>
                            {question.correct_answer_no === 1 ? (
                              <div>
                                {question.answers.map((answer) => (
                                  <div key={answer.id} className="form-check">
                                    <input
                                      type="radio"
                                      id={`answer_${answer.id}`}
                                      className="form-check-input"
                                      name={`question_${question.id}`}
                                      value={answer.id}
                                      onChange={() => handleAnswerChange(question.id, answer.id)}
                                      disabled={submitted}
                                    />
                                    <label htmlFor={`answer_${answer.id}`} className="form-check-label">{answer.content}</label>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div>
                                {question.answers.map((answer) => (
                                  <div key={answer.id} className="form-check">
                                    <input
                                      type="checkbox"
                                      id={`answer_${answer.id}`}
                                      className="form-check-input"
                                      name={`question_${question.id}`}
                                      value={answer.id}
                                      onChange={() => handleAnswerChange(question.id, answer.id)}
                                      disabled={submitted}
                                    />
                                    <label htmlFor={`answer_${answer.id}`} className="form-check-label">{answer.content}</label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                        <div className="text-center">
                          <button type="submit" className="btn btn-primary" disabled={submitted}>Nộp bài</button>
                        </div>
                      </form>
                      {submitted && (
                        <p className="text-center mt-3">{message}</p>
                      )}
                    </>
                  ) : (
                    validStudent && <p className="text-center">Không có câu hỏi.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Exam;
