"use client";
import { FC, Key } from 'react';
import { cn } from "@/lib/utils";
import { BookDocument } from '@/types/book';

interface BookCardProps {
    book: BookDocument;
    key:Key
}
const Card: FC<BookCardProps> =({key, book }) =>{
  return (
    <div key={key} className=" w-full group/card">
      <div
        className={cn(
          " cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl  max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4",
   
        )}
        style={{
          backgroundImage: `url(http://localhost:8000${book.image_url})`,
          backgroundSize: 'cover', // Ensures the image covers the div
          backgroundPosition: 'center', // Keeps the image centered
        }}
      >
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
        <div className="flex flex-row items-center space-x-4 z-10">
          <div className="flex flex-col">
            <p className="font-normal text-base text-gray-50 relative z-10">
              {book.author}
            </p>
            <p className="text-sm text-gray-400">2 min read</p>
          </div>
        </div>
        <div className="text content">
          <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
            {book.title}
          </h1>
          <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
            {book.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Card;