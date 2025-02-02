import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { Exam, Question, User, newExam } from "@/constants";
import "react-toastify/dist/ReactToastify.css";

export  const Examscontrol = () => {

  const [exams, setExams] = useState<Exam[]>([]);
  const [thisExamQuestionsID, setThisExamQuestionsID] = useState<string[]>([]);
  const [thisExamQuestions, setThisExamQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showExamForm, setShowExamForm] = useState<boolean>(false);
  const [newExam, setNewExam] = useState<newExam>({
    _id: "",
    title: "",
    duration: 0,
    questions: [],
  });
  const [newQuestion, setNewQuestion] = useState<Question>({
    id: "",
    text: "",
    options: ["", "", "", ""],
    correctOption: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedExamId, setExpandedExamId] = useState<string | null>(null);
 

  


  const fetchExams = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      let allExams: Exam[] = [];
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
      setLoading(false);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      let allQuestions: Question[] = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const response = await axios.get(
          `https://e-book-kayan.vercel.app/api/questions?page=${currentPage}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        allQuestions = [...allQuestions, ...response.data.questions];
        totalPages = response.data.totalPages;
        currentPage++;
      } while (currentPage <= totalPages);
      setQuestions(allQuestions);
    } catch (error: any) {
      console.error(
        "Error fetching all questions:",
        error.response?.data || error.message
      );
      toast.error("فشل في جلب الأسئلة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchQuestions();
  }, []);

  const addQuestion = async () => {
    if (
      !newQuestion.text ||
      newQuestion.options.some((answer) => !answer) ||
      newQuestion.correctOption === null
    ) {
      toast.warning("يرجى ملء جميع الحقول وتحديد الإجابة الصحيحة.");
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        "https://e-book-kayan.vercel.app/api/questions",
        newQuestion,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setNewQuestion({
        id: "",
        text: "",
        options: ["", "", "", ""],
        correctOption: 0,
      });
      setThisExamQuestionsID([
        ...thisExamQuestionsID,
        response.data.question.id,
      ]);
      setThisExamQuestions([...thisExamQuestions, response.data.question]);
      setQuestions([...questions, response.data.question]);
      toast.success("تم إضافة السؤال بنجاح!");
    } catch (error: any) {
      console.error(
        "Error adding question:",
        error.response?.data || error.message
      );
      toast.error("فشل في إضافة السؤال");
    } finally {
      setLoading(false);
    }
  };

  const addExam = async () => {
    if (
      !newExam.title ||
      isNaN(newExam.duration) ||
      newExam.duration <= 0 ||
      thisExamQuestionsID.length === 0
    ) {
      toast.warning("يرجى ملء جميع الحقول وإضافة أسئلة للامتحان.");
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      newExam.questions = thisExamQuestionsID;
      const response = await axios.post(
        "https://e-book-kayan.vercel.app/api/exams",
        newExam,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      await fetchExams();
      await fetchQuestions();

      setShowExamForm(false);
      setNewExam({
        _id: "",
        title: "",
        duration: 0,
        questions: [],
      });
      setThisExamQuestionsID([]);
      setThisExamQuestions([]);

      toast.success("تم إضافة الامتحان بنجاح!");
    } catch (error: any) {
      console.error(
        "Error adding exam:",
        error.response?.data || error.message
      );
      toast.error("فشل في إضافة الامتحان");
    } finally {
      setLoading(false);
    }
  };

  const deleteExam = async (examId: string) => {
    const isConfirmed = window.confirm(
      "هل أنت متأكد أنك تريد حذف هذا الامتحان؟"
    );
    if (!isConfirmed) return;

    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      await axios.delete(
        `https://e-book-kayan.vercel.app/api/exams/${examId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      await fetchExams();
      toast.success("تم حذف الامتحان بنجاح!");
    } catch (error: any) {
      console.error(
        "Error deleting exam:",
        error.response?.data || error.message
      );
      toast.error("فشل في حذف الامتحان");
    } finally {
      setLoading(false);
    }
  };

  const toggleExamQuestions = (examId: string) => {
    setExpandedExamId(expandedExamId === examId ? null : examId);
  };

  return (
    <>
      <ToastContainer />

      <div className=" md:p-6 ">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          إدارة الامتحانات
        </h2>
        <button
          onClick={() => setShowExamForm(!showExamForm)}
          className="bg-green-500 text-white px-4 py-2 rounded mb-8 disabled:opacity-50"
          disabled={loading}
        >
          {showExamForm ? "إخفاء النموذج" : "إضافة امتحان جديد"}
        </button>

        {showExamForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              إضافة امتحان جديد
            </h2>
            <input
              type="text"
              placeholder="عنوان الامتحان"
              value={newExam.title}
              onChange={(e) =>
                setNewExam({ ...newExam, title: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
              disabled={loading}
            />
            <input
              type="number"
              placeholder="مدة الامتحان"
              onChange={(e) =>
                setNewExam({
                  ...newExam,
                  duration: parseInt(e.target.value),
                })
              }
              className="w-full p-2 border rounded mb-2"
              disabled={loading}
            />

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">{`إضافة سؤال ${
                thisExamQuestionsID.length + 1
              }`}</h3>
              <input
                type="text"
                placeholder="السؤال"
                value={newQuestion.text}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    text: e.target.value,
                  })
                }
                className="w-full p-2 border rounded mb-2"
                disabled={loading}
              />
              {newQuestion.options.map((answer, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`الإجابة ${index + 1}`}
                  value={answer}
                  onChange={(e) => {
                    const newAnswers = [...newQuestion.options];
                    newAnswers[index] = e.target.value;
                    setNewQuestion({
                      ...newQuestion,
                      options: newAnswers,
                    });
                  }}
                  className="w-full p-2 border rounded mb-2"
                  disabled={loading}
                />
              ))}
              <select
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    correctOption: parseInt(e.target.value),
                  })
                }
                className="w-full p-2 border rounded mb-2"
                disabled={loading}
              >
                {newQuestion.options.map((_, index) => (
                  <option key={index} value={index}>
                    الإجابة الصحيحة {index + 1}
                  </option>
                ))}
              </select>
              <button
                onClick={addQuestion}
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "جاري الإضافة..." : "إضافة السؤال"}
              </button>
            </div>

            <button
              onClick={addExam}
              className="bg-green-500 text-white px-4 py-2 rounded mt-4 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "جاري الإضافة..." : "تأكيد إضافة الامتحان"}
            </button>
          </div>
        )}

        <div className="overflow-x-auto bg-white bg-opacity-50 md:p-4 rounded-lg shadow-md">
          
          {loading ? (
            <p>جاري التحميل...</p>
          ) : (
            exams.map((exam, index) => (
              <div key={exam._id} className="mb-4 p-4 hover:bg-gray-50  rounded">
                <div className="flex justify-between md:flex-row flex-col items-center">
                  <h3 className="text-xl font-semibold">
                    {index + 1}. {exam.title}
                  </h3>
                  <p>المدة: {exam.duration} دقيقة</p>
                  <div >
                    <button
                      onClick={() => toggleExamQuestions(exam._id)}
                      className="bg-blue-500 text-white mx-2 px-4 py-2 rounded mr-2 disabled:opacity-50"
                      disabled={loading}
                    >
                      {expandedExamId === exam._id
                        ? "إخفاء الأسئلة"
                        : "عرض الأسئلة"}
                    </button>
                    <button
                      onClick={() => deleteExam(exam._id)}
                      className="bg-red-500 mx-2 text-white px-4 py-2 rounded disabled:opacity-50"
                      disabled={loading}
                    >
                      حذف
                    </button>
                  </div>
                </div>
                
                {expandedExamId === exam._id && (
                  <div className="mt-2">
                    <h4 className="text-lg font-semibold">الأسئلة:</h4>
                    {exam.questions.map((question, qIndex) => {
                      return (
                        question && (
                          <div
                            key={qIndex}
                            className="mb-2 p-2 bg-white rounded"
                          >
                            <p>
                              <strong>السؤال {qIndex + 1}:</strong>{" "}
                              {question.text}
                            </p>
                            <ul className="list-disc list-inside">
                              {question.options.map(
                                (
                                  answer:
                                    | string
                                    | number
                                    | bigint
                                    | boolean
                                    | React.ReactElement<
                                        any,
                                        | string
                                        | React.JSXElementConstructor<any>
                                      >
                                    | Iterable<React.ReactNode>
                                    | React.ReactPortal
                                    | Promise<React.AwaitedReactNode>
                                    | null
                                    | undefined,
                                  aIndex: React.Key | null | undefined
                                ) => (
                                  <li
                                    key={aIndex}
                                    className={`${
                                      aIndex === question.correctOption
                                        ? "text-green-600"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {answer}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};


