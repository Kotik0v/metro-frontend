import { NavLink } from 'react-router-dom';
import { ROUTES } from "../../Routes";
import { dest_root } from "../../../target_config";
import { useAppSelector, useAppDispatch } from "../../store/store.ts";
import { handleLogout, checkSession } from "../../store/slices/userSlice.ts";
import { useNavigate } from 'react-router-dom';
import './navbar.css';
import { useState, useEffect } from 'react';

export const BasicNavbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useAppSelector((state) => state.user.is_authenticated);
    const username = useAppSelector((state) => state.user.username);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        dispatch(checkSession())
            .unwrap()
            .catch((error) => {
                console.error('Ошибка при проверке сессии:', error);
                // Просто логируем ошибку, не вызываем logout
            });
    }, [dispatch]);

    const logout = async () => {
        try {
            console.log('Начало процесса выхода');
            await dispatch(handleLogout()).unwrap();
            console.log('Успешный выход');
            navigate(ROUTES.HOME);
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="nav">
            <div className="nav__icon">
                <NavLink to={ROUTES.HOME} className="nav__brand">
                    <img src={`${dest_root}/images/metro_logo.png`} alt="Logo" height="40" />
                </NavLink>
            </div>
            
            <button className="nav__burger" onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className={`nav__links ${isMenuOpen ? 'active' : ''}`}>
                <NavLink to={ROUTES.HOME} className="nav__link" end>
                    Главная
                </NavLink>
                <NavLink to={ROUTES.STATIONS} className="nav__link" end>
                    Станции
                </NavLink>

                {isAuthenticated ? (
                    <>
                        <div className="nav-item">
                            <NavLink  to={`${ROUTES.FLOW_ANALYSES}`} className="nav__link">
                                Анализы
                            </NavLink>
                        </div>
                        <div className="nav-item">
                            <NavLink  to={ROUTES.PROFILE} className="nav__link">
                                {username}
                            </NavLink>
                        </div>
                        <a href={ROUTES.HOME} className="nav__link" onClick={logout}>
                            Выйти
                        </a>
                    </>
                ) : (
                    <>
                        <NavLink to={ROUTES.LOGIN} className="nav__link" end>
                            Войти
                        </NavLink>
                        <NavLink to={ROUTES.REGISTER} className="nav__link" end>
                            Регистрация
                        </NavLink>
                    </>
                )}
            </div>
        </nav>
    );
};

export default BasicNavbar;