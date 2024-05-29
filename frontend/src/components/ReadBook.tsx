import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axios from '../api/axios';
import '../styles/style.css';
import { isAxiosError } from 'axios';
import { useAuth } from '../contexts/AuthContext'; 


interface Book {
  id: number;
  title: string;
  pdffile: string;
}

const ReadBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = React.useState<Book | null>(null);
  const { user } = useAuth();

  React.useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const bookResponse = await axios.get<Book>(`/books/${id}`);
      setBook(bookResponse.data);
    } catch (error) {
      console.error('Произошла ошибка при загрузке книг.', error);
    }
  };

  const addToFavourites = async (bookId: number) => {
    if (!user) {
      return;
    }
    try {
      const response = await axios.post(`/users/${user.id}/favourite-books/${bookId}`);
      alert("Книга добавлена в избранное");
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response && error.response.status === 400) {
          alert("Книга уже в избранном");
        } else {
          console.error("Произошла ошибка при попытке добавить книгу в избранное.", error);
        }
      }
    }
  };

  const addToReadBooks = async (bookId: number) => {
    if (!user) {
      return;
    }
    try {
      const response = await axios.post(`/users/${user.id}/read-books/${bookId}`);
      alert("Книга добавлена в прочитанное");
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response && error.response.status === 400) {
          alert("Книга уже в прочитанном");
        } else {
          console.error("Произошла ошибка при попытке добавить книгу в прочитанное.", error);
        }
      }
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row className="justify-content-center mt-4">
        <Col md={12} className="text-center">
          <iframe src={book.pdffile} title={book.title} width="100%" height="800px"></iframe>
        </Col>
      </Row>
      <Row className="justify-content-center mt-4">
        <Col md={4}>
          <Button variant="secondary" onClick={() => addToFavourites(book.id)} className="mb-2 large-button">Добавить в избранное</Button>
        </Col>
        <Col md={4}>
          <Button variant="success" onClick={() => addToReadBooks(book.id)}  className="mb-2 large-button">Добавить в прочитанное</Button>
        </Col>
      </Row>
      <Row>
        <Col md={12} className="text-start mt-2">
          <Button variant="secondary" onClick={() => navigate(-1)} className="back-button">Назад</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ReadBook;