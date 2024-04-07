import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../../Config';

function Home() {
    const [examName, setExamName] = useState('');
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = (search) => {
        if (!search) search='';
        fetch(`${API_URL}/hocsinh/exam?search=${encodeURIComponent(search)}`)
            .then((res) => res.json())
            .then((data) => {
                if (data) {
                    console.log(`${API_URL}/hocsinh/exam?search=${encodeURIComponent(search)}`);
                    setExams(data);
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.error('Lỗi fetch exams:', error);
                setLoading(false);
            });

    };

    return (
        <div>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card mt-5 mb-4">
                            <div className="card-body">
                                <h1 className="card-title text-center mb-4">Danh sách bài kiểm tra</h1>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    setLoading(true);
                                    fetchExams(examName);
                                }}>
                                    <div className="input-group mb-3">
                                        <input
                                            onChange={(e) => {
                                                setExamName(e.target.value);
                                            }}
                                            type="text"
                                            className="form-control"
                                            placeholder="Nhập tên bài thi"
                                        />
                                        <button type="submit" className="btn btn-primary">Tìm kiếm</button>
                                    </div>
                                </form>
                                {loading ? (
                                    <p className="text-center">Loading...</p>
                                ) : (
                                    exams.length > 0 ? (
                                        <div className="row row-cols-1 row-cols-md-2 g-4">
                                            {exams.map((exam) => (
                                                <div key={exam.id} className="col">
                                                    <div className="card h-100">
                                                        <div className="card-body">
                                                            <h5 className="card-title">{exam.name}</h5>
                                                            <h5>{exam.time}</h5>
                                                            {/* Chỉnh sửa đường dẫn để điều hướng tới trang Exam và truyền tên đề thi */}
                                                            <Link to={"/Exam?exam_id=" + exam.id} className="btn btn-primary w-100">Thi</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center">Không có bài kiểm tra nào.</p>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
