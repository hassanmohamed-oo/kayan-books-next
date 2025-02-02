"use client";
import { useState, useEffect, useRef } from "react";

import Image from "next/image";
import Cookies from "js-cookie";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import { Type } from "react-feather";


interface CartItem {
  _id: string;
  book: string;
  price: number;
  quantity: number;
}

interface BookDetails {
  _id: string;
  title: string;
  description: string;
  image: { url: string };
  price: number;
  category?: string;
  rating?: number;
}

export default function Bookspage() {
  const [books, setBooks] = useState<BookDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [processingItems, setProcessingItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 🔄 جلب البيانات
  useEffect(() => {
    fetchData();
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      const token = Cookies.get("accessToken");

      const booksRes = await axios.get(
        "https://e-book-kayan.vercel.app/api/books",
        {
          params: {
            limit: 12,
            page: 1,
            search: searchQuery,
          },
        }
      );

      setBooks(booksRes.data.data);

      if (token) {
        try {
          const cartRes = await axios.get(
            "https://e-book-kayan.vercel.app/api/cart",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setCartItems(cartRes.data.data.cartItems);
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🛒 إدارة السلة
  const toggleCart = async (bookId: string) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    setProcessingItems((prev) => [...prev, bookId]);

    try {
      const existingItem = cartItems.find((item) => item.book === bookId);

      if (existingItem) {
        // 🚀 إزالة العنصر من السلة
        await axios.delete(
          `https://e-book-kayan.vercel.app/api/cart/${existingItem._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        // ✅ تحديث القائمة بدون Refresh
        setCartItems((prev) =>
          prev.filter((item) => item._id !== existingItem._id)
        );
        toast.success("تم الإزالة من السلة");
      } else {
        // 🚀 إضافة العنصر إلى السلة
        const response = await axios.post(
          "https://e-book-kayan.vercel.app/api/cart/",
          { id: bookId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const newItem: CartItem = {
          _id: response.data.cartItem?._id || "",
          book: bookId,
          price: response.data.cartItem?.price || 0,
          quantity: response.data.cartItem?.quantity || 1,
        };

        // ✅ تحديث القائمة بدون Refresh
        setCartItems((prev) => [...prev, newItem]);
        toast.success("تمت الإضافة إلى السلة");
      }
    } catch (error: any) {
      toast.error("فشلت العملية");
      console.error("Error:", error.response?.data || error.message);
    } finally {
      setProcessingItems((prev) => prev.filter((id) => id !== bookId));
    }
  };

  interface FilterBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
  }

  const FilterBar = ({ searchQuery, setSearchQuery }: FilterBarProps) => {


    return (
      <div className="w-full max-w-6xl mx-auto px-4 mb-12 space-y-4">
        <div className="relative">
          <input
            type="text"
            id="search"
            className="w-full p-3 pr-12 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ابحث عن كتاب..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            
            
         
          />
        
          <i className="fa-solid fa-magnifying-glass absolute right-4 top-4 text-gray-400" />
        </div>
      </div>
    );
  };

  // 💎 تصميم بطاقة الكتاب
  const BookCard = ({ book }: { book: BookDetails }) => {
    const isInCart = cartItems.some((item) => item.book === book._id);
    const isProcessing = processingItems.includes(book._id);

    return (
      <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
        <ToastContainer />
        <div className="relative aspect-[4/3]">
          <Image
            src={book.image.url}
            alt={book.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          {book.rating && (
            <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-bold text-amber-500">
              <i className="fa-solid fa-star" />
              {book.rating.toFixed(1)}
            </div>
          )}
        </div>

        <div className="p-4 space-y-3">
          <h3 className="text-xl font-bold truncate">{book.title}</h3>
          <p className="text-gray-600 line-clamp-2 text-sm">
            {book.description}
          </p>

          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat("ar-EG", {
                style: "currency",
                currency: "EGP",
              }).format(book.price)}
            </span>

            <button
              onClick={() => toggleCart(book._id)}
              disabled={isProcessing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isInCart
                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              }`}
            >
              {isProcessing ? (
                <i className="fa-solid fa-spinner animate-spin" />
              ) : isInCart ? (
                <>
                  <i className="fa-solid fa-trash" />
                  <span className="max-md:hidden">إزالة</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-cart-plus" />
                  <span className="max-md:hidden">إضافة</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 🖼️ عرض الهيكل العظمي أثناء التحميل
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-12">
        <FilterBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen py-12 ">
      <FilterBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="w-full max-w-6xl mx-auto px-4">
        {books.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <i className="fa-solid fa-book-open text-6xl text-gray-300" />
            <p className="text-xl text-gray-500">لا توجد كتب متاحة</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
