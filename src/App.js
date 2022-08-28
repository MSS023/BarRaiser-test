import { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import "./App.css";
import Router from "./router/Router";

function App() {
  const [active, setActive] = useState("/");

  return (
    <div className="App d-flex flex-column w-100">
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <Navbar.Brand href="#home">BarRaiser.Test</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                href="/employeesList"
                active={active === "employeesList"}
              >
                Employees List
              </Nav.Link>
              <Nav.Link href="/heirarchy" active={active === "heirarchy"}>
                Employees Heirarchy
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Router setActive={setActive} />
    </div>
  );
}

export default App;
