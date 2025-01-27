// pages/upload-book.tsx
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPG", "PNG", "JPEG"];

// Define TypeScript interfaces for the book form
interface BookFormInputs {
  title: string;
  author: string;
  publicationYear: number;
  isbn: string;
  description: string;
}

export default function UploadBook({ toggleModal,setBooks,books }: {toggleModal: ()=>void;setBooks:([])=>void,books:[]}) {
  const [image, setImage] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormInputs>();

  const onFileChange = (file: File) => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      setUploadError("File size exceeds 2MB.");
    } else {
      setImage(file);
      setUploadError("");
    }
  };

  const onSubmit: SubmitHandler<BookFormInputs> = async (data) => {
    if (!image) {
      setUploadError("Please upload a valid image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("publicationYear", data.publicationYear.toString());
    formData.append("isbn", data.isbn);
    formData.append("description", data.description);
    formData.append("image", image);

    try {
      const response = await fetch("http://localhost:8000/api/books", {
        method: "POST",
          body: formData
      });

      if (response.ok) {
        alert("Book uploaded successfully!");
        toggleModal();
        let data = await response.json();
        setBooks([...books,data.savedBook])
        
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Something went wrong.");
      }
    } catch (err:unknown) {
        if (err instanceof Error) {
            alert("An error occurred: " + err.message);
          } else {
            alert("An unknown error occurred.");
          }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Book</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Title</label>
          <input
            {...register("title", { required: "Title is required." })}
            className="border p-2 w-full rounded"
            placeholder="Enter book title"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Author */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Author</label>
          <input
            {...register("author", { required: "Author is required." })}
            className="border p-2 w-full rounded"
            placeholder="Enter author name"
          />
          {errors.author && (
            <p className="text-red-500 text-sm">{errors.author.message}</p>
          )}
        </div>

        {/* Publication Year */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Publication Year</label>
          <input
            {...register("publicationYear", {
              required: "Publication year is required.",
              valueAsNumber: true,
                min: { value: 1000, message: "Enter a valid year." },
                max: { value: 2025, message: "Enter a valid year." },
            })}
            type="number"
            className="border p-2 w-full rounded"
            placeholder="Enter publication year"
          />
          {errors.publicationYear && (
            <p className="text-red-500 text-sm">
              {errors.publicationYear.message}
            </p>
          )}
        </div>

        {/* ISBN */}
        <div className="mb-4">
          <label className="block font-medium mb-2">ISBN</label>
          <input
            {...register("isbn", { required: "ISBN is required." })}
            className="border p-2 w-full rounded"
            placeholder="Enter ISBN"
          />
          {errors.isbn && (
            <p className="text-red-500 text-sm">{errors.isbn.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Description</label>
          <textarea
            {...register("description", { required: "Description is required." })}
            className="border p-2 w-full rounded"
            placeholder="Enter description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Image */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Book Cover Image</label>
          <FileUploader
            handleChange={onFileChange}
            name="image"
            types={fileTypes}
          />
          {uploadError && (
            <p className="text-red-500 text-sm mt-2">{uploadError}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
