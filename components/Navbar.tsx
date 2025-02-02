"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";


export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    const token = Cookies.get("accessToken");
    if (!token) return;

    try {
      const userResponse = await axios.get(
        `https://e-book-kayan.vercel.app/api/users/getMe`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setUser(userResponse.data.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    setUser(null);
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      "هل أنت متأكد أنك تريد حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء."
    );
    if (!confirmDelete) return;

    try {
      const token = Cookies.get("accessToken");
      await axios.delete("https://e-book-kayan.vercel.app/api/users", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      handleLogout();
    } catch (err) {
      console.error("Error deleting account:", err);
      alert("حدث خطأ أثناء حذف الحساب. حاول مرة أخرى لاحقًا.");
    }
  };

  return (
    <>
      <div className=" container w-full lg:px-6 px-3 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer absolute top-1">
            <Image
              src="/5fd358ad-a874-45d3-8b9b-9738d8b56095.png"
              alt="Kayan Logo"
              width={120}
              height={70}
              className="-ml-4"
            />
          </div>
        </Link>

        {/* Menu */}
        <ul className="hidden md:flex items-center lg:gap-8 md:gap-2 font-medium cursor-pointer">
          <Link href="/">
            <li className="hover:text-blue-500 transition cursor-pointer">
              الرئيسية
            </li>
          </Link>
          <Link href="/#books">
            <li className="hover:text-blue-500 transition cursor-pointer">
              الكتب
            </li>
          </Link>
          <Link href="/#offers">
            <li className="hover:text-blue-500 transition cursor-pointer">
              عروض المدرسين
            </li>
          </Link>
          <Link href="/exams">
            <li className="hover:text-blue-500 transition cursor-pointer">
              الاختبارات
            </li>
          </Link>
          <Link href="/#contact">
            <li className="hover:text-blue-500 transition cursor-pointer">
              تواصل
            </li>
          </Link>
        </ul>

        {/* Cart & Hamburger */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link href="/cart">
            <i className="fa-solid fa-shopping-cart text-xl text-blue-500"></i>
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
                className="cursor-pointer py-1 px-2.5 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-600 border border-gray-300"
              >
                <span>{user.name.charAt(0).toUpperCase()}</span>
              </button>

              {/* Profile Popup */}
              {isProfilePopupOpen && (
                <div className="absolute left-0 mt-2 w-64 z-50 bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {user.role === "admin" && (
                    <button
                      onClick={() => router.push("/dashboard")}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                    >
                      فتح لوحة التحكم
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                  >
                    تسجيل الخروج
                  </button>

                  <button
                    onClick={handleDeleteAccount}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                  >
                    حذف الحساب
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xl bg-blue-500 font-bold gap-2 items-center p-2 text-white rounded-lg hidden md:flex ease-in-out duration-100 cursor-pointer"
            >
              <span>تسجيل دخول</span>
              <i className="fa-solid fa-right-to-bracket"></i>
            </Link>
          )}

          {/* Hamburger Menu */}
          <button
            className="md:hidden px-2 py-2 rounded bg-blue-100 hover:bg-blue-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="fa-solid fa-bars text-xl text-blue-500"></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden relative bg-white h-[calc(100svh-80px)] shadow-md">
          <ul className="flex flex-col items-start p-4 text-blue-500">
            <li className="py-2 hover:text-blue-900 transition">الرئيسية</li>
            <li className="py-2 hover:text-blue-900 transition">الكتب</li>
            <li className="py-2 hover:text-blue-900 transition">
              عروض المدرسين
            </li>
            <li className="py-2 hover:text-blue-900 transition">الاختبارات</li>
            <li className="py-2 hover:text-blue-900 transition">تواصل</li>
            <button className="text-xl bg-blue-500 font-bold gap-2 items-center absolute bottom-6 p-2 text-white rounded-lg flex ease-in-out duration-100 cursor-pointer">
              <span>تسجيل دخول</span>
              <i className="fa-solid fa-right-to-bracket"></i>
            </button>
          </ul>
        </div>
      )}
    </>
  );
};
