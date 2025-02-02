"use client";
import { Navbar } from "@/components";
import React, { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";

interface CartItem {
  book: string;
  price: number;
  quantity: number;
  _id: string;
}

interface BookDetails {
  _id: string;
  title: string;
  description: string;
  image: { url: string };
  price: number;
}

interface UserDetails {
  fullName: string;
  address: string;
  phoneNumber: string;
  email: string;
}

interface Promo {
  code: string;
  discount: number;
}

const validPromoCodes: Promo[] = [
  { code: "KAYAN10", discount: 10 },
  { code: "BOOKLOVER", discount: 15 },
  { code: "READMORE", discount: 20 },
];

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const [books, setBooks] = useState<BookDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const [userDetails, setUserDetails] = useState<UserDetails>({
    fullName: "",
    address: "",
    phoneNumber: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<UserDetails>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // جلب الكارت
  useEffect(() => {
    const fetchCart = async () => {
      const token = Cookies.get("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          "https://e-book-kayan.vercel.app/api/cart",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setCart(response.data.data.cartItems);
      } catch (error: any) {
        setError("فشل تحميل عربة التسوق. حاول مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // جلب الكتب
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(
          "https://e-book-kayan.vercel.app/api/books",
          {
            params: { limit: 100, page: 1 },
            headers: { withCredentials: true },
          }
        );
        setBooks(response.data.data);
      } catch (error: any) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  // حذف منتج
  const handleDelete = async (cartItemId: string) => {
    const token = Cookies.get("accessToken");
    if (!token) return toast.error("يجب تسجيل الدخول أولاً");

    const confirmDelete = window.confirm("هل أنت متأكد من حذف هذا المنتج؟");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://e-book-kayan.vercel.app/api/cart/${cartItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setCart(
        (prev) => prev?.filter((item) => item._id !== cartItemId) || null
      );
      toast.success("تم الحذف بنجاح");
    } catch (error) {
      toast.error("فشل الحذف");
    }
  };

  // تعديل الكمية
  const handleQuantityChange = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    const token = Cookies.get("accessToken");
    if (!token) return toast.error("يجب تسجيل الدخول أولاً");

    try {
      await axios.put(
        `https://e-book-kayan.vercel.app/api/cart/${cartItemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      setCart(
        (prev) =>
          prev?.map((item) =>
            item._id === cartItemId ? { ...item, quantity: newQuantity } : item
          ) || null
      );
    } catch (error) {
      toast.error("فشل تعديل الكمية");
    }
  };

  // تطبيق البرومو كود
  const applyPromoCode = () => {
    if (!promoCode) return toast.error("ادخل كود الخصم أولاً");

    setIsApplyingPromo(true);
    const foundPromo = validPromoCodes.find(
      (p) => p.code.toUpperCase() === promoCode.toUpperCase()
    );

    if (foundPromo) {
      setDiscount(foundPromo.discount);
      toast.success(`تم تطبيق خصم ${foundPromo.discount} جنيه`);
    } else {
      setDiscount(0);
      toast.error("كود الخصم غير صالح");
    }
    setIsApplyingPromo(false);
  };

  // فاليديشن الفورم
  const validateForm = () => {
    const errors: Partial<UserDetails> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^01[0125][0-9]{8}$/;

    if (!userDetails.fullName.trim()) errors.fullName = "مطلوب";
    if (!userDetails.address.trim()) errors.address = "مطلوب";
    if (!phoneRegex.test(userDetails.phoneNumber))
      errors.phoneNumber = "رقم غير صالح";
    if (!emailRegex.test(userDetails.email))
      errors.email = "بريد إلكتروني غير صالح";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // إرسال الطلب
  const submitOrder = async () => {
    if (!validateForm()) return toast.error("صحح الأخطاء في الفورم أولاً");

    const confirmOrder = window.confirm("هل أنت متأكد من تأكيد الطلب؟");
    if (!confirmOrder) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // محاكاة API call
      toast.success("تم تأكيد الطلب بنجاح!");
    } catch (error) {
      toast.error("فشل إتمام الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  // الحسابات المالية
  const totalPrice = useMemo(
    () =>
      cart?.reduce((total, item) => total + item.price * item.quantity, 0) || 0,
    [cart]
  );
  const finalPrice = totalPrice - discount;

  return (
    <>
      <Navbar />
      <div className="mx-auto px-6 w-full flex justify-around flex-col md:flex-row gap-6">
        {/* الجزء الأيسر - المنتجات */}
        <div className="p-4 rounded-lg md:w-2/3 w-full">
          <h2 className="text-xl font-semibold mb-4">منتجاتك</h2>

          {loading ? (
            <p className="text-gray-500 text-center">جاري التحميل...</p>
          ) : cart?.length ? (
            cart.map((item) => {
              const book = books.find((b) => b._id === item.book);
              return (
                <div
                  key={item._id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-md mb-4"
                >
                  {book && (
                    <>
                      <img
                        src={book.image.url}
                        alt={book.title}
                        className="w-20 h-20 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{book.title}</h3>
                        <p className="text-gray-500">
                          السعر: {item.price} جنيه
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                item._id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="px-3 py-1 bg-gray-200 rounded"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity + 1)
                            }
                            className="px-3 py-1 bg-gray-200 rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        إزالة
                      </button>
                    </>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center">عربة التسوق فارغة</p>
          )}
        </div>

        {/* الجزء الأيمن - الفورم والدفع */}
        <div className="md:w-1/3 w-full p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">إتمام الطلب</h2>

          {/* فورم البيانات */}
          <div className="space-y-4 mb-6">
            <div>
              <input
                type="text"
                placeholder="الاسم بالكامل"
                className="w-full p-2 border rounded-md"
                value={userDetails.fullName}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, fullName: e.target.value })
                }
              />
              {formErrors.fullName && (
                <p className="text-red-500 text-sm">{formErrors.fullName}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="العنوان"
                className="w-full p-2 border rounded-md"
                value={userDetails.address}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, address: e.target.value })
                }
              />
              {formErrors.address && (
                <p className="text-red-500 text-sm">{formErrors.address}</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                placeholder="رقم الهاتف"
                className="w-full p-2 border rounded-md"
                value={userDetails.phoneNumber}
                onChange={(e) =>
                  setUserDetails({
                    ...userDetails,
                    phoneNumber: e.target.value,
                  })
                }
              />
              {formErrors.phoneNumber && (
                <p className="text-red-500 text-sm">{formErrors.phoneNumber}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="w-full p-2 border rounded-md"
                value={userDetails.email}
                onChange={(e) =>
                  setUserDetails({ ...userDetails, email: e.target.value })
                }
              />
              {formErrors.email && (
                <p className="text-red-500 text-sm">{formErrors.email}</p>
              )}
            </div>
          </div>

          {/* البرومو كود */}
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="كود الخصم"
                className="flex-1 p-2 border rounded-md"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <button
                onClick={applyPromoCode}
                disabled={isApplyingPromo}
                className="px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isApplyingPromo ? "جاري التطبيق..." : "تطبيق"}
              </button>
            </div>
          </div>

          {/* الإجماليات */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span>المجموع:</span>
              <span>{totalPrice} جنيه</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>الخصم:</span>
                <span>-{discount} جنيه</span>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <span>الإجمالي النهائي:</span>
              <span>{finalPrice} جنيه</span>
            </div>
          </div>

          {/* زر التأكيد */}
          <button
            onClick={submitOrder}
            disabled={isSubmitting}
            className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
          >
            {isSubmitting ? "جاري التأكيد..." : "تأكيد الطلب"}
          </button>
        </div>
      </div>
    </>
  );
};

export default CartPage;
