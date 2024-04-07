import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../../../Config';
import './css/dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Index() {
    const teacher = JSON.parse(sessionStorage.getItem('user'));
    const [exams, setExams] = useState([]);
    const [showCreateExamInput, setShowCreateExamInput] = useState(false);
    const [newExamName, setNewExamName] = useState("");
    const [duration, setDuration] = useState("");
    const [questionNo, setQuestionNo] = useState("");
    const [editingExamId, setEditingExamId] = useState(null);
    const [editingExamData, setEditingExamData] = useState({ name: "", time: "", question_no: "" }); // State lưu trữ dữ liệu của bài thi đang được sửa

    const [searchTerm, setSearchTerm] = useState("");
    const [setSearchResults] = useState([]);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = () => {
        if (teacher) {
            fetch(`${API_URL}/exam/getTeacherExams?creator_id=${teacher.id}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.exams) {
                        setExams(data.exams);
                    }
                })
                .catch((error) => {
                    console.error('Lỗi khi tải danh sách bài thi:', error);
                });
        } else {
            console.error('Không tìm thấy bài thi');
        }
    };

    const handleSearch = () => {
        // Gửi yêu cầu tìm kiếm đến server trước khi chuyển hướng
        fetch(`${API_URL}/exam/search?searchTerm=${searchTerm}`)
            .then(res => res.json())
            .then(data => {
                if (data.exams) {
                    setSearchResults(data.exams);
                }
            })
            .catch(error => {
                console.error('Lỗi khi tìm kiếm bài thi:', error);
            });
    };

    const createExam = () => {
        setShowCreateExamInput(true);
    };

    const confirmCreateExam = () => {
        if (!newExamName || !duration || !questionNo) {
            alert('Vui lòng nhập tên exam, thời gian và số lượng câu hỏi.');
            return;
        }

        fetch(`${API_URL}/exam/createExam?creator_id=${teacher.id}&name=${newExamName}&duration=${duration}&question_no=${questionNo}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setShowCreateExamInput(false);
                    setNewExamName('');
                    setDuration('');
                    setQuestionNo('');
                    fetchExams();
                    console.error('Lỗi tạo bài thi:', data.err || data.message);
                    alert('Đã có lỗi xảy ra khi tạo bài thi.');
                } else {
                    alert('Tạo bài thi thành công!');
                    fetchExams();
                }
            })
            .catch((error) => {
                console.error('Lỗi tạo exam:', error);
                alert('Đã có lỗi xảy ra khi tạo bài thi.');
            });
    };

    const cancelCreateExam = () => {
        setShowCreateExamInput(false);
        setNewExamName('');
        setDuration('');
        setQuestionNo('');
    };

    const deleteExam = (examId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài thi này không?')) {
            fetch(`${API_URL}/exam/deleteExam?id=${examId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => {
                    if (res.ok) {
                        fetchExams();
                        alert('Bài thi đã được xóa thành công!');
                    } else {
                        throw new Error('Xóa bài thi không thành công');
                    }
                })
                .catch((error) => {
                    console.error('Lỗi xóa bài thi:', error);
                    alert('Đã có lỗi xảy ra khi xóa bài thi.');
                });
        }
    };

    const updateExam = (examId, creatorId) => {
        setEditingExamId(examId); // Lưu ID của bài thi đang được sửa
        const currentExam = exams.find(exam => exam.id === examId);
        setEditingExamData(currentExam); // Lưu dữ liệu của bài thi đang được sửa
    };

    const saveUpdate = () => {
        if (!editingExamData.name || !editingExamData.time || !editingExamData.question_no) {
            alert('Vui lòng nhập tên exam, thời gian và số lượng câu hỏi.');
            return;
        }

        // Chuyển đổi thời gian từ "hh:mm:ss" thành số phút
        const totalMinutes = convertTimeToMinutes(editingExamData.time);

        fetch(`${API_URL}/exam/updateExam?creator_id=${teacher.id}&exam_id=${editingExamId}&name=${editingExamData.name}&duration=${totalMinutes}&question_no=${editingExamData.question_no}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    fetchExams();
                    alert('Đã cập nhật thông tin bài thi thành công!');
                    setEditingExamId(null); // Kết thúc chế độ sửa bài thi
                    setEditingExamData({}); // Xóa dữ liệu đang được sửa
                } else {
                    console.error('Lỗi cập nhật thông tin bài thi:', data.error || 'Unknown error');
                    alert('Đã có lỗi xảy ra khi cập nhật thông tin bài thi.');
                }
            })
            .catch((error) => {
                console.error('Lỗi cập nhật thông tin bài thi:', error);
                alert('Đã có lỗi xảy ra khi cập nhật thông tin bài thi.');
            });
    };



    const convertTimeToMinutes = (time) => {
        const timeParts = time.split(':');
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        const seconds = parseInt(timeParts[2]);
        const totalMinutes = hours * 60 + minutes + Math.round(seconds / 60); // Tính tổng số phút
        return totalMinutes;
    };

    const convertMinutesToTime = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const seconds = 0;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };



    return (
        <div className="container">
            <hr />
            <div className="d-flex justify-content-between mb-3">
                {!showCreateExamInput ? (
                    <button className="btn btn-secondary me-2" onClick={createExam}>
                        Thêm bài thi
                    </button>
                ) : (
                    <div className='d-flex form-group col-md-6'>
                        <input
                            className='form-control me-2'
                            type="text"
                            value={newExamName}
                            onChange={(e) => setNewExamName(e.target.value)}
                            placeholder="Nhập tên exam..."
                        />
                        <input
                            className='form-control me-2'
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            placeholder="Thời gian (phút)"
                        />
                        <input
                            className='form-control me-2'
                            type="number"
                            value={questionNo}
                            onChange={(e) => setQuestionNo(e.target.value)}
                            placeholder="Số lượng câu hỏi"
                        />
                        <button className="btn btn-secondary me-2" onClick={confirmCreateExam}>
                            Tạo
                        </button>
                        <button className="btn btn-secondary me-2" onClick={cancelCreateExam}>
                            Hủy
                        </button>
                    </div>
                )}
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input form-control me-2"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Link to={`/teacher/searchExam?searchTerm=${searchTerm}`}>
                        <button className="search-button">Tìm kiếm</button>
                    </Link>
                </div>
            </div>
            <hr />

            <div className="exam-grid">
                {exams.length > 0 ? (
                    exams.map((exam) => (
                        <div >
                            {editingExamId === exam.id ? ( // Nếu đang sửa bài thi, hiển thị form sửa
                                <div key={exam.id} className="exam-box text-center">

                                    <input
                                        type="text"
                                        value={editingExamData.name}
                                        onChange={(e) => setEditingExamData({ ...editingExamData, name: e.target.value })}
                                        placeholder="Tên bài thi"
                                    />
                                    <input
                                        type="number"
                                        value={convertTimeToMinutes(editingExamData.time)}
                                        onChange={(e) => {
                                            const totalMinutes = parseInt(e.target.value);
                                            const timeString = convertMinutesToTime(totalMinutes);
                                            setEditingExamData({ ...editingExamData, time: timeString });
                                        }}
                                        placeholder="Thời gian (tổng phút)"
                                    />
                                    <input
                                        type="number"
                                        value={editingExamData.question_no}
                                        onChange={(e) => setEditingExamData({ ...editingExamData, question_no: e.target.value })}
                                        placeholder="Số lượng câu hỏi"
                                    />
                                    <div className="exam-buttons">
                                        <button className="btn btn-primary me-2" onClick={saveUpdate}>Lưu</button>
                                        <button className="btn btn-secondary" onClick={() => setEditingExamId(null)}>Hủy</button>
                                    </div>
                                </div>
                            ) : (
                                <div key={exam.id} className="exam-box text-center">
                                    <Link to={`/teacher/question?id=${exam.id}`}>
                                        <h5>{exam.name}</h5>
                                    </Link>
                                    <p>Thời gian: {convertTimeToMinutes(exam.time)} phút</p>
                                    <p>Số lượng câu hỏi: {exam.question_no}</p>
                                    <div className="exam-buttons">
                                        <button className="btn btn-primary me-2" onClick={() => updateExam(exam.id, teacher.id)}>Sửa</button>
                                        <button className="btn btn-danger" onClick={() => deleteExam(exam.id)}>Xóa</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Không có bài thi nào.</p>
                )}
            </div>
        </div>

    );
}

export default Index;
