import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Mock user data
let mockUsers = [
  {
    createdAt: "2025-09-16T03:44:12.657784",
    lastModifiedAt: "2025-09-16T03:44:12.657784",
    createdBy: "taskflow",
    lastModifiedBy: "taskflow",
    username: "tithcholna",
    email: "tithcholna742@gmail.com",
    familyName: "tith",
    givenName: "cholna",
    gender: "Female",
    isDeleted: false,
    password: "password123", // For dev only
    _links: {
      self: { href: "https://taskflow-api.istad.co/users/tithcholna" },
      role: { href: "https://taskflow-api.istad.co/users/tithcholna/role" },
      workspaceMembers: {
        href: "https://taskflow-api.istad.co/users/tithcholna/workspaceMembers",
      },
    },
  },
  {
    createdAt: "2025-09-13T03:55:12.813159",
    lastModifiedAt: "2025-09-13T03:55:12.813159",
    createdBy: "taskflow",
    lastModifiedBy: "taskflow",
    username: "sreynet",
    email: "monsreynet2409@example.com",
    familyName: "Mon",
    givenName: "Sreynet",
    gender: "Female",
    isDeleted: false,
    password: "password123",
    _links: {
      self: { href: "https://taskflow-api.istad.co/users/sreynet" },
      role: { href: "https://taskflow-api.istad.co/users/sreynet/role" },
      workspaceMembers: {
        href: "https://taskflow-api.istad.co/users/sreynet/workspaceMembers",
      },
    },
  },
];

export const loginUser = createAsyncThunk(
  "/auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = mockUsers.find((u) => u.email === email);

      if (!user || user.password !== password) {
        throw new Error("Invalid credentials");
      }

      // Exclude password from response
      const { password: _, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        accessToken: `mock-jwt-${user.username}`,
        refreshToken: `mock-refresh-${user.username}`,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (
        mockUsers.find(
          (u) => u.email === userData.email || u.username === userData.username
        )
      ) {
        throw new Error("User already exists");
      }

      const newUser = {
        ...userData,
        createdAt: new Date().toISOString(),
        lastModifiedAt: new Date().toISOString(),
        createdBy: "taskflow",
        lastModifiedBy: "taskflow",
        isDeleted: false,
        _links: {
          self: { href: `https://taskflow-api.istad.co/users/${userData.username}` },
          role: { href: `https://taskflow-api.istad.co/users/${userData.username}/role` },
          workspaceMembers: {
            href: `https://taskflow-api.istad.co/users/${userData.username}/workspaceMembers`,
          },
        },
      };

      // Save user (with password for login simulation)
      mockUsers.push(newUser);

      // Exclude password when returning
      const { password: _, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

// 🔹 Initial state
const initialState = {
  user: null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading: false,
  error: null,
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  lastLogin: null,
  registrationSuccess: false,
};

// 🔹 Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
      state.lastLogin = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.lastLogin = new Date().toISOString();
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.registrationSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.registrationSuccess = false;
      });
  },
});

export const { logout, updateUser, clearError, clearRegistrationSuccess } =
  authSlice.actions;

export default authSlice.reducer;
