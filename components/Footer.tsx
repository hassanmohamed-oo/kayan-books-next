export function Footer() {
  return (
    <footer id="contact" className="bg-gray-900 text-gray-100 pt-8 pb-2">
      <div className="container mx-auto px-6 lg:px-20 flex flex-col md:flex-row justify-between items-start md:items-center text-right space-y-8 md:space-y-0">
        {/* القسم الأول: شعار الموقع والوصف */}
        <div className="md:w-1/3 space-y-4">
          <h2 className="text-2xl font-bold">كيان</h2>
          <p className="text-gray-400 text-sm leading-6">
            منصة تعليمية تهدف إلى توفير أفضل الموارد والمحتويات التعليمية للطلاب
            والمعلمين لتحقيق التفوق الدراسي.
          </p>
        </div>

        {/* القسم الثالث: وسائل التواصل الاجتماعي */}
        <div className="md:w-1/3">
          <h3 className="text-lg font-semibold mb-4">تابعنا</h3>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition text-2xl"
              aria-label="فيسبوك"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition text-2xl"
              aria-label="واتساب"
            >
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>

      {/* حقوق الملكية */}
      <div className="border-t border-gray-700 mt-8 pt-4  flex flex-col  gap-2   self-end text-center text-sm text-gray-500">
        <p>© 2024 كيان. جميع الحقوق محفوظة.</p>
        <p>
          Developed by
          <a
            href="https://linktr.ee/hassanmuhamed"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 ml-1 hover:text-white transition"
          >
            Hassan
          </a>
        </p>
      </div>
    </footer>
  );
}
