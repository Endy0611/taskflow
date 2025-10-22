import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as Api from '../../Implement/api.js'; // include .js
// then use Api.getCurrentUser(), Api.PATHS, etc.
import { http } from '../../services/http.js';

// Fetch a user profile by ID
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/users/${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch profile');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update user profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async ({ userId, updates }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to update profile');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ================= Initial State ================= //

const initialState = {
  profile: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
};

// ================= Slice ================= //

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
      state.lastUpdated = null;
    },
    clearProfileError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

// ================= Exports ================= //

export const { clearProfile, clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
