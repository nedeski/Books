import { useEffect, useState } from "react";
import "./App.css";
import { Book, BookList } from "./assets/components/Books/Books";
import { SearchBar } from "./assets/components/Search/Search";

const App = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("author");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const jsonRes = await fetch(
          "https://nedeski.github.io/Books/data/books.json"
        );
        const jsonBooks = await jsonRes.json();

        const csvRes = await fetch(
          "https://nedeski.github.io/Books/data/books.csv"
        );
        const csvText = await csvRes.text();
        const csvBooks = csvText.split("\n").map((line) => {
          const [id, title, author, genre] = line.split(",");
          return { id, title, author, genre };
        });

        // Merge jsonBooks and csvBooks based on unique id field
        const mergedBooks = jsonBooks.map((jsonBook: Book) => {
          const correspondingCsvBook = csvBooks.find(
            (csvBook: Book) => csvBook.id === jsonBook.id
          );
          return {
            ...jsonBook,
            ...correspondingCsvBook,
          };
        });

        setBooks(mergedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBooks = filteredBooks.sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "author") {
      return a.author.localeCompare(b.author);
    } else if (sortBy === "genre") {
      return a.genre.localeCompare(b.genre);
    }
    return 0;
  });

  return (
    <div className="app">
      <h1>Book Search and Sort</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="sort">
        <label htmlFor="sort">Sort by: </label>
        <select
          id="sort"
          className="sort-select"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="genre">Genre</option>
        </select>
      </div>
      <BookList books={sortedBooks} searchQuery={searchQuery} />
    </div>
  );
};

export default App;
