CREATE TABLE Users (
    Id SERIAL PRIMARY KEY,
    Username VARCHAR(100) NOT NULL,
    Password VARCHAR(100) NOT NULL,
    FavouriteBooks INTEGER[],
    ReadBooks INTEGER[]
);

CREATE TABLE Books (
    Id SERIAL PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    AuthorId INTEGER NOT NULL,
    GenreId INTEGER NOT NULL,
    PublishedYear VARCHAR(100) NOT NULL,
    CoverImage VARCHAR(255) NOT NULL,
    PdfFile VARCHAR(255) NOT NULL
);

CREATE TABLE Authors (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL
);

CREATE TABLE Genres (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL
);

INSERT INTO Users (Username, Password, FavouriteBooks, ReadBooks)
VALUES
	('Anagor', 'anagor', ARRAY[1, 3], ARRAY[2]);

INSERT INTO Books (Title, AuthorId, GenreId, PublishedYear, CoverImage, PdfFile)
VALUES
	('Герой нашего времени', 1, 2, '1840', 'https://anylang.net/sites/default/files/covers/geroy-nashego-vremeni.jpg',
	 'https://imwerden.de/pdf/gerstein_geroj_nashego_vremeni_lermontova_1976__ocr.pdf'),
	('Идиот', 2, 1, '1868', 'https://www.moscowbooks.ru/image/book/739/orig/i739649.jpg',
	 'https://b1.culture.ru/c/98010/idiot.pdf'),
	('Муму', 3, 3, '1854', 'https://elibrary.orenlib.ru/up/down/img/lit/mumu.jpg',
	 'https://www.100bestbooks.ru/files/Turgeniev_Mumu.pdf');

INSERT INTO Authors (Name)
VALUES 
	('Михаил Лермонтов'), 
	('Фёдор достоевский'), 
	('Иван Тургенев');

INSERT INTO Genres (Name)
VALUES 
	('Роман'), 
	('Психологический роман'), 
	('Любовный роман');
