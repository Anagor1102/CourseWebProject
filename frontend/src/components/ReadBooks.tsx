import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';
import axios from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { Nav, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/style.css';

interface Book {
  id: number;
  title: string;
  authorid: string;
  coverimage: string;
}

interface Author {
  id: number;
  name: string;
}

const ReadBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get<number[]>(`/users/${user.id}/read-books`);
        const bookIds = response.data;
        const bookRequests = bookIds.map(id => axios.get<Book>(`/books/${id}`));
        const booksResponses = await Promise.all(bookRequests);
        const books = booksResponses.map(response => response.data);
        setBooks(books);
      } catch (error) {
        console.error('Произошла ошибка при загрузке книг.', error);
      }
    };
    const fetchAuthors = async () => {
      try {
        const response = await axios.get<Author[]>('/authors');
        setAuthors(response.data);
      } catch (error) {
        console.error('Произошла ошибка при загрузке авторов.', error);
      }
    };

    if (user && user.id) {
      fetchBooks();
      fetchAuthors();
    }
  }, [user]);

  const handleRemoveReadBook = async (bookId: number) => {
    try {
      await axios.delete(`/users/${user.id}/read-books/${bookId}`);
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
    } catch (error) {
      console.error('Произошла ошибка при попытке удалить книгу из прочитанного.', error);
    }
  };

  const getAuthorName = (authorid: string) => {
    const author = authors.find(author => author.id === parseInt(authorid));
    return author ? author.name : 'Неизвестен';
  };

  return (
    <Tab.Container id="readbooks-tabs" defaultActiveKey="readbooks">
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
          <Row>
            {books.map((book) => (
              <Col key={book.id} md={3} lg={3}>
                <Card className="mb-2">
                  <Card.Img variant="top" src={book.coverimage} className="book-cover-image" />
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <Card.Text>{getAuthorName(book.authorid)}</Card.Text>
                    <div className="card-buttons">
                      <Button variant="primary" href={`/books/${book.id}`} className="read-button">Подробнее</Button>
                      <Button variant="danger" onClick={() => handleRemoveReadBook(book.id)} className="favorite-button">Удалить из прочитанного</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default ReadBooks;
