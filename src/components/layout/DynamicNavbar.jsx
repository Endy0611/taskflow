import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../Implement/firebase/firebase-config";
import NavbarComponent from "../nav&footer/NavbarComponent";

export default function DynamicNavbar({
  darkMode,
  toggleDarkMode,
  sidebarOpen,
  setSidebarOpen,
  setShowModal,
}) {
  const [user, setUser] = useState(null);

  /* ---------------- Detect Firebase & Manual Login ---------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          name:
            firebaseUser.displayName ||
            firebaseUser.email?.split("@")[0] ||
            "User",
          email:
            firebaseUser.email && firebaseUser.email.includes("@")
              ? firebaseUser.email
              : `${firebaseUser.displayName || "user"}@gmail.com`,
          photoURL: firebaseUser.photoURL || null,
          provider:
            firebaseUser.providerData?.[0]?.providerId || "firebase",
        };

        localStorage.setItem("user", JSON.stringify(userData));
        window.dispatchEvent(new Event("userLoggedIn"));
        setUser(userData);
      } else {
        // manual/API login fallback
        const stored = localStorage.getItem("user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const fixed = {
              name:
                parsed.name ||
                parsed.username ||
                parsed.displayName ||
                parsed.email?.split("@")[0] ||
                "User",
              email: parsed.email || parsed.username || "unknown@user.com",
              photoURL: parsed.photoURL || null,
            };
            setUser(fixed);
            window.dispatchEvent(new Event("userLoggedIn"));
          } catch {
            setUser(null);
            window.dispatchEvent(new Event("userLoggedOut"));
          }
        } else {
          setUser(null);
          window.dispatchEvent(new Event("userLoggedOut"));
        }
      }
    });

    const handleStorageChange = () => {
      const updated = localStorage.getItem("user");
      if (updated) {
        setUser(JSON.parse(updated));
        window.dispatchEvent(new Event("userLoggedIn"));
      } else {
        setUser(null);
        window.dispatchEvent(new Event("userLoggedOut"));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      unsub();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  /* ---------------- Logout Handling ---------------- */
  const handleLogout = async () => {
    try {
      await signOut(auth); // harmless for API users
    } catch (err) {
      console.warn("Firebase logout ignored:", err);
    }

    [
      "user",
      "username",
      "accessToken",
      "auth_token",
      "refresh_token",
      "user_id",
      "current_workspace_id",
      "current_workspace_name",
      "current_workspace_theme",
      "last_workspace",
    ].forEach((key) => localStorage.removeItem(key));

    window.dispatchEvent(new Event("userLoggedOut"));
    window.location.href = "/"; // redirect to home/login
  };

  /* ---------------- Profile Update Sync ---------------- */
  useEffect(() => {
    const syncProfile = () => {
      const updated = localStorage.getItem("user");
      if (updated) setUser(JSON.parse(updated));
    };
    window.addEventListener("profile-updated", syncProfile);
    return () => window.removeEventListener("profile-updated", syncProfile);
  }, []);

  /* ---------------- Render ---------------- */
  return (
    <NavbarComponent
      user={user}
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      setSidebarOpen={setSidebarOpen}
      setShowModal={setShowModal}
      onLogout={handleLogout}
    />
  );
}
