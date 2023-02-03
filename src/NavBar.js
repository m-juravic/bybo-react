import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useContext } from 'react';
import userContext from './userContext';
import { Link } from 'react-router-dom';

/**
 * TODO:
 */
function NavBar({ handleLogout }) {

    const { username, id } = useContext(userContext);
    console.log("value of user at top of NavBar: ", username);

    // TODO: update this to messages page once implemented
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">BYBO</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>

                        <Nav.Link as={Link} to="/listings">Listings</Nav.Link>

                        {username && <NavDropdown title={username} id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to={`/users/${id}`}>Profile</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to={"/"}>Messages</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout}>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>}

                        {!username &&
                            <>
                                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                            </>}

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}


export default NavBar