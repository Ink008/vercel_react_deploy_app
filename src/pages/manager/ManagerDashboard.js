import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import ManagerStudents from "./ManagerStudents";
import ManagerTeachers from "./ManagerTeacher";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ManagerDashboard() {
    const [bodyState, setBodyState] = useState(0);
    const admin = JSON.parse(sessionStorage.getItem("admin"));
    const navigate = useNavigate();

    useEffect(() => {
        if (!admin) {
            navigate("/login");
        }
    }, []);


    return (
        <div className='vh-100 bg-dark'>
            <Navbar className='justify-content-between navbar-dark bg-primary'>
                <Container className='mt-0'>
                    <Navbar.Brand ><b>Manager</b></Navbar.Brand>
                    <Navbar.Toggle aria-controls='navbar-menu' />
                    <Navbar.Collapse id='navbar-menu'>
                        <Nav className="me-auto">
                            <Nav.Link
                            onClick={() => {
                                setBodyState(0);
                            }}>Quản lý học sinh</Nav.Link>
                            <Nav.Link
                            onClick={() => {
                                setBodyState(1);
                            }}
                            >Quản lý giáo viên</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
                <Container className='justify-content-end mt-0'>
                    <Button variant='danger'
                    onClick={() => {
                        sessionStorage.removeItem("admin");
                        navigate('/');
                    }}>Đăng xuất</Button>
                </Container>
            </Navbar>
            <Container className='text-white my-3'>
                {bodyState === 0 ? <ManagerStudents /> : <ManagerTeachers />}
            </Container>
        </div>
    );
}

export default ManagerDashboard;