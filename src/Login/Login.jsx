import React, { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Login with:', { email, password });
        // Here you would typically handle the login logic or API integration
    };

    return (
        <div className="login-container">
            {/* Left side - Title */}
            <div className="login-title">
                <h2>Đăng nhập</h2>
            </div>

            {/* Right side - Form */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email/ SĐT</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Vui lòng nhập email hoặc SĐT của bạn"
                        required
                    />
                </div>
                <div>
                    <label>Mật Khẩu</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Vui lòng nhập mật khẩu"
                        required
                    />
                </div>

                {/* Container for links and button */}
                <div className="link-button-wrapper">
                    <div className="link-section">
                        <p>Chưa có tài khoản? <a href="#">Đăng Ký Ngay</a></p>
                        <p><a href="#">Quên mật khẩu</a></p>
                    </div>
                    <button>Đăng nhập</button> {/* Button aligned to the right */}
                </div>
            </form>
        </div>
    )
}
