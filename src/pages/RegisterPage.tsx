import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { login } from '../redux/authSlice';
import metroLogo from '../assets/metro_logo.png';
import axios from '../api/axiosConfig';

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/users/register/', {
                email,
                username,
                password,
            });

            if (response.status === 200) {
                const data = response.data;
                dispatch(login({ username: data.username }));
                navigate('/login');
            } else {
                setError('Ошибка регистрации. Проверьте введенные данные.');
            }
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            setError('Ошибка при регистрации. Попробуйте позже.');
        }
    };

    return (
        <div className="register-page">
            <Navbar />
            <main className="container">
                <img src={metroLogo} alt="Metro Logo" className="page-logo" />
                <h2>Регистрация</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleRegister}>
                    <label htmlFor="email">Электронная почта</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label htmlFor="username">Имя пользователя</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label htmlFor="password">Пароль</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Зарегистрироваться</button>
                </form>
                <p>Уже есть аккаунт? <Link to="/login">Вход</Link></p>
            </main>
        </div>
    );
};

export default RegisterPage;