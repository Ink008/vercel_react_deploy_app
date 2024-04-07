import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "./img/logo.svg";


function Container() {
    const teacher = JSON.parse(sessionStorage.getItem("currentteacher"));
    const [navbarHeight, setNavbarHeight] = useState(0);

    useEffect(() => {
        const navbar = document.querySelector("#main-navbar");
        if (navbar) {
            setNavbarHeight(navbar.offsetHeight);
        }
    }, []);
    return (
        <div className="d-flex flex-row" style={{ height: `calc(100vh - ${navbarHeight}px)` }}>
            <div className="bg-light" style={{ width: "100%", overflowY: "scroll" }}>
                <Outlet />
            </div>
        </div>
    );
}

function Layout() {
    const teacher = JSON.parse(sessionStorage.getItem("user"));
    const navigate = useNavigate();

    console.log(teacher);
    useEffect(() => {
        if (!teacher) {
            navigate("/login");
        }
    }, [teacher, navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("currentteacher");
        navigate("/");
    };

    return (
        <>
            <nav id="main-navbar" className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary">
                <div className="container-fluid">
                    <Link to="/teacher" className="navbar-brand">
                        <img src={Logo} alt="logo" height={50} width={50} />
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 h5">
                            <li className="nav-item">
                                <a href="#" className="nav-link active">{`${teacher ? teacher.lastname : ""} ${teacher ? teacher.firstname : ""}`}</a>
                            </li>
                            <li className="nav-item">
                                <Link to="/teacher" className="nav-link">Exam</Link>
                            </li>
                        </ul>
                        <button className="btn btn-outline-light btn-lg" onClick={handleLogout}>Đăng xuất</button>
                    </div>
                </div>
            </nav>
            <Container />
        </>
    );
}

export default Layout;
