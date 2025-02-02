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

  // دالة لإغلاق القائمة عند النقر على عنصر
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setIsProfilePopupOpen(false);
  };

  // عناصر القائمة المشتركة
  const menuItems = [
    { href: "/", label: "الرئيسية" },
    { href: "/#books", label: "الكتب" },
    { href: "/#offers", label: "عروض المدرسين" },
    { href: "/exams", label: "الاختبارات" },
    { href: "/#contact", label: "تواصل" },
  ];

  return (
    <nav className=" ">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
        {/* قائمة سطح المكتب */}
        <ul className="hidden md:flex items-center gap-8 font-medium">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-blue-500 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </ul>

        {/* الجزء الأيمن (سلة التسوق والمستخدم) */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full">
            <i className="fa-solid fa-shopping-cart text-xl text-blue-500" />
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

          {/* زر القائمة المتنقلة */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-full"
          >
            <i
              className={`fa-solid ${isMenuOpen ? "fa-x" : "fa-bars"} text-xl`}
            />
          </button>
        </div>
      </div>

      {/* قائمة الموبايل مع تحسينات */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">القائمة</h3>
              <button
                onClick={closeMobileMenu}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <i className="fa-solid fa-x text-lg" />
              </button>
            </div>

            <div className="overflow-y-auto h-[calc(100vh-120px)]">
              <ul className="flex flex-col py-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className="px-6 py-3 hover:bg-gray-100 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </ul>

              {/* قسم المستخدم في الموبايل */}
              <div className="border-t mt-4 px-6 py-4">
                {user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    {user.role === "admin" && (
                      <button
                        onClick={() => {
                          router.push("/dashboard");
                          closeMobileMenu();
                        }}
                        className="w-full text-right py-2 px-4 hover:bg-gray-100 rounded-lg"
                      >
                        لوحة التحكم
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-right py-2 px-4 hover:bg-gray-100 rounded-lg"
                    >
                      تسجيل الخروج
                    </button>

                    <button
                      onClick={handleDeleteAccount}
                      className="w-full text-right py-2 px-4 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      حذف الحساب
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2 justify-center w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <span>تسجيل دخول</span>
                    <i className="fa-solid fa-right-to-bracket" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
