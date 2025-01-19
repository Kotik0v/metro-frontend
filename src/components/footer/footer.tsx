import { FC } from 'react';
import './footer.css';

interface FooterProps {
    style?: React.CSSProperties;
}

const Footer: FC<FooterProps> = ({ style }) => {
    return (
        <footer className="footer" style={style}>
            <div className="footer-content">
                <p>© 2024 Metro Analysis. Все права защищены.</p>
            </div>
        </footer>
    );
};

export default Footer;