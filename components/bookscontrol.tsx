import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


interface BookData {
  title: string;
  author: string;
  price: number;
  availability: boolean;
  discount: number;
  description: string;
}

export const BooksControl: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showBookForm, setShowBookForm] = useState<boolean>(false);
  const [bookData, setBookData] = useState<BookData>({
    title: "",
    author: "",
    price: 0,
    availability: true,
    discount: 0,
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://e-book-kayan.vercel.app/api/books",
        { headers: { withCredentials: true } }
      );
      setBooks(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBookData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    const isConfirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذا الكتاب؟");
    if (!isConfirmed) return;
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      await axios.delete(
        `https://e-book-kayan.vercel.app/api/books/${bookId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchBooks();
      toast.success("تم حذف الكتاب بنجاح!");
    } catch (error: any) {
      toast.error("فشل في حذف الكتاب.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!bookData.title || !bookData.author || !imageFile) {
      toast.error("Please fill all required fields.");
      return;
    }

    const token = Cookies.get("accessToken");
    const formData = new FormData();
    formData.append("title", bookData.title);
    formData.append("author", bookData.author);
    formData.append("price", bookData.price.toString());
    formData.append("availability", bookData.availability.toString());
    formData.append("discount", bookData.discount.toString());
    formData.append("description", bookData.description);
    formData.append("Image", imageFile);

    try {
      setLoading(true);
      await axios.post("https://e-book-kayan.vercel.app/api/books", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchBooks();
      toast.success("تمت إضافة الكتاب بنجاح!");
    } catch (error: any) {
      toast.error("فشل في إضافة الكتاب.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">إدارة الكتب</h1>
      <button
        onClick={() => setShowBookForm(!showBookForm)}
        className="bg-green-500 text-white px-4 py-2 rounded mb-8 disabled:opacity-50"
        disabled={loading}
      >
        {showBookForm ? "إخفاء النموذج" : "إضافة كتاب جديد"}
      </button>
      {showBookForm && (
        <form onSubmit={handleSubmit} className="grid gap-4 mb-6">
          <input
            type="text"
            name="title"
            placeholder="اسم الكتاب"
            value={bookData.title}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="author"
            placeholder="المؤلف"
            value={bookData.author}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="السعر"
            value={bookData.price}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="الوصف"
            value={bookData.description}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="p-2 border"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "تحميل..." : "إضافة الكتاب"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto bg-white bg-opacity-50 p-4 rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-3 border-b text-right text-sm font-semibold whitespace-nowrap">
                الصورة
              </th>
              <th className="py-2 px-3 border-b text-right text-sm font-semibold whitespace-nowrap">
                الاسم
              </th>
              <th className="py-2 px-3 border-b text-right text-sm font-semibold whitespace-nowrap">
                السعر
              </th>
              <th className="py-2 px-3 border-b text-right text-sm font-semibold whitespace-nowrap">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr
                key={book._id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="border-b py-2 px-3 text-center">
                  <Image
                    src={book.image.url}
                    alt={book.title}
                    width={100} // حجم الصورة أصغر للموبايل
                    height={100}
                    loading="lazy"
                    className="object-cover rounded-lg mx-auto"
                  />
                </td>
                <td className="py-2 px-3 border-b text-right text-sm">
                  {book.title}
                </td>
                <td className="py-2 px-3 border-b text-right text-sm">
                  ${book.price}
                </td>
                <td className="py-2 px-3 border-b text-right">
                  <button
                    onClick={() => handleDeleteBook(book._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
