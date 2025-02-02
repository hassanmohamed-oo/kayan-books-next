import Image from "next/image";
export default function Techoffers () {
  return (
    <div id="offers" className="min-h-screen  m-8 flex flex-col items-center py-12 px-4 md:px-20">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
        عروض خاصة للمدرسين
      </h1>

      <div className="flex flex-col md:flex-row items-center bg-gray-50 shadow-lg rounded-lg overflow-hidden w-full  max-w-5xl">
        <div className="w-full sm:w-1/3 ">
          <Image
            src="/Book_on_the_Concrete_Tile.webp"
            alt="عرض خاص"
            width={2000}
            height={2000}
           
            className="object-contain  h-full"
          />
        </div>

        <div className="w-full sm:w-2/3 p-6 sm:p-8 text-right">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            خصم خاص عند شراء أكثر من نسخة!
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            إذا كنت مدرسًا وتحتاج إلى نسخ متعددة من نفس الكتاب لطلابك، سنوفر لك
            خصمًا مميزًا على الكمية. لا تفوت هذه الفرصة لتوفير المزيد!
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-600">
            <li>
              خصم يصل إلى <span className="font-bold text-blue-500">30%</span>{" "}
              عند شراء 10 نسخ أو أكثر.
            </li>
            <li>شحن مجاني عند تجاوز مبلغ 500 جنيه.</li>
            <li>إمكانية الدفع بالتقسيط.</li>
          </ul>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-4">
            <a
              href="#"
              className="text-center bg-blue-500 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              احصل على العرض الآن
            </a>
            <a
              href="#"
              className="text-center border border-blue-600 text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition"
            >
              تواصل معنا للمزيد
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 w-full max-w-3xl">
        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
          لماذا تختار عروض كيان؟
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 ">
          <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6">
            <div className="w-16 h-16 mb-4 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
              <i className="fa-solid text-3xl  fa-angle-down"></i>
            </div>
            <h4 className="font-medium text-lg text-gray-800">خصومات حصرية</h4>
            <p className="text-gray-600 mt-2">
              عروض خاصة موجهة للمدرسين لتلبية احتياجاتهم بشكل اقتصادي.
            </p>
          </div>

          <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6">
            <div className="w-16 h-16 mb-4 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
              <i className="fa-solid fa-truck-fast text-3xl"></i>
            </div>
            <h4 className="font-medium text-lg text-gray-800">شحن سريع وآمن</h4>
            <p className="text-gray-600 mt-2">
              نحافظ على وصول طلباتك بسرعة وأمان.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
