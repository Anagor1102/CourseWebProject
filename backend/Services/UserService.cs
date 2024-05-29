using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;


namespace backend.Services
{
    public interface IUserService
    {
        Task<User> Authenticate(string username, string password);
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> GetUserById(int id);
        Task<User> CreateUser(User user);
        Task UpdateUser(User user);
        Task DeleteUserById(int id);
        Task DeleteUserByUsername(string username);
        Task<IEnumerable<int>> GetFavouriteBooks(int id);
        Task<IEnumerable<int>> GetReadBooks(int id);
        Task<User> GetUserByUsername(string username);
    }

    public class UserService : IUserService
    {
        private readonly LibraryContext _context;

        public UserService(LibraryContext context)
        {
            _context = context;
        }

        public async Task<User> Authenticate(string username, string password)
        {
            return await _context.users.SingleOrDefaultAsync(x => x.username == username && x.password == password);
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _context.users.ToListAsync();
        }

        public async Task<User> GetUserById(int id)
        {
            return await _context.users.FindAsync(id);
        }

        public async Task<User> CreateUser(User user)
        {
            _context.users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task UpdateUser(User user)
        {
            _context.Entry(user).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUserById(int id)
        {
            var user = await _context.users.FindAsync(id);
            if (user != null)
            {
                _context.users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteUserByUsername(string username)
        {
            var user = await _context.users.SingleOrDefaultAsync(u => u.username == username);
            if (user != null)
            {
                _context.users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<int>> GetFavouriteBooks(int userId)
        {
            var user = await _context.users.FindAsync(userId);
            if (user == null || user.favouritebooks == null || !user.favouritebooks.Any())
                return new List<int>();

            return user.favouritebooks;
        }

        public async Task<IEnumerable<int>> GetReadBooks(int userId)
        {
            var user = await _context.users.FindAsync(userId);
            if (user == null || user.readbooks == null || !user.readbooks.Any())
                return new List<int>();

            return user.readbooks;
        }

        public async Task AddToFavouriteBooks(int userId, int bookId)
        {
            var user = await _context.users.FindAsync(userId);
            if (user != null)
            {
                if (!user.favouritebooks.Contains(bookId))
                    user.favouritebooks.Add(bookId);
                await _context.SaveChangesAsync();
            }
        }

        public async Task AddToReadBooks(int userId, int bookId)
        {
            var user = await _context.users.FindAsync(userId);
            if (user != null)
            {
                if (!user.readbooks.Contains(bookId))
                    user.readbooks.Add(bookId);
                await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveFromFavouriteBooks(int userId, int bookId)
        {
            var user = await _context.users.FindAsync(userId);
            if (user != null)
            {
                user.favouritebooks.Remove(bookId);
                await _context.SaveChangesAsync();
            }
        }

        public async Task RemoveFromReadBooks(int userId, int bookId)
        {
            var user = await _context.users.FindAsync(userId);
            if (user != null)
            {
                user.readbooks.Remove(bookId);
                await _context.SaveChangesAsync();
            }
        }
            public async Task<User> GetUserByUsername(string username)
        {
            return await _context.users.SingleOrDefaultAsync(u => u.username == username);
        }

    }

    
}

