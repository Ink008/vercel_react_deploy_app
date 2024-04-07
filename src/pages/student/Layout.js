import { Outlet, Link, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-2">
        <Link className="navbar-brand" to="/">Trang Chủ</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/Result">Xem Bảng Điểm</Link>            
            </li>
          </ul>
        </div>
        <div>
          <button className="btn btn-success"
          onClick={() => {
            navigate('/login');
          }}>Đăng nhập</button>
        </div>
      </nav>    
      <Outlet />
    </>
  )
};

export default Layout;