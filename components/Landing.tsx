import Image from "next/image";
import Link from "next/link";
import { Navbar } from "./Navbar";

export const Landing = () => {
  return (
    <>
      <Navbar />
      <section className="relative  w-full min-h-screen -pt-[50px] flex flex-col lg:flex-row items-center justify-between gap-8 px-4 md:px-8 lg:px-16 py-12 overflow-hidden ">
        {/* Content Section */}
        <div className="relative z-10 lg:w-1/2  text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl  font-extrabold leading-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            روّاد التميز التعليمي مع
            <span className="block mt-2 p-2 "> "كيان"</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
            نصنع عالماً من المعرفة المبتكرة حيث يلتقي الإبداع بالأكاديمية. كتبنا
            الدراسية المصممة بخبرة تقدم تجربة تعليمية استثنائية تنمي مهارات
            الطلاب وتُسهّل فهم المناهج.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/#books"
              className="relative inline-flex items-center justify-center px-8 py-4 text-xl font-bold text-white bg-blue-600 rounded-lg transition-all transform hover:-translate-y-1 hover:shadow-xl hover:bg-blue-700"
            >
              اكتشف الكتب الآن
              <span className="ml-3 text-2xl">📚</span>
            </Link>
          </div>

          {/* Achievements Badges */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-blue-600 font-bold">+50,000</span>
              <span className="text-gray-600">طالب مستفيد</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
              <span className="text-blue-600 font-bold">98%</span>
              <span className="text-gray-600">رضا العملاء</span>
            </div>
          </div>
        </div>

        {/* Hero Image Section */}
        <div className="relative z-10 lg:w-1/2 flex justify-center items-end">
          <div className="relative w-full max-w-2xl">
            <Image
              src="/6904932.png"
              alt="طلاب يدرسون مع كتب كيان"
              width={1200}
              height={800}
              className="object-contain animate-float"
              priority
            />

            {/* Decorative Elements */}
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-indigo-100 rounded-full opacity-30 mix-blend-multiply filter blur-xl"></div>
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-blue-100 rounded-full opacity-30 mix-blend-multiply filter blur-xl"></div>
          </div>
        </div>

        {/* Scrolling Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block">
          <div className="animate-bounce w-6 h-6 border-4 border-blue-600 rounded-full"></div>
        </div>
      </section>
    </>
  );
};
