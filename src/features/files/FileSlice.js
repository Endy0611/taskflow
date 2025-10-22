import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as Api from '../../Implement/api.js'; // include .js
// then use Api.getCurrentUser(), Api.PATHS, etc.
import { http } from '../../services/http.js';

// Fetch all files for a board or card
export const fetchFiles = createAsyncThunk(
  'files/fetchFiles',
  async ({ parentType, parentId }, { rejectWithValue }) => {
    // parentType: 'board' or 'card'
    try {
      const res = await fetch(`${API_BASE}/${parentType}s/${parentId}/files`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch files');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Upload a new file
export const uploadFile = createAsyncThunk(
  'files/uploadFile',
  async ({ parentType, parentId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/${parentType}s/${parentId}/files`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to upload file');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a file
export const deleteFile = createAsyncThunk(
  'files/deleteFile',
  async (fileId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/files/${fileId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Failed to delete file');
      }
      return fileId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ================= Initial State ================= //

const initialState = {
  files: [],
  currentFile: null,
  isLoading: false,
  error: null,
};

// ================= Slice ================= //

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    setCurrentFile: (state, action) => {
      state.currentFile = state.files.find(f => f.id === action.payload) || null;
    },
    clearCurrentFile: (state) => {
      state.currentFile = null;
    },
    clearFileError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch files
      .addCase(fetchFiles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Upload file
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.files.push(action.payload);
      })

      // Delete file
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(f => f.id !== action.payload);
        if (state.currentFile?.id === action.payload) state.currentFile = null;
      });
  }
});

// ================= Exports ================= //

export const { setCurrentFile, clearCurrentFile, clearFileError } = fileSlice.actions;
export default fileSlice.reducer;
