import { useState, useEffect } from "react";
import Server_URL from '../../Config';
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function ManagerStudents() {
    const [isLoading, setLoading] = useState(false);
    const [isCreate, setCreate] = useState(false);
    const [editIndex, setEditIndex] = useState(-1);
    const [students, setStudents] = useState([]);
    const [searchString, setSearchString] = useState("");
    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");

    function fetchStudents(s) {
        if(!s) s = "";
        fetch(`${Server_URL}/students?search=${encodeURIComponent(s)}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setStudents(data.students);
            setLoading(false);
        }).catch(err => {
            alert("Lấy dữ liệu thất bại");
            console.log(err);
        });   
    }

    useEffect(() => {
        setLoading(true);
        fetchStudents();
    }, []);

    return <>
        <h1>Quản lý Học Sinh</h1>
        <Form onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            fetchStudents(searchString);
        }}>
            <Form.Group className="d-flex justify-content-center my-2">
                <Form.Control placeholder="Nhập học sinh cần tìm"
                onChange={e => setSearchString(e.target.value)}/>
                <Button className="ms-2" type="submit" variant="primary" 
                disabled={isLoading}>Tìm</Button>
            </Form.Group>
        </Form>
        {isCreate ? <></> : <Button className="mb-2" variant="success" disabled={isLoading}
        onClick={() => {
            if(editIndex !== -1) setEditIndex(-1);
            setFirstName("");
            setLastName("");
            setCreate(true);
        }}>Tạo Học Sinh</Button>}
        <table className='table table-hover table-dark table-striped border border-secondary'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Họ</th>
                    <th>Tên</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {!isCreate ? <></> : <tr>
                    <td></td>
                    <td><Form.Control value={lastname}
                        onChange={e => setLastName(e.target.value)}/></td>
                    <td><Form.Control value={firstname}
                        onChange={e => setFirstName(e.target.value)}/></td>
                    <td className="d-flex justify-content-end">
                        <ButtonGroup>
                            <Button variant="primary" disabled={isLoading}
                            onClick={() => {
                                if(firstname.trim() === "" ||
                                lastname.trim() === "") {
                                    alert("Hãy điền đầy đủ thông tin");
                                    return;
                                }
                                setCreate(false);
                                setLoading(true);
                                fetch(`${Server_URL}/students/add`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        firstname: firstname,
                                        lastname: lastname
                                    })
                                }).then(res => res.json())
                                .then(data => {
                                    fetchStudents();
                                }).catch(err => {
                                    alert("Tạo học sinh thất bại");
                                    console.log(err);
                                    setLoading(false);
                                });
                            }}>Tạo</Button>
                            <Button variant="primary" disabled={isLoading}
                            onClick={() => setCreate(false)}>Hủy</Button>
                        </ButtonGroup>
                    </td>
                </tr>}
                {students.map(student => (
                    <tr key={student.id}>
                        <th>{student.id}</th>
                        <td>{editIndex !== student.id ? student.lastname : 
                        <Form.Control value={lastname}
                        onChange={e => setLastName(e.target.value)}/>}</td>
                        <td>{editIndex !== student.id ? student.firstname : 
                        <Form.Control value={firstname}
                        onChange={e => setFirstName(e.target.value)}/>}</td>
                        <td className="d-flex justify-content-end">
                            {editIndex !== student.id ?
                            <ButtonGroup>
                                <Button variant="success" disabled={isLoading}
                                onClick={() => {
                                    if(isCreate) setCreate(false);
                                    setFirstName(student.firstname);
                                    setLastName(student.lastname);
                                    setEditIndex(student.id);
                                }}>Sửa</Button>
                                <Button variant="danger" disabled={isLoading}
                                onClick={() => {
                                    if(window.confirm("Bạn có muốn xóa học sinh này")) {
                                        setLoading(true);
                                        fetch(`${Server_URL}/students/delete?id=${student.id}`)
                                        .then(res => res.json())
                                        .then(data => {
                                            fetchStudents();
                                        }).catch(err => {
                                            alert("Xóa học sinh thất bại");
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
                                    fetch(`${Server_URL}/students/update`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            id: student.id,
                                            firstname: firstname,
                                            lastname: lastname
                                        })
                                    }).then(res => res.json())
                                    .then(data => {
                                        fetchStudents();
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

export default ManagerStudents;