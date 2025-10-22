// ✅ src/services/http.js
import * as Api from "../Implement/api.js";

/* -------------------------------------------------------------------------- */
/* 🌍 BASE URL CONFIGURATION                                                  */
/* -------------------------------------------------------------------------- */
const DEV = import.meta.env.DEV;

// ✅ Always use your real backend (works for both dev & prod)
const RUNTIME_BASE =
  Api.API_BASE ??
  import.meta.env.VITE_API_BASE ??
  import.meta.env.VITE_BASE_URL ??
  "https://taskflow-api.istad.co";

// Remove trailing slash just in case
export const API_BASE = (RUNTIME_BASE || "").replace(/\/+$/, "");

/* -------------------------------------------------------------------------- */
/* 🔐 TOKEN HELPERS                                                           */
/* -------------------------------------------------------------------------- */
export const getAuthToken =
  Api.getAuthToken ??
  (() =>
    localStorage.getItem("accessToken") ||
    localStorage.getItem("auth_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    "");

/* -------------------------------------------------------------------------- */
/* ⚙️ UTILITIES                                                               */
/* -------------------------------------------------------------------------- */
const isFormOrBlob = (body) =>
  (typeof FormData !== "undefined" && body instanceof FormData) ||
  (typeof Blob !== "undefined" && body instanceof Blob);

const buildUrl = (path) => {
  if (/^https?:\/\//i.test(path)) return path; // absolute URL already
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${cleanPath}`;
};

const getCookie = (name) => {
  if (typeof document === "undefined") return "";
  const escaped = name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
};

/* -------------------------------------------------------------------------- */
/* 🧠 RESPONSE PARSER + AUTO LOGOUT ON 401                                    */
/* -------------------------------------------------------------------------- */
async function parseResponse(res) {
  if (res.status === 204) return null;

  const text = await res.text().catch(() => "");

  if (res.status === 401) {
    console.warn("🔒 Unauthorized — clearing session and redirecting to login");
    localStorage.clear();
    try {
      window.location.href = "/login";
    } catch {}
    throw { status: 401, message: "Session expired. Please log in again." };
  }

  if (!res.ok) {
    let err;
    try {
      err = text ? JSON.parse(text) : {};
    } catch {
      err = { message: text || res.statusText };
    }
    err.status = res.status;
    throw err;
  }

  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/* -------------------------------------------------------------------------- */
/* 🚀 UNIFIED HTTP FUNCTION (CORS SAFE VERSION)                               */
/* -------------------------------------------------------------------------- */
export async function http(
  path,
  { method = "GET", body, headers = {}, timeoutMs = 20000, methodOverride } = {}
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const token = getAuthToken();
    const url = buildUrl(path);
    const formLike = isFormOrBlob(body);
    const upperMethod = method.toUpperCase();

    const headerKeys = Object.keys(headers).reduce((acc, k) => {
      acc[k.toLowerCase()] = k;
      return acc;
    }, {});
    const hasContentType = Boolean(headerKeys["content-type"]);

    const defaultContentType = formLike
      ? undefined
      : upperMethod === "PATCH"
      ? "application/merge-patch+json"
      : "application/json";

    const xsrf =
      getCookie("XSRF-TOKEN") ||
      getCookie("CSRF-TOKEN") ||
      getCookie("csrftoken") ||
      getCookie("XSRF");

    const finalHeaders = {
      Accept: "application/json, application/hal+json;q=0.9",
      ...(defaultContentType && !hasContentType
        ? { "Content-Type": defaultContentType }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(xsrf ? { "X-XSRF-TOKEN": xsrf } : {}),
      ...(methodOverride
        ? { "X-HTTP-Method-Override": methodOverride.toUpperCase() }
        : {}),
      ...headers,
    };

    const finalMethod = methodOverride ? "POST" : upperMethod;
    const bodyPayload =
      body == null
        ? undefined
        : formLike
        ? body
        : typeof body === "object" &&
          (finalHeaders["Content-Type"] || "").includes("json")
        ? JSON.stringify(body)
        : body;

    // console.log(
    //   `%c🌐 [HTTP] ${finalMethod} → ${url}`,
    //   "color:#0ea5e9;font-weight:bold;",
    //   bodyPayload || "(no body)"
    // );
    if (body instanceof FormData) {
  // console.log("📎 Uploading file(s):", [...body.entries()].map(([k, v]) => v.name || v));
}


    // ✅ Special handling for file upload (FormData)
const isUpload = body instanceof FormData && path.includes("/files/upload");

const res = await fetch(url, {
  method: finalMethod,
  mode: "cors",
  credentials: "omit",
  headers: isUpload ? { Authorization: finalHeaders["Authorization"] } : finalHeaders,
  body: bodyPayload,
  signal: controller.signal,
});


    return await parseResponse(res);
  } catch (err) {
    if (err?.name === "AbortError") {
      throw { status: 0, message: "⏱️ Request timed out" };
    }

    console.error("🌐 HTTP Error:", err);
    throw {
      status: err?.status ?? 0,
      message: err?.message || "Network or CORS error",
    };
  } finally {
    clearTimeout(timer);
  }
}

/* -------------------------------------------------------------------------- */
/* 🧩 SHORTCUT METHODS                                                        */
/* -------------------------------------------------------------------------- */
http.get = (url, opts) => http(url, { ...opts, method: "GET" });
http.post = (url, body, opts) => http(url, { ...opts, method: "POST", body });
http.put = (url, body, opts) => http(url, { ...opts, method: "PUT", body });
http.patch = (url, body, opts) => http(url, { ...opts, method: "PATCH", body });
http.delete = (url, opts) => http(url, { ...opts, method: "DELETE" });

/* -------------------------------------------------------------------------- */
/* ✅ DEBUG LOG                                                               */
/* -------------------------------------------------------------------------- */
// console.log(
//   `%c✅ HTTP client initialized → ${API_BASE}`,
//   "color:#22c55e;font-weight:bold;font-size:13px;"
// );

if (API_BASE.includes("localhost")) {
  // console.warn("⚠️ Using localhost API — backend must allow CORS from http://localhost:5173");
} else {
  // console.log("🌍 Using remote TaskFlow API:", API_BASE);
}
