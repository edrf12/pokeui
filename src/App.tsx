import { Container, Nav, Navbar } from "react-bootstrap";
import { Link, Route, Switch, useLocation } from "wouter";
import HeaderImage from "/PokeUI.png";
// const Pokemons = lazy(() => import("./components/Pokemons"));
import Pokemons from "./components/Pokemons";

function App() {
  const [location, setLocation] = useLocation();

  if (location.search(/(https?:\/\/pokeapi.co\/)?(api\/v2\/)/) !== -1) {
    setLocation(location.replace(/(https?:\/\/pokeapi.co\/)?(api\/v2\/)/, ""));
  }

  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Link to="/">
            <Navbar.Brand className="user-select-none">
              <img src={HeaderImage} height="40" className="d-inline-block align-top" alt="PokeUI Logo" />
            </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto" activeKey={location}>
              <Link to="/" asChild>
                <Nav.Link>Pokemon</Nav.Link>
              </Link>
              <Link to="/pokemons/1" asChild>
                <Nav.Link>Items</Nav.Link>
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Switch>
        <Route path="/">
          <Pokemons />
        </Route>
        <Route path="/pokemons/:id">
          <p>Hello, world!</p>
        </Route>
      </Switch>
    </>
  );
}

export default App;
