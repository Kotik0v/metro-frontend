import React from 'react';
import { Container, Navbar, Nav, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => (
    <Navbar bg="light" expand="lg" style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <Container>
            <Navbar.Brand as={Link} to="/">
                <Image src="http://127.0.0.1:9000/test/metro_logo.png" height="60" alt="Metro Logo" />
                Metro Analysis
            </Navbar.Brand>
            <Nav className="me-auto">
                <Nav.Link as={Link} to="/stations">Список станций</Nav.Link>
            </Nav>
        </Container>
    </Navbar>
);

export default Header;