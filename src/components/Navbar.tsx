import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import axios from 'axios';
import { logout } from '../redux/authSlice';
import { RootState } from '../redux/store';
import metroLogo from '../assets/metro_logo.png';

const Navbar: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isAuthenticated, username } = useSelector((state: RootState) => state.auth);

    const handleLogout = async () => {
        try {
            const csrfToken = Cookies.get('csrftoken');
            await axios.post('/users/logout/', {}, {
                headers: {
                    'X-CSRFToken': csrfToken || '',
                    'Content-Type': 'application/json'
                }
            });
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img src={metroLogo} alt="Metro Logo" />
                </Link>
            </div>
            <nav className="navbar-links">
                <Link to="/stations">Список станций</Link>
                {isAuthenticated ? (
                    <>
                        <Link to="/flow-analysis">Заявка</Link>
                        <Link to="/profile">{username}</Link>
                        <button onClick={handleLogout}>Выйти</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Вход</Link>
                        <Link to="/register">Регистрация</Link>
                    </>
                )}
            </nav>
            <button className="navbar-menu" onClick={toggleMenu}>
                ☰
            </button>
            {isMenuOpen && (
                <div className="navbar-dropdown">
                    <Link to="/stations" onClick={toggleMenu}>Список станций</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/flow-analysis" onClick={toggleMenu}>Заявка</Link>
                            <Link to="/profile" onClick={toggleMenu}>{username}</Link>
                            <button onClick={handleLogout}>Выйти</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={toggleMenu}>Вход</Link>
                            <Link to="/register" onClick={toggleMenu}>Регистрация</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
};

export default Navbar;