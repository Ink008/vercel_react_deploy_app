import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../../../Config';
import './css/searchExam.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function SearchExam() {
    const [searchResults, setSearchResults] = useState([]);
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const [editingExamId, setEditingExamId] = useState(null);
    const [editingExamData, setEditingExamData] = useState({ name: "", time: "", question_no: "" });

    useEffect(() => {
        const storedTeacher = JSON.parse(sessionStorage.getItem('user'));
        setCurrentTeacher(storedTeacher);
        searchExams();
    }, []);

    const searchExams = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTerm = urlParams.get('searchTerm');

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

    const isOwner = (creatorId) => {
        return creatorId === currentTeacher.id;
    };

    const handleEdit = (examId) => {
        setEditingExamId(examId);
        const currentExam = searchResults.find(exam => exam.id === examId);
        setEditingExamData({
            name: currentExam.name,
            time: currentExam.time,
            question_no: currentExam.question_no
        });
    };

    const saveUpdate = () => {
        if (!editingExamData.name || !editingExamData.time || !editingExamData.question_no) {
            alert('Vui lòng nhập tên bài thi, thời gian và số lượng câu hỏi.');
            return;
        }

        const totalMinutes = convertTimeToMinutes(editingExamData.time);

        fetch(`${API_URL}/exam/updateExam?creator_id=${currentTeacher.id}&exam_id=${editingExamId}&name=${editingExamData.name}&duration=${totalMinutes}&question_no=${editingExamData.question_no}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    searchExams();
                    alert('Đã cập nhật thông tin bài thi thành công!');
                    setEditingExamId(null);
                    setEditingExamData({ name: "", time: "", question_no: "" });
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
                        searchExams();
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

    // Chuyển đổi thời gian từ chuỗi "hh:mm:ss" sang tổng số phút
    const convertTimeToMinutes = (time) => {
        const timeParts = time.split(':');
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        const seconds = parseInt(timeParts[2]);
        const totalMinutes = hours * 60 + minutes + Math.round(seconds / 60); // Tính tổng số phút
        return totalMinutes;
    };

    // Chuyển đổi tổng số phút thành thời gian dưới dạng chuỗi "hh:mm:ss"
    const convertMinutesToTime = (totalMinutes) => {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const seconds = (totalMinutes - Math.floor(totalMinutes)) * 60;
        return `${hours}:${minutes}:${seconds}`;
    };


    return (
        <div className="container">
            <h1 className="heading">Kết quả tìm kiếm</h1>
            <Link to="/teacher">
                <button className="back-button">Quay lại</button>
            </Link>
            <div className="search-results">
                {searchResults.length > 0 ? (
                    searchResults.map(exam => (
                        <div>
                            {editingExamId === exam.id ? (
                                <div key={exam.id} className="search-box text-center">
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
                                <div key={exam.id} className="search-box text-center">
                                    <Link to={`/teacher/searchQuestion?id=${exam.id}`}>
                                        <h5>{exam.name}</h5>
                                    </Link>
                                    <p>Thời gian: {convertTimeToMinutes(exam.time)} phút</p>
                                    <p>Số lượng câu hỏi: {exam.question_no}</p>
                                    {isOwner(exam.creator_id) && (
                                        <div className="exam-buttons">
                                            <button className="btn btn-primary me-2" onClick={() => handleEdit(exam.id)}>Sửa</button>
                                            <button className="btn btn-danger" onClick={() => deleteExam(exam.id)}>Xóa</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>Không tìm thấy kết quả phù hợp.</p>
                )}
            </div>
        </div>
    );
}

export default SearchExam;
