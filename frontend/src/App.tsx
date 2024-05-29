import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import HomePage from './components/HomePage';
import Account from './components/Account';
import ReadBooks from './components/ReadBooks';
import FavouriteBooks from './components/FavouriteBooks';
import Login from './components/Login';
import Register from './components/Register';
import BookInfo from './components/BookInfo';
import ReadBook from './components/ReadBook';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="/" style={{marginLeft: '20px'}}>Book Library</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/">Книги</Nav.Link>
              <Nav.Link href="/account">Аккаунт</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Container fluid className="mt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/readbooks"
              element={
                <ProtectedRoute>
                  <ReadBooks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/favouritebooks"
              element={
                <ProtectedRoute>
                  <FavouriteBooks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/books/:id"
              element={
                <ProtectedRoute>
                  <BookInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/read/:id"
              element={
                <ProtectedRoute>
                  <ReadBook />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Container>
      </AuthProvider>
    </Router>
  );
};

export default App;