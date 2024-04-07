import logo from './img/LogoTest.svg';
import './css/index.css';
import { useNavigate } from "react-router-dom";
import API_URL from "../../../Config";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


function Home() {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    fetch(`${API_URL}/teachers/isTeacher?username=${userName}&password=${passWord}`)
      .then(res => res.json())
      .then(data => {
        const isTeacher = data.isTeacher;
        if (isTeacher === true) {
          // Nếu là giáo viên, thực hiện yêu cầu để lấy thông tin của giáo viên
          fetch(`${API_URL}/teachers/getTeacher?username=${userName}&password=${passWord}`)
            .then(res => res.json())
            .then(data => {
              if (data.user) {
                sessionStorage.setItem("user", JSON.stringify(data.user));
                navigate("/teacher");
              } else {
                alert('Sai thông tin đăng nhập');
              }
            })
            .catch(error => {
              console.error('Lỗi khi lấy thông tin giáo viên:', error);
              alert('Đã có lỗi xảy ra khi lấy thông tin giáo viên.');
            });
        } else if (isTeacher === false) {
          sessionStorage.setItem("admin", JSON.stringify({ username: userName, role: 'manager' }));
          navigate("/manager");
        } else {
          alert('Sai thông tin đăng nhập');
        }
      })
      .catch(error => {
        console.error('Lỗi khi kiểm tra vai trò người dùng:', error);
        alert('Đã có lỗi xảy ra khi kiểm tra thông tin đăng nhập.');
      });
  };

  return (
    <div className="App ">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className='ms-5 p-3 bg-white custom-box'>
          <h3 className="mb-4">Login For Teacher Or Manager</h3> {/* Thêm class mb-4 để tạo khoảng cách dưới */}
          <div className='col-12'>
            <form className='form-horizontal row flex-grow-1'
              onSubmit={(handleLogin)}
            >
              <div className="form-group form-group-lg">
                <input type="text" name='username' required className='form-control mb-2' placeholder='Tài khoản...'
                  value={userName}
                  onChange={(event) => { setUserName(event.target.value) }}
                />
              </div>
              <div className="form-group">
                <input type="password" name='password' required className='form-control mb-2' placeholder='Mật khẩu...'
                  value={passWord}
                  onChange={(event) => { setPassWord(event.target.value) }}
                />
              </div>
              <div className="form-group">
                <input type="submit" name='login' className='form-control mb-2 btn btn-secondary' value={'Đăng nhập'} />
              </div>
              <div className="form-group"><hr /></div>
            </form>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Home;
