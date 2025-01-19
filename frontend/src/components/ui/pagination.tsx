
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1); // Create an array of page numbers

  return (
    <div className="flex items-center justify-center space-x-2 my-4 ">
      <button
        onClick={handlePrevClick}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
      >
        Previous
      </button>

      {/* Display page numbers dynamically */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`px-4 py-2 rounded-md ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
