"use client";
import { Examscontrol, BooksControl, Navbar } from "@/components";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import { User } from "@/constants";
import { randomInt } from "crypto";

function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [isLoadingExams, setIsLoadingExams] = useState(false);
  const [books, setBooks] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const router = useRouter();

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        await router.replace("/login");
        return;
      }

      const userResponse = await axios.get(
        `https://e-book-kayan.vercel.app/api/users/getMe`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      const fetchedUser = userResponse.data.data;
      if (fetchedUser.role !== "admin") {
        await router.replace("/login");
      } else {
        setUser(fetchedUser);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      toast.error("فشل في جلب بيانات المستخدم");
      await router.replace("/login");
    } finally {
      setIsLoadingUser(false);
    }
  }, [router]);

  // Fetch books data
  const fetchBooks = useCallback(async () => {
    setIsLoadingBooks(true);
    try {
      const response = await axios.get(
        "https://e-book-kayan.vercel.app/api/books",
        { headers: { withCredentials: true } }
      );
      setBooks(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch books.");
    } finally {
      setIsLoadingBooks(false);
    }
  }, []);

  // Fetch exams data
  const fetchExams = useCallback(async () => {
    setIsLoadingExams(true);
    try {
      const token = Cookies.get("accessToken");
      let allExams: any[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const response = await axios.get(
          `https://e-book-kayan.vercel.app/api/exams?page=${currentPage}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        allExams = [...allExams, ...response.data.exams];
        totalPages = response.data.totalPages;
        currentPage++;
      } while (currentPage <= totalPages);

      setExams(allExams);
    } catch (error: any) {
      console.error(
        "Error fetching all exams:",
        error.response?.data || error.message
      );
      toast.error("فشل في جلب الامتحانات");
    } finally {
      setIsLoadingExams(false);
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (user) {
      fetchBooks();
      fetchExams();
    }
  }, [user, fetchBooks, fetchExams]);

  // Loading state
  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">جارٍ التحميل...</p>
      </div>
    );
  }

  // Redirect if no user
  if (!user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-8">
        {/* العنوان الرئيسي */}
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          لوحة تحكم الأدمن
        </h1>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white bg-opacity-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">عدد الكتب</h2>
            <p className="text-3xl font-bold text-blue-500">
              {isLoadingBooks ? "جارٍ التحميل..." : books.length}
            </p>
          </div>
          <div className="bg-white bg-opacity-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">
              عدد الامتحانات
            </h2>
            <p className="text-3xl font-bold text-green-500">
              {isLoadingExams ? "جارٍ التحميل..." : exams.length}
            </p>
          </div>
          <div className="bg-white bg-opacity-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700">
              المستخدمين النشطين
            </h2>
            <p className="text-3xl font-bold text-purple-500">{10}</p>
          </div>
        </div>

        {/* قسم المنتجات والامتحانات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg md:shadow-md">
            <BooksControl />
          </div>
          <div className="rounded-lg md:shadow-md">
            <Examscontrol />
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
