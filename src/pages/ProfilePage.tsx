import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import { logout } from '../redux/authSlice';
import Cookies from 'js-cookie';
import { RootState } from '../redux/store';
import metroLogo from '../assets/metro_logo.png';

const ProfilePage: React.FC = () => {
    const { username, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const csrfToken = Cookies.get('csrftoken');
            const data: Record<string, unknown> = {};
            if (email) data.email = email;
            if (password) data.password = password;

            if (Object.keys(data).length === 0) {
                setError('Необходимо ввести хотя бы одно поле.');
                setSuccess('');
                return;
            }

            const response = await fetch('/users/update/', {
                method: 'PUT',
                headers: {
                    'X-CSRFToken': csrfToken || '',
                    'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });

            if (response.ok) {
                setSuccess('Профиль успешно обновлен.');
                setError('');
                dispatch(logout());
                navigate('/login');
            } else {
                setError('Ошибка при обновлении профиля.');
                setSuccess('');
            }
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
            setError('Ошибка при обновлении профиля.');
            setSuccess('');
        }
    };

    return (
        <div className="profile-page">
            <Navbar />
            <Breadcrumbs path="/profile" />
            <main className="container">
                <div className="header">
                    <img src={metroLogo} alt="Metro Logo" className="profile-logo" />
                    <h2>Добро пожаловать, {username || 'Пользователь'}!</h2>
                </div>
                <form onSubmit={handleUpdateProfile} className="profile-form">
                    <h3>Обновление профиля</h3>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <label htmlFor="email">Новый Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Введите новый email"
                    />
                    <label htmlFor="password">Новый пароль</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Введите новый пароль"
                    />
                    <button type="submit">Обновить профиль</button>
                </form>
                <div className="logout-link">
                    <Link to="/login" onClick={() => dispatch(logout())}>
                        Выйти из аккаунта
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;