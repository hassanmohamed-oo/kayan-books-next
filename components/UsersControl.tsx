// components/UsersControl.tsx
"use client";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export const UsersControl = ({
  users,
  onRefresh,
}: {
  users: any[];
  onRefresh: () => void;
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState("");

  const handleRoleUpdate = async (userId: string) => {
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.put(
        `https://e-book-kayan.vercel.app/api/users/${userId}`,
        {

            _id: userId,
             role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
    

      
      onRefresh();
    } catch (error) {
      toast.error("فشل في تحديث الصلاحية");
      console.error("Error updating role:", error );
    } finally {
      setEditingId(null);
    }
  };
  const handleDeleteAccount = async (userId: string) => {
    try {
      const token = Cookies.get("accessToken");
      if (!window.confirm("هل انت متأكد من انك تريد حذف هذا الحساب")) return;
      toast.warn("جاري حذف الحساب...");
      await axios.delete(
        `https://e-book-kayan.vercel.app/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success("تم حذف الحساب بنجاح");
      onRefresh();
    } catch (error) {
      toast.error("فشل في حذف الحساب");
    }
  };

  return (
    <div className=" md:p-6 ">
      <h2 className="text-2xl font-bold mb-4">إدارة المستخدمين</h2>
      <div className="space-y-4 bg-white bg-opacity-50 rounded-lg">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between  p-4 rounded-lg"
          >
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <div className="flex items-center gap-2">
              {editingId === user._id ? (
                <>
                  <select
                    className="p-2 border rounded"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                  <button
                    onClick={() => handleRoleUpdate(user._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    حفظ
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={`px-2 py-1 rounded ${
                      user.role === "admin"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                  <button
                    onClick={() => {
                      setEditingId(user._id);
                      setNewRole(user.role);
                    }}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDeleteAccount(user._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    حذف
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
