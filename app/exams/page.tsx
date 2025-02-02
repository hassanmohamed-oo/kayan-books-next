"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { Navbar } from "@/components";
import React, { useState, useEffect, useCallback } from "react";
import { Exam, Question } from "@/constants";
import { toast, ToastContainer } from "react-toastify";
import { CheckCircle, Clock, AlertCircle } from "react-feather";

type SelectedAnswers = {
  question: string;
  selectedOption: number | null;
};

interface Attempt {
  _id: string;
  exam: {
    _id: string;
    title: string;
  } | null; // السماح بقيم null
  score: number;
  submittedAt: string;
}

const ExamPage = () => {
  const [currentPage, setCurrentPage] = useState<
    "exams" | "instructions" | "exam" | "result"
  >("exams");
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isExamCompleted = useCallback(
    (examId: string) =>
      attempts.some(
        (attempt) => attempt.exam?._id === examId // استخدام optional chaining
      ),
    [attempts]
  );

    const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        toast.error("يجب تسجيل الدخول أولاً");
        return;
      }

      const [examsResponse, attemptsResponse] = await Promise.all([
        axios.get("https://e-book-kayan.vercel.app/api/exams", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
        axios
          .get("https://e-book-kayan.vercel.app/api/attempts", {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          })
          .catch(() => ({ data: { attempts: [] } })),
      ]);

      setExams(examsResponse.data?.exams || []);
      setAttempts(attemptsResponse.data?.attempts || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleExamSelect = (exam: Exam) => {
    if (isExamCompleted(exam._id)) {
      toast.error("لقد أكملت هذا الامتحان بالفعل");
      return;
    }
    setSelectedExam(exam);
    setCurrentPage("instructions");
    setTimeLeft(exam.duration * 60);
    setSelectedAnswers([]);
    setCurrentQuestion(0);
    setScore(0);
  };

  const startExam = () => setCurrentPage("exam");
  // Answer selection
  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => [
      ...prev.filter((ans) => ans.question !== questionId),
      { question: questionId, selectedOption: optionIndex },
    ]);
  };

  // Submit exam
  const submitExam = async () => {
    if (!selectedExam) return;
    setIsSubmitting(true);

    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        toast.error("يجب تسجيل الدخول أولاً");
        return;
      }

      const totalScore = selectedExam.questions.reduce((acc, question) => {
        const selected = selectedAnswers.find(
          (ans) => ans.question === question.id
        );
        return (
          acc + (selected?.selectedOption === question.correctOption ? 1 : 0)
        );
      }, 0);

      await axios.post(
        "https://e-book-kayan.vercel.app/api/attempts/submit",
        { id: selectedExam._id, answers: selectedAnswers },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );

      setScore(totalScore);
      setCurrentPage("result");
      fetchData();
    } catch (error) {
      toast.error("فشل في تسليم الامتحان");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Timer management
  useEffect(() => {
    if (currentPage !== "exam" || timeLeft <= 0) return;

    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [currentPage, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && currentPage === "exam") submitExam();
  }, [timeLeft, currentPage]);

  // Helper functions
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const calculatePercentage = () =>
    Math.round((score / (selectedExam?.questions.length || 1)) * 100);

  return (
    <div className="min-h-screen ">
      <Navbar />
      <ToastContainer />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* قائمة الامتحانات */}
        {currentPage === "exams" && (
          <section className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
              الامتحانات المتاحة
            </h1>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500" />
              </div>
            ) : exams.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 text-lg">
                  لا توجد امتحانات متاحة حالياً
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {exams.map((exam) => (
                  <article
                    key={exam._id}
                    onClick={() => handleExamSelect(exam)}
                    className={`p-6 rounded-xl shadow-lg transition-all cursor-pointer
                      ${
                        isExamCompleted(exam._id)
                          ? "bg-gray-100 opacity-75 cursor-not-allowed"
                          : "bg-white hover:shadow-xl"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {exam.title}
                      </h3>
                      {isExamCompleted(exam._id) && (
                        <CheckCircle className="text-green-500 w-6 h-6" />
                      )}
                    </div>
                    <div className="flex items-center text-gray-600 space-x-4">
                      <Clock className="w-5 h-5" />
                      <span>المدة: {exam.duration} دقيقة</span>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* المحاولات السابقة */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                المحاولات السابقة
              </h2>
              {attempts.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-600">لا توجد محاولات سابقة</p>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow">
                  {attempts.map((attempt) => (
                    <div
                      key={attempt._id}
                      className="p-4 border-b last:border-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {attempt.exam?.title || "امتحان محذوف"} 
                          </h3>
                          <time className="text-sm text-gray-500">
                            {new Date(attempt.submittedAt).toLocaleDateString(
                              "ar-EG"
                            )}
                          </time>
                        </div>
                        <span className="text-blue-600 font-semibold">
                          {attempt.score} درجة
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </section>
        )}

      {/* Instructions Page */}
        {currentPage === "instructions" && selectedExam && (
          <section className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
              تعليمات الامتحان
            </h1>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <ul className="space-y-4 text-right text-gray-700 mb-8">
                <li className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span>مدة الامتحان: {selectedExam.duration} دقيقة</span>
                </li>
                <li className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                  <span>لا يمكنك الرجوع بعد إنهاء الامتحان</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span>الإجابات النهائية لا يمكن تعديلها</span>
                </li>
              </ul>

              <button
                onClick={startExam}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg
                  hover:bg-blue-700 transition-colors font-medium"
              >
                بدء الامتحان
              </button>
            </div>
          </section>
        )}

        {/* Exam Page */}
        {currentPage === "exam" && selectedExam && (
          <section className="space-y-6">
            <header className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
              <div className="text-xl font-medium text-red-600">
                ⏳ الوقت المتبقي: {formatTime(timeLeft)}
              </div>
              <div className="text-gray-600">
                السؤال {currentQuestion + 1} من {selectedExam.questions.length}
              </div>
            </header>

            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-2xl font-medium mb-6">
                {selectedExam.questions[currentQuestion].text}
              </h2>

              <ul className="space-y-3">
                {selectedExam.questions[currentQuestion].options.map(
                  (option, index) => {
                    const isSelected = selectedAnswers.some(
                      (ans) =>
                        ans.question ===
                          selectedExam.questions[currentQuestion].id &&
                        ans.selectedOption === index
                    );

                    return (
                      <li
                        key={index}
                        onClick={() =>
                          handleAnswerSelect(
                            selectedExam.questions[currentQuestion].id,
                            index
                          )
                        }
                        className={`p-4 rounded-lg border cursor-pointer transition-colors
                        ${
                          isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {option}
                      </li>
                    );
                  }
                )}
              </ul>
            </div>

            <div className="flex justify-end gap-4">
              {currentQuestion > 0 && (
                <button
                  onClick={() => setCurrentQuestion((prev) => prev - 1)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg
                    hover:bg-gray-200 transition-colors"
                >
                  السابق
                </button>
              )}

              {currentQuestion < selectedExam.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestion((prev) => prev + 1)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg
                    hover:bg-blue-700 transition-colors"
                >
                  التالي
                </button>
              ) : (
                <button
                  onClick={submitExam}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg
                    hover:bg-green-700 transition-colors disabled:opacity-75"
                >
                  {isSubmitting ? "جاري التصحيح..." : "إنهاء الامتحان"}
                </button>
              )}
            </div>
          </section>
        )}

        {/* Results Page */}
        {currentPage === "result" && selectedExam && (
          <section className="bg-white p-6 rounded-xl shadow">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
              نتائج امتحان {selectedExam.title}
            </h1>

            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {score}/{selectedExam.questions.length}
              </div>
              <div className="text-xl font-medium text-gray-600">
                نسبة النجاح: {calculatePercentage()}%
              </div>
            </div>

            <div className="space-y-6">
              {selectedExam.questions.map((q, index) => {
                const userAnswer = selectedAnswers.find(
                  (ans) => ans.question === q.id
                );
                const isCorrect =
                  userAnswer?.selectedOption === q.correctOption;

                return (
                  <article
                    key={q.id}
                    className={`p-4 rounded-lg border-2 ${
                      isCorrect
                        ? "border-green-100 bg-green-50"
                        : "border-red-100 bg-red-50"
                    }`}
                  >
                    <h3 className="font-medium text-lg mb-3">
                      السؤال {index + 1}: {q.text}
                    </h3>

                    <div className="space-y-2">
                      <div className="text-gray-600">
                        <span className="font-medium">إجابتك:</span>{" "}
                        {userAnswer
                          ? q.options[userAnswer.selectedOption!]
                          : "لم تتم الإجابة"}
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">الإجابة الصحيحة:</span>{" "}
                        {q.options[q.correctOption]}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage("exams")}
              className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg
                hover:bg-blue-700 transition-colors font-medium"
            >
              العودة إلى قائمة الامتحانات
            </button>
          </section>
        )}   </main>
    </div>
  );
};

export default ExamPage;