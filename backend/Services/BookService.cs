using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IBookService
    {
        Task<IEnumerable<Book>> GetAllBooks();
        Task<Book> GetBookById(int id);
        Task<Book> CreateBook(Book book);
        Task UpdateBook(Book book);
        Task DeleteBook(int id);
        Task<IEnumerable<Book>> GetBooksByAuthorAndGenre(int authorId, int genreId);
    }

    public class BookService : IBookService
    {
        private readonly LibraryContext _context;

        public BookService(LibraryContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Book>> GetAllBooks()
        {
            return await _context.books.ToListAsync();
        }

        public async Task<Book> GetBookById(int id)
        {
            return await _context.books.FindAsync(id);
        }

        public async Task<Book> CreateBook(Book book)
        {
            _context.books.Add(book);
            await _context.SaveChangesAsync();
            return book;
        }

        public async Task UpdateBook(Book book)
        {
            _context.Entry(book).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBook(int id)
        {
            var book = await _context.books.FindAsync(id);
            if (book != null)
            {
                _context.books.Remove(book);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<Book>> GetBooksByAuthorAndGenre(int authorId, int genreId)
    {
        return await _context.books
            .Where(book => (authorId == 0 || book.authorid == authorId) &&
                           (genreId == 0 || book.genreid == genreId))
            .ToListAsync();
    }
    }
}
