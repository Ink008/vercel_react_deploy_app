import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API_URL from '../../Config';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard() {
    const [scores, setScores] = useState([]);
    const [mssv, setmssv] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchScores = (mssv) => {
        if (mssv) {
            fetch(`${API_URL}/hocsinh/score?mssv=${mssv}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data) {
                        setScores(data);
                        console.log(data);
                        setLoading(false);
                    }
                })
                .catch((error) => {
                    console.error('Lỗi fetch score:', error);
                    setLoading(false);
                });
        } else {
            console.error('Score không được tìm thấy.');
        }
    };

    // const handleSearch = () => {
    //     // Gửi yêu cầu tìm kiếm đến server trước khi chuyển hướng
    //     fetch(`${API_URL}/exam/search?searchTerm=${searchTerm}`)
    //         .then(res => res.json())
    //         .then(data => {
    //             if (data.exams) {
    //                 setSearchResults(data.exams);
    //             }
    //         })
    //         .catch(error => {
    //             console.error('Lỗi khi tìm kiếm bài kiểm tra:', error);
    //         });
    // };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card mt-5 mb-4">
                        <div className="card-body">
                            <h1 className="card-title text-center mb-4">Xem Bảng Điểm</h1>
                            <div className="d-flex justify-content-between mb-3">
                                <div className="search-container w-100">
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        setLoading(true);
                                        fetchScores(mssv);
                                        //setTimeout(() => fetchScores(mssv), 1000);
                                    }}>
                                    <div className="input-group mb-3">
                                    <input
                                        onChange={(e) => {
                                            setmssv(e.target.value);
                                        }}
                                        type="text"
                                        className="form-control"
                                        placeholder="Nhập MSSV"
                                    />
                                    <button type="submit" className="btn btn-primary">Tìm kiếm</button>
                                    </div>
                                    </form>
                                </div>
                            </div>
                            
                            {loading ? (
                                <p className="text-center">Loading...</p>
                            ) : ( 
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                        <th scope="col">Mã đề</th>
                                        <th scope="col">Tên Bài Thi</th>
                                        <th scope="col">Điểm</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scores.map(score => 
                                        <tr>
                                            <th scope="row">{score.id}</th>
                                            <td>{score.name}</td>
                                            <td>{score.grade}</td>
                                        </tr>)}
                                    </tbody>
                                </table>
                            )}                          
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
