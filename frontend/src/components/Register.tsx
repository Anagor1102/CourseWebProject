import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { isAxiosError } from 'axios';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    if (username === password) {
      alert('Пароль похож на логин');
      return;
    }
  
    try {
      await axios.post('/users/register', null, {
        params: {
          _username: username,
          _password: password
        }
      });
      await login(username, password);
      navigate('/account');
    } catch (error) {
      console.error('Ошибка регистрации', error);
      if (isAxiosError(error)) {
        if (error.response && error.response.status === 400) {
          alert('Пользователь с таким логином уже существует');
        } else {
          alert('Произошла ошибка при регистрации');
        }
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="4">
          <h2>Регистрация</h2>
          <Form onSubmit={handleRegister}>
            <Form.Group controlId="username">
              <Form.Label>Логин</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Повторите пароль</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" style={{marginTop: '10px', width: '200px', height: '50px'}}>
              Зарегистрироваться
            </Button>
            <Button variant="link" style={{marginTop: '10px', marginLeft: '10px', width: '200px', height:'50px'}} onClick={() => navigate('/login')}>
              Уже есть аккаунт?
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;