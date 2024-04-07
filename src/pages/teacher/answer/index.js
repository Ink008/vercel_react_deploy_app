import React, { useEffect, useState } from "react";
import API_URL from "../../../Config";
import { useLocation } from "react-router-dom";
import './css/answer.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function ViewAnswer() {
    const [answers, setAnswers] = useState([]);
    const [exam, setExam] = useState({});
    const user = JSON.parse(sessionStorage.getItem('user'));
    const questionID = new URLSearchParams(useLocation().search).get("id");
    const [showCreateAnswerInput, setShowCreateAnswerInput] = useState(false);
    const [newAnswerContent, setNewAnswerContent] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [editingAnswerId, setEditingAnswerId] = useState(null);
    const [editingAnswerContent, setEditingAnswerContent] = useState("");

    useEffect(() => {
        const getAnswersForQuestion = async () => {
            try {
                const response = await fetch(`${API_URL}/answer/getAnswersForQuestion?question_id=${questionID}`);
                if (!response.ok) {
                    throw new Error('Không thể tải danh sách câu trả lời');
                }
                const data = await response.json();
                if (data.answers) {
                    setAnswers(data.answers);
                } else {
                    setAnswers([]);
                }
            } catch (error) {
                console.error('Lỗi khi tải danh sách câu trả lời:', error);
            }
        };
        getAnswersForQuestion();

        const getExamInfo = async () => {
            try {
                const response = await fetch(`${API_URL}/exam/getExam?id=${questionID}`);
                if (!response.ok) {
                    throw new Error('Không thể tải thông tin bài thi');
                }
                const data = await response.json();
                if (data.exam) {
                    setExam(data.exam);
                } else {
                    setExam({});
                }
            } catch (error) {
                console.error('Lỗi khi tải thông tin bài thi:', error);
            }
        };
        getExamInfo();
    }, [questionID, user.id]);

    const createAnswer = () => {
        setShowCreateAnswerInput(true);
    };

    const fetchAnswersForQuestion = async () => {
        try {
            const response = await fetch(`${API_URL}/answer/getAnswersForQuestion?question_id=${questionID}`);
            if (!response.ok) {
                throw new Error('Không thể tải danh sách câu trả lời');
            }
            const data = await response.json();
            if (data.answers) {
                setAnswers(data.answers);
            } else {
                setAnswers([]);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách câu trả lời:', error);
            // Xử lý lỗi nếu cần thiết
        }
    };

    const confirmCreateAnswer = () => {
        // Xác minh rằng question_id, newAnswerContent và isCorrect đã được cung cấp
        if (!questionID || !newAnswerContent) {
            alert("Vui lòng nhập đủ thông tin câu trả lời.");
            return;
        }

        // Gửi yêu cầu POST tới /createAnswer endpoint
        fetch(`${API_URL}/answer/createAnswer?question_id=${questionID}&content=${newAnswerContent}&is_correct=${isCorrect ? 1 : 0}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                if (res.ok) {
                    // Nếu yêu cầu thành công, cập nhật danh sách câu trả lời và hiển thị thông báo thành công
                    fetchAnswersForQuestion();
                    alert('Câu trả lời đã được thêm thành công.');
                } else {
                    // Nếu có lỗi, xử lý lỗi và hiển thị thông báo lỗi
                    throw new Error('Không thể thêm câu trả lời.');
                }
            })
            .catch((error) => {
                console.error('Lỗi khi thêm câu trả lời:', error);
                alert('Đã xảy ra lỗi khi thêm câu trả lời.');
            });
    };


    const cancelCreateAnswer = () => {
        setShowCreateAnswerInput(false);
        setNewAnswerContent("");
        setIsCorrect(false);
    };

    const deleteAnswer = (answerId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa câu trả lời này không?')) {
            fetch(`${API_URL}/answer/deleteAnswer?exam_id=${questionID}&answer_id=${answerId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => {
                    if (res.ok) {
                        fetchAnswersForQuestion();
                        alert('Câu trả lời đã được xóa khỏi bài thi thành công!');
                    } else {
                        throw new Error('Không thể xóa câu trả lời');
                    }
                })
                .catch((error) => {
                    console.error('Lỗi khi xóa câu trả lời:', error);
                    alert('Đã có lỗi xảy ra khi xóa câu trả lời khỏi bài thi.');
                });
        }
    };

    const updateAnswer = (answerId, currentContent) => {
        setEditingAnswerId(answerId);
        setEditingAnswerContent(currentContent);
    };

    const saveUpdatedAnswer = (answerId) => {
        fetch(`${API_URL}/answer/updateAnswer?answer_id=${answerId}&new_content=${editingAnswerContent}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    fetchAnswersForQuestion();
                    alert('Đã thay đổi nội dung câu trả lời thành công!');
                    setEditingAnswerId(null); // Reset trạng thái chỉnh sửa
                    setEditingAnswerContent(""); // Reset nội dung chỉnh sửa
                } else {
                    console.error('Lỗi khi cập nhật nội dung câu trả lời:', data.error || 'Lỗi không xác định');
                    alert('Đã xảy ra lỗi khi cập nhật nội dung câu trả lời.');
                }
            })
            .catch((error) => {
                console.error('Lỗi khi cập nhật nội dung câu trả lời:', error);
                alert('Đã xảy ra lỗi khi cập nhật nội dung câu trả lời.');
            });
    };

    const toggleCorrectAnswer = (answerId) => {
        // Lấy thông tin câu trả lời cần thay đổi trạng thái
        const selectedAnswer = answers.find(answer => answer.id === answerId);
        const questionId = selectedAnswer.question_id; // Lấy question_id từ câu trả lời

        // Gửi yêu cầu GET để cập nhật trạng thái của câu trả lời
        fetch(`${API_URL}/answer/updateCorrectAnswer?question_id=${questionId}&answer_id=${answerId}&is_correct=${selectedAnswer.is_correct ? 0 : 1}`)
            .then((res) => {
                if (res.ok) {
                    // Nếu yêu cầu thành công, cập nhật trạng thái của câu trả lời trong danh sách và hiển thị thông báo
                    const updatedAnswers = answers.map(answer => {
                        if (answer.id === answerId) {
                            return { ...answer, is_correct: selectedAnswer.is_correct ? 0 : 1 };
                        } else {
                            return answer;
                        }
                    });
                    setAnswers(updatedAnswers);
                    alert('Đã cập nhật trạng thái câu trả lời thành công!');
                } else {
                    // Nếu có lỗi, xử lý lỗi và hiển thị thông báo lỗi
                    throw new Error('Không thể cập nhật trạng thái của câu trả lời.');
                }
            })
            .catch((error) => {
                console.error('Lỗi khi cập nhật trạng thái câu trả lời:', error);
                alert('Đã có lỗi xảy ra khi cập nhật trạng thái câu trả lời.');
            });
    };

    return (
        <div className="container">
            <h1>{exam.Name}</h1>
            <hr />
            {!showCreateAnswerInput ? (
                <button className="btn btn-secondary me-2" onClick={createAnswer}>
                    Thêm câu trả lời
                </button>
            ) : (
                <div className="d-flex form-group col-md-6">
                    <input
                        className="form-control me-2"
                        type="text"
                        value={newAnswerContent}
                        onChange={(e) => setNewAnswerContent(e.target.value)}
                        placeholder="Nhập nội dung câu trả lời..."
                    />
                    <div className="form-check form-switch ms-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="isCorrectCheckbox"
                            checked={isCorrect}
                            onChange={() => setIsCorrect(!isCorrect)}
                        />
                        <label className="form-check-label" htmlFor="isCorrectCheckbox">Câu đúng</label>
                    </div>
                    <button className="btn btn-secondary me-2" onClick={confirmCreateAnswer}>
                        Tạo
                    </button>
                    <button className="btn btn-secondary me-2" onClick={cancelCreateAnswer}>
                        Hủy
                    </button>
                </div>
            )}
            <hr />
            <div className="answer-grid">
                {answers.length > 0 ? (
                    answers.map((answer) => (
                        <div>
                            {editingAnswerId === answer.id ? (
                                <div key={answer.id} className="answer-box text-center">

                                    <input
                                        className="input-answer"
                                        type="text"
                                        value={editingAnswerContent}
                                        onChange={(e) => setEditingAnswerContent(e.target.value)}
                                    />
                                    <div className="answer-buttons">
                                        <button className="btn btn-primary me-2" onClick={() => saveUpdatedAnswer(answer.id)}>Lưu</button>
                                        <button className="btn btn-secondary me-2" onClick={() => setEditingAnswerId(null)}>Hủy</button>
                                        <div className="form-check form-switch me-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`isCorrectCheckbox_${answer.id}`}
                                                checked={answer.is_correct === 1}
                                                onChange={() => toggleCorrectAnswer(answer.id)}
                                            />
                                            <label className="form-check-label" htmlFor={`isCorrectCheckbox_${answer.id}`}>Câu đúng</label>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div key={answer.id} className="answer-box text-center">
                                        <h5>{answer.content}</h5>
                                        <div className="answer-buttons">
                                            <button className="btn btn-primary me-2" onClick={() => updateAnswer(answer.id, answer.content)}>Sửa</button>
                                            <button className="btn btn-danger me-2" onClick={() => deleteAnswer(answer.id)}>Xóa</button>
                                            <div className="form-check form-switch me-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`isCorrectCheckbox_${answer.id}`}
                                                    checked={answer.is_correct === 1}
                                                    onChange={() => toggleCorrectAnswer(answer.id)}
                                                />
                                                <label className="form-check-label" htmlFor={`isCorrectCheckbox_${answer.id}`}>Câu đúng</label>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Không có câu trả lời nào.</p>
                )}
            </div>
        </div>
    );
}

export default ViewAnswer;
