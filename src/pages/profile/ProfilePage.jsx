import React, { useRef, useState, useEffect } from "react";
import { ArrowLeft, Camera } from "lucide-react";
import NavbarComponent from "../../components/nav&footer/NavbarComponent";

export default function ProfilePage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    bio: "",
  });
  const [avatar, setAvatar] = useState(null);
  const fileRef = useRef(null);

  // ✅ Load existing user info from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      const [first, ...rest] = storedUser.name?.split(" ") || ["User"];
      setForm({
        firstName: first,
        lastName: rest.join(" ") || "",
        username: storedUser.name || "",
        email: storedUser.email || "",
        bio: storedUser.bio || "",
      });
      setAvatar(storedUser.photoURL || null);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handlePickFile = () => fileRef.current?.click();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatar(url);
  };

  // ✅ Save user profile to localStorage
  const onSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      name: `${form.firstName} ${form.lastName}`.trim() || form.username,
      email: form.email || "user@gmail.com",
      bio: form.bio,
      photoURL: avatar,
      provider: "local", // keep provider type
    };

    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Trigger global storage update (navbar updates too)
    window.dispatchEvent(new Event("storage"));

    alert("✅ Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-slate-800 dark:text-white transition-colors duration-300">
      {/* <NavbarComponent user={JSON.parse(localStorage.getItem("user"))} /> */}

      {/* HEADER */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          className="inline-flex items-center gap-2 text-slate-500 dark:text-gray-300 hover:text-slate-700"
          onClick={() => window.history.back()}
          type="button"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <h1 className="mt-4 text-2xl font-semibold">Edit Profile</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Update your personal information and profile photo.
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={onSubmit}
        className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-6"
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* PHOTO CARD */}
          <section className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={
                    avatar ||
                    "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  }
                  alt="avatar"
                  className="h-56 w-56 rounded-full object-cover ring-4 ring-orange-500"
                />
                <button
                  type="button"
                  onClick={handlePickFile}
                  className="absolute bottom-2 right-2 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm font-medium shadow ring-1 ring-slate-200 hover:bg-white"
                >
                  <Camera className="h-4 w-4" />
                  <span>Photo</span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile}
                />
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-gray-400">
                Profile Picture
              </p>
              <p className="mt-1 text-sm font-medium">
                {form.firstName} {form.lastName}
              </p>
            </div>
          </section>

          {/* INFO FORM */}
          <section className="md:col-span-2 rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field
                label="First Name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First name"
              />
              <Field
                label="Last Name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last name"
              />
              <Field
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
              />
              <Field
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Bio"
                  name="bio"
                  rows={5}
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell us a bit about you"
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                className="rounded-xl border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-gray-200 hover:bg-slate-50 dark:hover:bg-gray-600"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                Save
              </button>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}

/* Helper components */
function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-300">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-xl border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 outline-none transition placeholder:text-slate-400 dark:placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
      />
    </label>
  );
}

function Textarea({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-300">
        {label}
      </span>
      <textarea
        {...props}
        className="w-full resize-y rounded-xl border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 outline-none placeholder:text-slate-400 dark:placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
      />
    </label>
  );
}
