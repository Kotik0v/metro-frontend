import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { login } from '../redux/authSlice';
import metroLogo from '../assets/metro_logo.png';
import axios from '../api/axiosConfig';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Используем axiosInstance для отправки запросов
            const response = await axios.post('/users/login/', {
                username,
                password,
            });

            if (response.status === 200) {
                const data = response.data;
                dispatch(login({ username: data.username }));
                navigate('/stations');
            } else {
                setError('Неверное имя пользователя или пароль');
            }
        } catch (error) {
            console.error('Ошибка при входе:', error);
            setError('Ошибка при входе. Пожалуйста, попробуйте позже.');
        }
    };

    return (
        <div className="login-page">
            <Navbar />
            <main className="container">
                <img src={metroLogo} alt="Metro Logo" className="page-logo" />
                <h2>Вход</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleLogin}>
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
                    <button type="submit">Войти</button>
                </form>
                <p>Нет аккаунта? <Link to="/register">Регистрация</Link></p>
            </main>
        </div>
    );
};

export default LoginPage;