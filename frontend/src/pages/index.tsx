"use client"; // Add this directive to make the component client-side

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Card from "@/components/ui/card";
import { FloatingNav } from "@/components/ui/floating-navbar";
import Pagination from "@/components/ui/pagination";
import { BookDocument } from "@/types/book";


const HomePage = () => {
  const [books, setBooks] = useState<BookDocument[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  
  // Access query parameters from the URL
  const { query, page } = router.query;
  
  const currentPage = page ? Number(page) : 1; // Default to 1 if no page is specified
  const currentQuery = query ? String(query) : ""; // Default to empty string if no query is specified

  useEffect(() => {
    const fetchBooks = async () => {
      let res;
      if (currentQuery.length > 0) {
        res = await fetch(`http://localhost:8000/api/books/search?query=${currentQuery}&page=${currentPage}`);
      } else {
        res = await fetch(`http://localhost:8000/api/books?page=${currentPage}&limit=${6}`);
      }

      const data = await res.json();
      setBooks(data.books || []); // Assuming the API returns an object with a `books` array
      setTotalPages(data.totalPages || 1); // Adjust based on your API response
    };

    fetchBooks();
  }, [currentQuery, currentPage]); // Fetch data when query or page changes

  const handleSearch = (searchQuery: string) => {
    // Update the query in URL and reset to page 1 when new search is made
    router.push({
      pathname: "/",
      query: { query: searchQuery, page: "1" }, // Reset page to 1 on search
    });
  };

  const handlePageChange = (page: number) => {
    router.push({
      pathname: "/",
      query: { query: currentQuery, page: String(page) }, // Keep the query intact while changing pages
    });
  };

  return (
    <div>
      <FloatingNav handleSearch={handleSearch} />
      <h1 className="text-center text-2xl font-bold my-4">Book List</h1>

      {/* If no books are found, show a user-friendly message */}
      {books.length === 0 ? (
        <div className="text-center text-xl text-gray-600 my-8">
          <p>No books found. Please try a different search or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 ">
          {books.map((book: BookDocument) => (
            <div key={book._id} className="flex justify-center items-center m-3">
              <Card key={book._id} book={book} />
            </div>
          ))}
        </div>
      )}

      {/* Show pagination only if books are found */}
      {books.length > 0 && (
        <div className='fixed bottom-0 flex items-center justify-center w-full'>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange} // Update the current page
          />
          </div>
      )}
    </div>
  );
};

export default HomePage;
