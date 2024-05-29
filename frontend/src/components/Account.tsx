import React from 'react';
import { Nav, Col, Row, Tab, Button } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Account: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Tab.Container id="account-tabs" defaultActiveKey="account">
      <Row>
        <Col sm={2} className="filters-column">
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link as={Link} to="/account" eventKey="account">
                Аккаунт
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/account/readbooks" eventKey="readbooks">
                Прочитанные книги
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/account/favouritebooks" eventKey="favouritebooks">
                Избранные книги
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <div className="mb-3">
            <h2>Аккаунт</h2>
          </div>
          <Tab.Content>
            <Tab.Pane eventKey="account">
              <h2>Добро пожаловать, {user.username}!</h2>
              <p></p>
              <Button variant="danger" onClick={logout}>
              Выйти
            </Button>
            </Tab.Pane>
            <Tab.Pane eventKey="readbooks">
              <Outlet />
            </Tab.Pane>
            <Tab.Pane eventKey="favouritebooks">
              <Outlet />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default Account;