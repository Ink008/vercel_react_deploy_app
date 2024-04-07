import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';

function ManagerLogin() {
    return (
        <div className='d-flex justify-content-center align-items-center vh-100 bg-dark'>
            <div className='border rounded w-50 shadow'>
                <Form 
                onSubmit={(e) => {
                    e.preventDefault();
                }}
                className='d-flex flex-column'>
                    <div className='mx-3'>
                        <Form.Label className='text-white' htmlFor='username'>Tài khoản</Form.Label>
                        <Form.Control id='username'/>
                    </div>
                    <div className='mx-3'>
                        <Form.Label className='text-white' htmlFor='password'>Mật khẩu</Form.Label>
                        <Form.Control type='password' id='password'/>
                    </div>
                    <Button type='submit' className='m-3' variant='success'>Đăng nhập</Button>
                </Form>
            </div>
        </div>
    );
}

export default ManagerLogin;