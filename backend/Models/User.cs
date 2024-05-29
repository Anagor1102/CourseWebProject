namespace backend.Models
{
    public class User
    {
        public int id { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public List<int> favouritebooks { get; set; }
        public List<int> readbooks { get; set; }
    }
    
}
