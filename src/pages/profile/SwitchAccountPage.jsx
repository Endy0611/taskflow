import React, { useEffect, useState } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SwitchAccount() {
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  // Load saved accounts from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("accounts") || "[]");
    setAccounts(saved);
  }, []);

  const handleSwitch = (account) => {
    localStorage.setItem("user", JSON.stringify(account));
    window.dispatchEvent(new Event("storage"));
    navigate("/homeuser");
  };

  const handleAddAccount = () => {
    navigate("/login"); // Redirect to login page to add another account
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-slate-800 dark:text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>

        <h1 className="mt-6 text-2xl font-semibold">Switch Account</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Choose another account to continue using TaskFlow.
        </p>

        {/* Accounts List */}
        <div className="mt-10 flex flex-col items-center">
          {accounts.length === 0 ? (
            <p className="text-slate-400 text-sm mb-6">
              No saved accounts yet.
            </p>
          ) : (
            <div className="grid gap-4 sm:w-96">
              {accounts.map((acc, i) => (
                <button
                  key={i}
                  onClick={() => handleSwitch(acc)}
                  className="flex items-center gap-4 w-full rounded-xl border border-slate-300 dark:border-gray-700 p-3 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
                >
                  <img
                    src={
                      acc.photoURL ||
                      `https://ui-avatars.com/api/?name=${acc.name}&background=0D8ABC&color=fff`
                    }
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="font-semibold">{acc.name}</p>
                    <p className="text-sm text-slate-500 dark:text-gray-400">
                      {acc.email}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Add account */}
          <button
            onClick={handleAddAccount}
            className="mt-10 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-5 py-2.5 rounded-lg shadow"
          >
            <UserPlus className="w-5 h-5" />
            Add another account
          </button>
        </div>
      </div>
    </div>
  );
}
