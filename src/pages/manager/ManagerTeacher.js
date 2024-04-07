import { useState, useEffect } from "react";
import Server_URL from '../../Config';
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function ManagerTeachers() {
    const [isLoading, setLoading] = useState(false);
    const [isCreate, setCreate] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);
    const [teachers, setTeachers] = useState([]);
    const [searchString, setSearchString] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function fetchTeachers(s) {
        if(!s) s = "";
        fetch(`${Server_URL}/teachers?search=${encodeURIComponent(s)}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setTeachers(data.teachers);
            setLoading(false);
        }).catch(err => {
            alert("Lấy dữ liệu thất bại");
            console.log(err);
        });   
    }

    useEffect(() => {
        setLoading(true);
        fetchTeachers();
    }, []);

    return <>
        <h1>Quản lý Giáo Viên</h1>
        <Form onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            fetchTeachers(searchString);
        }}>
            <Form.Group className="d-flex justify-content-center my-2">
                <Form.Control placeholder="Nhập giáo viên cần tìm"
                onChange={e => setSearchString(e.target.value)}/>
                <Button className="ms-2" type="submit" variant="primary"
                disabled={isLoading}>Tìm</Button>
            </Form.Group>
        </Form>
        {isCreate ? <></> : <Button className="mb-2" variant="success" disabled={isLoading}
        onClick={() => {
            if(editIndex !== -1) setEditIndex(-1);
            setUsername("");
            setPassword("");
            setFirstName("");
            setLastName("");
            setCreate(true);
        }}>Tạo Giáo Viên</Button>}
        <table className='table table-hover table-dark table-striped border border-secondary'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Tài khoản</th>
                    <th>Mật khẩu</th>
                    <th>Họ</th>
                    <th>Tên</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {!isCreate ? <></> : <tr>
                    <td></td>
                    <td><Form.Control value={username}
                        onChange={e => setUsername(e.target.value)}/></td>
                    <td><Form.Control value={password}
                        onChange={e => setPassword(e.target.value)}/></td>
                    <td><Form.Control value={lastname}
                        onChange={e => setLastName(e.target.value)}/></td>
                    <td><Form.Control value={firstname}
                        onChange={e => setFirstName(e.target.value)}/></td>
                    <td className="d-flex justify-content-end">
                        <ButtonGroup>
                            <Button variant="primary" disabled={isLoading}
                            onClick={() => {
                                if(firstname.trim() === "" ||
                                lastname.trim() === "" ||
                                username.trim() === "" ||
                                password.trim() === "") {
                                    alert("Hãy điền đầy đủ thông tin");
                                    return;
                                }
                                setCreate(false);
                                setLoading(true);
                                fetch(`${Server_URL}/teachers/add`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        username: username,
                                        password: password,
                                        firstname: firstname,
                                        lastname: lastname
                                    })
                                }).then(res => res.json())
                                .then(data => {
                                    fetchTeachers();
                                }).catch(err => {
                                    alert("Tạo giáo viên thất bại");
                                    console.log(err);
                                    setLoading(false);
                                });
                            }}>Tạo</Button>
                            <Button variant="primary" disabled={isLoading}
                            onClick={() => setCreate(false)}>Hủy</Button>
                        </ButtonGroup>
                    </td>
                </tr>}
                {teachers.map(teacher => (
                    <tr key={teacher.id}>
                        <th>{teacher.id}</th>
                        <td>{teacher.username}</td>
                        <td>{editIndex !== teacher.id ? teacher.password : 
                        <Form.Control value={password}
                        onChange={e => setPassword(e.target.value)}/>}</td>
                        <td>{editIndex !== teacher.id ? teacher.lastname : 
                        <Form.Control value={lastname}
                        onChange={e => setLastName(e.target.value)}/>}</td>
                        <td>{editIndex !== teacher.id ? teacher.firstname : 
                        <Form.Control value={firstname}
                        onChange={e => setFirstName(e.target.value)}/>}</td>
                        <td className="d-flex justify-content-end">
                            {editIndex !== teacher.id ?
                            <ButtonGroup>
                                <Button variant="success" disabled={isLoading}
                                onClick={() => {
                                    if(isCreate) setCreate(false);
                                    setUsername(teacher.username);
                                    setPassword(teacher.password);
                                    setFirstName(teacher.firstname);
                                    setLastName(teacher.lastname);
                                    setEditIndex(teacher.id);
                                }}>Sửa</Button>
                                <Button variant="danger" disabled={isLoading}
                                onClick={() => {
                                    if(window.confirm("Bạn có muốn xóa giáo viên này")) {
                                        setLoading(true);
                                        fetch(`${Server_URL}/teachers/delete?id=${teacher.id}`)
                                        .then(res => res.json())
                                        .then(data => {
                                            fetchTeachers();
                                        }).catch(err => {
                                            alert("Xóa giáo viên thất bại");
                                            console.log(err);
                                            setLoading(false);
                                        });
                                    }
                                }}>Xóa</Button>
                            </ButtonGroup> :
                            <ButtonGroup>
                                <Button variant="primary" disabled={isLoading}
                                onClick={() => {
                                    setEditIndex(-1);
                                    setLoading(true);
                                    fetch(`${Server_URL}/teachers/update`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            id: teacher.id,
                                            username: username,
                                            password: password,
                                            firstname: firstname,
                                            lastname: lastname
                                        })
                                    }).then(res => res.json())
                                    .then(data => {
                                        fetchTeachers();
                                    }).catch(err => {
                                        alert('Sửa thông tin thất bại');
                                        console.log(err);
                                        setLoading(false);
                                    });
                                }}>Sửa</Button>
                                <Button variant="primary" disabled={isLoading}
                                onClick={() => {
                                    setEditIndex(-1);
                                }}>Hủy</Button>
                            </ButtonGroup>}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
}

export default ManagerTeachers;