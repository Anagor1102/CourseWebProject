import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from '../api/axios';
import { isAxiosError } from 'axios';
import '../styles/style.css';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuthors();
    fetchGenres();
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const authorId = selectedAuthor || '0';
      const genreId = selectedGenre || '0';
      const response = await axios.get<Book[]>(`/books/filter?authorId=${authorId}&genreId=${genreId}`);
      setBooks(response.data);
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

  const fetchGenres = async () => {
    try {
      const response = await axios.get<Genre[]>('/genres');
      setGenres(response.data);
    } catch (error) {
      console.error('Произошла ошибка при загрузке жанров.', error);
    }
  };

  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAuthor(e.target.value);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
  };

  const getAuthorName = (authorid: string) => {
    const author = authors.find(author => author.id === parseInt(authorid));
    return author ? author.name : 'Неизвестен';
  };

  const getGenreName = (genreid: string) => {
    const genre = genres.find(genre => genre.id === parseInt(genreid));
    return genre ? genre.name : 'Неизвестно';
  };

  const addToFavourites = async (bookId: number) => {
    if (!user) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }
    try {
      await axios.post(`/users/${user.id}/favourite-books/${bookId}`);
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
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }
    try {
      await axios.post(`/users/${user.id}/read-books/${bookId}`);
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

  return (
    <Row>
      <Col md={2} className="filters-column">
        <h5>Отфильтровать</h5>
        <Form.Group controlId="authorFilter">
          <Form.Label>Автор</Form.Label>
          <select className="form-control" value={selectedAuthor} onChange={handleAuthorChange}>
            <option value="">Любой</option>
            {authors.map(author => (
              <option key={author.id} value={author.id.toString()}>{author.name}</option>
            ))}
          </select>
        </Form.Group>
        <Form.Group controlId="genreFilter">
          <Form.Label>Жанр</Form.Label>
          <select className="form-control" value={selectedGenre} onChange={handleGenreChange}>
            <option value="">Любой</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id.toString()}>{genre.name}</option>
            ))}
          </select>
        </Form.Group>
        <Button variant="primary" onClick={fetchBooks} className="apply-filters-button">Применить</Button>
      </Col>
      <Col sm={9}>
        <Row>
          {books.map(book => (
            <Col key={book.id} md={3} lg={3}>
              <Card className="mb-2">
                <Card.Img variant="top" src={book.coverimage} className="book-cover-image" />
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Text>
                    <strong>Автор:</strong> {getAuthorName(book.authorid)} <br />
                    <strong>Жанр:</strong> {getGenreName(book.genreid)} <br />
                    <strong>Дата публикации:</strong> {book.publishedyear}
                  </Card.Text>
                  <Button variant="primary" href={`/books/${book.id}`} className="read-button">Подробнее</Button>
                  <Button variant="secondary" onClick={() => addToFavourites(book.id)} className="favorite-button">Добавить в избранное</Button>
                  <Button variant="success" onClick={() => addToReadBooks(book.id)} className="read-button">Добавить в прочитанное</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};

export default HomePage;