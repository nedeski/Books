import React from "react";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
}

interface BookListProps {
  books: Book[];
  searchQuery: string;
}

export const BookList: React.FC<BookListProps> = ({ books, searchQuery }) => {
  return (
    <div className="book-list">
      {books.length === 0 ? (
        <p>No results found for '{searchQuery}'</p>
      ) : (
        <ul className="book-list__ul">
          {books.map((book) => (
            <li key={book.id}>
              <div className="book">
                <div>
                  <span className="book-title">
                    {highlightMatches(book.title, searchQuery)}
                  </span>
                  <span className="book-author">
                    {highlightMatches(book.author, searchQuery)}
                  </span>
                  <span className="book-genre">
                    {highlightMatches(book.genre, searchQuery)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const highlightMatches = (text: string, query: string): JSX.Element => {
  if (!query) return <>{text}</>;

  const regex = new RegExp(`(${query})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <b key={index}>{part}</b>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};
