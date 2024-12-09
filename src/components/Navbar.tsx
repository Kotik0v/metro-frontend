import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

const NavigationBar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand as={Link} to="/">
                <img
                    src="http://127.0.0.1:9000/test/metro_logo.png"
                    alt="logo"
                    width="40"
                    height="40"
                />
                Metro Analysis
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/stations">
                        Список станций
                    </Nav.Link>
                    <Nav.Link as={Link} to="/flow-analysis">
                        Заявка
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavigationBar;