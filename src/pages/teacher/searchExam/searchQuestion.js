import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API_URL from '../../../Config';

import 'bootstrap/dist/css/bootstrap.min.css';

const SearchQuestion = () => {
    const [questions, setQuestions] = useState([]);
    const [searchTerm] = useState('');
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const examID = new URLSearchParams(useLocation().search).get("id");

    useEffect(() => {
        // Lấy thông tin giáo viên từ sessionStorage
        const storedTeacher = JSON.parse(sessionStorage.getItem('user'));
        setCurrentTeacher(storedTeacher);

        // Gọi hàm searchQuestions khi component được tải
        searchQuestions();
    }, []);

    const searchQuestions = async () => {
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

    const isOwner = (creatorId) => {
        // Kiểm tra xem creatorId có phải là creatorId của giáo viên hiện tại không
        return creatorId === currentTeacher.id;
    };

    const handleEdit = (questionId) => {
        // Xử lý sự kiện sửa
        console.log(`Đã nhấn vào nút Sửa của câu hỏi có ID ${questionId}`);
    };

    const handleDelete = (questionId) => {
        // Xác nhận trước khi xóa
        if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này không?')) {
            // Gửi yêu cầu xóa đến server
            console.log(`Đã nhấn vào nút Xóa của câu hỏi có ID ${questionId}`);
        }
    };

    return (
        <div className="container">
            <h1 className="heading">Kết quả tìm kiếm</h1>
            <Link to={`/teacher/searchExam?searchTerm=${searchTerm}`}>
                <button className="back-button">Quay lại</button>
            </Link>
            <div className="search-results">
                {questions.length > 0 ? (
                    questions.map(question => (
                        <div key={question.id} className="search-box text-center">
                            <h5>{question.content}</h5>
                            {isOwner(question.creator_id) && (
                                <div>
                                    <button className="btn btn-primary me-2" onClick={() => handleEdit(question.id)}>Sửa</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(question.id)}>Xóa</button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Không có kết quả nào phù hợp.</p>
                )}
            </div>
        </div>
    );
};

export default SearchQuestion;
