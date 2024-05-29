namespace backend.Models
{
    public class Book
    {
        public int id { get; set; }
        public string title { get; set; }
        public int authorid { get; set; }
        public int genreid { get; set; }
        public string publishedyear { get; set; }
        public string coverimage {get; set;}
        public string pdffile { get; set; }
    }
}
