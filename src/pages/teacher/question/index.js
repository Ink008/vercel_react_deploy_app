import React, { useEffect, useState } from "react";
import API_URL from "../../../Config";
import { useLocation, Link } from "react-router-dom";
import './css/question.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function ViewExam() {
    const [questions, setQuestions] = useState([]);
    const [exam, setExam] = useState({});
    const user = JSON.parse(sessionStorage.getItem('user'));
    const examID = new URLSearchParams(useLocation().search).get("id");
    const [showCreateQuestionInput, setShowCreateQuestionInput] = useState(false);
    const [newQuestionContent, setNewQuestionContent] = useState("");
    const [editingQuestionId, setEditingQuestionId] = useState(null);
    const [editingQuestionContent, setEditingQuestionContent] = useState("");

    useEffect(() => {
        const getQuestionsForExam = async () => {
            try {
                const response = await fetch(`${API_URL}/question/getQuestionsForExam?exam_id=${examID}`);
                if (!response.ok) {
                    throw new Error('Không thể tải danh sách câu hỏi');
                }
                const data = await response.json();
                if (data.questions) {
                    setQuestions(data.questions);
                } else {
                    setQuestions([]);
                }
            } catch (error) {
                console.error('Lỗi khi tải danh sách câu hỏi:', error);
            }
        };
        getQuestionsForExam();

        const getExamInfo = async () => {
            try {
                const response = await fetch(`${API_URL}/exam/getExam?id=${examID}`);
                if (!response.ok) {
                    throw new Error('Không thể tải danh sách bài thi');
                }
                const data = await response.json();
                if (data.exam) {
                    setExam(data.exam);
                } else {
                    setExam({});
                }
            } catch (error) {
                console.error('Lỗi khi tải danh sách bài thi:', error);
            }
        };
        getExamInfo();
    }, [examID, user.id]);

    const createQuestion = () => {
        setShowCreateQuestionInput(true);
    };

    const fetchQuestionsForExam = async () => {
        try {
            const response = await fetch(`${API_URL}/question/getQuestionsForExam?exam_id=${examID}`);
            if (!response.ok) {
                throw new Error('Không thể tải danh sách câu hỏi');
            }
            const data = await response.json();
            if (data.questions) {
                setQuestions(data.questions);
            } else {
                setQuestions([]);
            }
        } catch (error) {
            console.error('Lỗi khi tải danh sách câu hỏi:', error);
            // Xử lý lỗi nếu cần thiết
        }
    };

    const confirmCreateQuestion = () => {
        // Xác minh rằng exam_id và newQuestionContent đã được cung cấp
        if (!examID || !newQuestionContent) {
            alert("Vui lòng nhập đủ thông tin câu hỏi.");
            return;
        }

        // Gửi yêu cầu GET tới /createQuestion endpoint với dữ liệu trong query string
        fetch(`${API_URL}/question/createQuestion?exam_id=${examID}&content=${newQuestionContent}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                if (res.ok) {
                    // Nếu yêu cầu thành công, cập nhật danh sách câu hỏi và hiển thị thông báo thành công
                    fetchQuestionsForExam();
                    alert('Câu hỏi đã được thêm thành công vào bài thi.');
                } else {
                    // Nếu có lỗi, xử lý lỗi và hiển thị thông báo lỗi
                    throw new Error('Không thể thêm câu hỏi vào bài thi');
                }
            })
            .catch((error) => {
                console.error('Lỗi khi thêm câu hỏi vào bài thi:', error);
                alert('Đã xảy ra lỗi khi thêm câu hỏi vào bài thi.');
            });
    };

    const cancelCreateQuestion = () => {
        setShowCreateQuestionInput(false);
        setNewQuestionContent("");
    };

    const deleteQuestion = (questionId, examId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này không?')) {
            fetch(`${API_URL}/question/deleteQuestion?exam_id=${examId}&question_id=${questionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => {
                    if (res.ok) {
                        fetchQuestionsForExam();
                        alert('Câu hỏi đã được xóa khỏi kỳ thi thành công!');
                    } else {
                        throw new Error('Xóa câu hỏi không thành công');
                    }
                })
                .catch((error) => {
                    console.error('Lỗi xóa câu hỏi:', error);
                    alert('Đã có lỗi xảy ra khi xóa câu hỏi khỏi kỳ thi.');
                });
        }
    };

    const updateQuestion = (questionId, currentContent) => {
        setEditingQuestionId(questionId);
        setEditingQuestionContent(currentContent);
    };

    const saveUpdatedQuestion = (questionId) => {
        fetch(`${API_URL}/question/updateQuestion?exam_id=${examID}&question_id=${questionId}&new_content=${editingQuestionContent}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    fetchQuestionsForExam();
                    alert('Đổi nội dung câu hỏi thành công!');
                    setEditingQuestionId(null); // Reset trạng thái chỉnh sửa
                    setEditingQuestionContent(""); // Reset nội dung chỉnh sửa
                } else {
                    console.error('Lỗi cập nhật nội dung câu hỏi:', data.error || 'Unknown error');
                    alert('Đã có lỗi xảy ra khi cập nhật nội dung câu hỏi.');
                }
            })
            .catch((error) => {
                console.error('Lỗi cập nhật nội dung câu hỏi:', error);
                alert('Đã có lỗi xảy ra khi cập nhật nội dung câu hỏi.');
            });
    };

    return (
        <div className="container">
            <h1>{exam.Name}</h1>
            <hr />
            {!showCreateQuestionInput ? (
                <button className="btn btn-secondary me-2" onClick={createQuestion}>
                    Thêm câu hỏi
                </button>
            ) : (
                <div className="d-flex form-group col-md-6">
                    <input
                        className="form-control me-2"
                        type="text"
                        value={newQuestionContent}
                        onChange={(e) => setNewQuestionContent(e.target.value)}
                        placeholder="Nhập nội dung câu hỏi..."
                    />
                    <button className="btn btn-secondary me-2" onClick={confirmCreateQuestion}>
                        Tạo
                    </button>
                    <button className="btn btn-secondary me-2" onClick={cancelCreateQuestion}>
                        Hủy
                    </button>
                </div>
            )}
            <hr />
            <div className="question-grid">
                {questions.length > 0 ? (
                    questions.map((question) => (
                        <div >
                            {editingQuestionId === question.id ? (
                                <div key={question.id} className="question-box text-center">
                                    <input
                                        className="form-control me-2"
                                        type="text"
                                        value={editingQuestionContent}
                                        onChange={(e) => setEditingQuestionContent(e.target.value)}
                                    />
                                    <div className="question-buttons">
                                        <button className="btn btn-primary me-2" onClick={() => saveUpdatedQuestion(question.id)}>Lưu</button>
                                        <button className="btn btn-secondary" onClick={() => setEditingQuestionId(null)}>Hủy</button>
                                    </div>
                                </div>
                            ) : (
                                <div key={question.id} className="question-box text-center">
                                    <Link to={`/teacher/answer?id=${question.id}`}>
                                        <h5>{question.content}</h5>
                                    </Link>
                                    <div className="question-buttons">
                                        <button className="btn btn-primary me-2" onClick={() => updateQuestion(question.id, question.content)}>Sửa</button>
                                        <button className="btn btn-danger" onClick={() => deleteQuestion(question.id, examID)}>Xóa</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Không có câu hỏi nào.</p>
                )}
            </div>
        </div>
    );
}

export default ViewExam;
