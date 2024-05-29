using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate(string username, string password)
        {
            User authenticatedUser = await _userService.Authenticate(username, password);
            if (authenticatedUser == null)
                return Unauthorized(new { message = "Неверный логин или пароль." });

            return Ok(authenticatedUser);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(string _username, string _password)
        {
            var existingUser = await _userService.GetUserByUsername(_username);
            if (existingUser != null)
                return BadRequest(new { message = "Имя пользователя уже занято." });

            var createdUser = await _userService.CreateUser(new User { username = _username, password = _password, favouritebooks = [], readbooks = [] });
            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.id }, createdUser);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            var users = await _userService.GetAllUsers();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(int id)
        {
            var user = await _userService.GetUserById(id);
            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<User>> CreateUser([FromBody] User user)
        {
            var createdUser = await _userService.CreateUser(user);
            return CreatedAtAction(nameof(GetUserById), new { id = createdUser.id }, createdUser);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User user)
        {
            if (id != user.id)
                return BadRequest();

            await _userService.UpdateUser(user);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUserById(int id)
        {
            await _userService.DeleteUserById(id);
            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUserByUsername(string username)
        {
            await _userService.DeleteUserByUsername(username);
            return NoContent();
        }

        [HttpGet("{id}/favourite-books")]
        public async Task<ActionResult<IEnumerable<int>>> GetFavouriteBooks(int id)
        {
            var bookIds = await _userService.GetFavouriteBooks(id);
            if (bookIds == null || !bookIds.Any())
                return NotFound();

            return Ok(bookIds);
        }

        [HttpGet("{id}/read-books")]
        public async Task<ActionResult<IEnumerable<int>>> GetReadBooks(int id)
        {
            var bookIds = await _userService.GetReadBooks(id);
            if (bookIds == null || !bookIds.Any())
                return NotFound();

            return Ok(bookIds);
        }

        [HttpPost("{id}/favourite-books/{bookId}")]
        public async Task<IActionResult> AddToFavouriteBooks(int id, int bookId)
        {
            var user = await _userService.GetUserById(id);
            if (user == null)
                return NotFound();

            if (user.favouritebooks.Contains(bookId))
                return BadRequest(new { message = "Книга уже в избранном" });

            user.favouritebooks.Add(bookId);
            await _userService.UpdateUser(user);

            return Ok(user);
        }

        [HttpPost("{id}/read-books/{bookId}")]
        public async Task<IActionResult> AddToReadBooks(int id, int bookId)
        {
            var user = await _userService.GetUserById(id);
            if (user == null)
                return NotFound();

            if (user.readbooks.Contains(bookId))
                return BadRequest(new { message = "Книга уже в прочитанном" });

            user.readbooks.Add(bookId);
            await _userService.UpdateUser(user);

            return Ok(user);
        }

        [HttpDelete("{id}/favourite-books/{bookId}")]
        public async Task<IActionResult> RemoveFromFavouriteBooks(int id, int bookId)
        {
            var user = await _userService.GetUserById(id);
            if (user == null)
                return NotFound();

            user.favouritebooks.Remove(bookId);
            await _userService.UpdateUser(user);

            return NoContent();
        }

        [HttpDelete("{id}/read-books/{bookId}")]
        public async Task<IActionResult> RemoveFromReadBooks(int id, int bookId)
        {
            var user = await _userService.GetUserById(id);
            if (user == null)
                return NotFound();

            user.readbooks.Remove(bookId);
            await _userService.UpdateUser(user);

            return NoContent();
        }
    }
}