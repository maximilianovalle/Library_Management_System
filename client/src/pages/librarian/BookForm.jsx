import React, { useState } from "react";
import axios from "axios";
import "./BookForm.css";

const BookForm = () => {
  const [title, setTitle]= useState("")
  const [genre, setGenre]= useState("")
  const [isbn, setIsbn]= useState("")
  const [year, setYear]= useState("")
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState(""); 
  const [image, setImage]= useState("")

  const [copies, setCopies] = useState("")
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!genre.trim()) newErrors.genre = "Genre is required";
    if (!isbn.trim()) newErrors.isbn = "ISBN is required";
    if (!author.trim()) newErrors.author = "Author is required";
    if (!copies.trim() || isNaN(parseInt(copies)) || parseInt(copies) < 1)
      newErrors.copies = "Enter a valid number of copies";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const bookData = {
      title,
      category_id: categoryId,
      genre,
      isbn,
      publication_year: year,
      author: author,
      image_url: image,
      copies: parseInt(copies)
    };
    console.log(bookData)
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
          
      if (!token) {
        console.error("No token found. Redirecting to login...");
        window.location.href = "/login";
        return;
      }
      console.log("Submitting book:", bookData);

      // const author_res = await axios.post(`${process.env.REACT_APP_API_URL}/addauthor`, { name: author , bio: null}, {
      //   headers: {
      //     "Authorization": `Bearer ${token}`
      //   }
      // });

      // if (author_res.data.error) {
      //   console.error("Error adding author:", author_res.data.error);
      //   alert("Failed to add author. Please try again.");
      //   setLoading(false);
      //   return;
      // }
      
      // console.log(author_res.data.message);

      const add_book_res = await axios.post(`${process.env.REACT_APP_API_URL}/addbooks`, bookData, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
      });
      alert("Book added successfully!");
      window.location.href = '/librarian'

      if (add_book_res.data.error) {
        console.error("Error adding book:", add_book_res.data.error);
        alert("Failed to add book. Please try again.");
        setLoading(false);
        return;
      }

      console.log(add_book_res.data.message);

      setTitle("");
      setCategoryId("");
      setAuthor("");
      setGenre("");
      setIsbn("");
      setYear("");
      setImage("");
      setErrors({});
      setCopies("");
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-form-page">
      <div className="book-form-container">
        <h2>Add a Book</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Title<span className="required-star">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <p className="text-error">{errors.title}</p>}
          </div>

          <div>
            <label>
              Author<span className="required-star">*</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            {errors.author && <p className="text-error">{errors.author}</p>}
          </div>

          <div>
            <label>Category ID</label>
            <input
              type="text"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            />
          </div>

          <div>
            <label>
              Genre<span className="required-star">*</span>
            </label>
            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
            {errors.genre && <p className="text-error">{errors.genre}</p>}
          </div>

          <div>
            <label>
              ISBN<span className="required-star">*</span>
            </label>
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
            {errors.isbn && <p className="text-error">{errors.isbn}</p>}
          </div>

          <div>
            <label>Publication Year</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>

          <div>
            <label>Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <div>
            <label>
              Number of Copies<span className="required-star">*</span>
            </label>
            <input type="number" value={copies} onChange={(e) => setCopies(e.target.value)} />
            {errors.copies && <p className="text-error">{errors.copies}</p>}
          </div>

          <button type="submit">Add Book</button>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
