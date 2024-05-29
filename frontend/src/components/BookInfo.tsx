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
  authorid: string;
  genreid: string;
  publishedyear: string;
  coverimage: string;
}

interface Author {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

const BookInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = React.useState<Book | null>(null);
  const [author, setAuthor] = React.useState<Author | null>(null);
  const [genre, setGenre] = React.useState<Genre | null>(null);
  const { user } = useAuth();

  React.useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const bookResponse = await axios.get<Book>(`/books/${id}`);
      setBook(bookResponse.data);
      const authorResponse = await axios.get<Author>(`/authors/${bookResponse.data.authorid}`);
      setAuthor(authorResponse.data);
      const genreResponse = await axios.get<Genre>(`/genres/${bookResponse.data.genreid}`);
      setGenre(genreResponse.data);
    } catch (error) {
      console.error('Произошла ошибка при загрузке книг.', error);
    }
  };

  const addToFavourites = async (bookId: number) => {
    if (!user) {
      // Redirect to login if not authenticated
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
          console.error("Произошла ошибка при попытке добавления избранных книг.", error);
        }
      }
    }
  };

  const addToReadBooks = async (bookId: number) => {
    if (!user) {
      // Redirect to login if not authenticated
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
          console.error("Произошла ошибка при попытке добавления прочитанных книг.", error);
        }
      }
    }
  };

  if (!book) {
    return <div>Загрузка...</div>;
  }

  return (
    <Container>
      <Row className="justify-content-center mt-4">
        <Col md={6} className="text-center">
          <img src={book.coverimage} alt={book.title} className="book-cover-image-large" />
        </Col>
        <Col md={6}>
          <h2 style={{ fontSize: '4rem' }}>{book.title}</h2>
          <p style={{ fontSize: '1.5rem' }}><strong>Автор:</strong> {author?.name}</p>
          <p style={{ fontSize: '1.5rem' }}><strong>Жанр:</strong> {genre?.name}</p>
          <p style={{ fontSize: '1.5rem' }}><strong>Дата публикации:</strong> {book.publishedyear}</p>
          <Button variant="primary" className="mb-2 large-button" href={`/read/${book.id}`}>Читать</Button>
          <Button variant="secondary" onClick={() => addToFavourites(book.id)} className="mb-2 large-button">Добавить в избранное</Button>
          <Button variant="success" onClick={() => addToReadBooks(book.id)} className="mb-2 large-button">Добавить в прочитанное</Button>
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

export default BookInfo;