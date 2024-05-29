using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface IGenreService
    {
        Task<IEnumerable<Genre>> GetAllGenres();
        Task<Genre> GetGenreById(int id);
        Task<Genre> CreateGenre(Genre genre);
        Task UpdateGenre(Genre genre);
        Task DeleteGenre(int id);
    }

    public class GenreService : IGenreService
    {
        private readonly LibraryContext _context;

        public GenreService(LibraryContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Genre>> GetAllGenres()
        {
            return await _context.genres.ToListAsync();
        }

        public async Task<Genre> GetGenreById(int id)
        {
            return await _context.genres.FindAsync(id);
        }

        public async Task<Genre> CreateGenre(Genre genre)
        {
            _context.genres.Add(genre);
            await _context.SaveChangesAsync();
            return genre;
        }

        public async Task UpdateGenre(Genre genre)
        {
            _context.Entry(genre).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteGenre(int id)
        {
            var genre = await _context.genres.FindAsync(id);
            if (genre != null)
            {
                _context.genres.Remove(genre);
                await _context.SaveChangesAsync();
            }
        }
    }
}
