import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as Api from '../../Implement/api.js'; // include .js
// then use Api.getCurrentUser(), Api.PATHS, etc.
import { http } from '../../services/http.js';

// Fetch all workspaces for a user
export const fetchWorkspaces = createAsyncThunk(
  'workspace/fetchWorkspaces',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/users/${userId}/workspaces`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch workspaces');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch single workspace by ID
export const fetchWorkspaceById = createAsyncThunk(
  'workspace/fetchWorkspaceById',
  async (workspaceId, { rejectWithValue }) => {
    try {
      const res = await fetch(`https://taskflow-api.istad.co/workspaces/30`);
      const data = await res.json();
      console.log("workspace data from slice:", data);
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch workspace');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a workspace
export const createWorkspace = createAsyncThunk(
  'workspace/createWorkspace',
  async (workspaceData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/workspaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workspaceData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to create workspace');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update workspace
export const updateWorkspace = createAsyncThunk(
  'workspace/updateWorkspace',
  async ({ workspaceId, updates }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/workspaces/${workspaceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to update workspace');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete workspace
export const deleteWorkspace = createAsyncThunk(
  'workspace/deleteWorkspace',
  async (workspaceId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/workspaces/${workspaceId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Failed to delete workspace');
      }
      return workspaceId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ================= Initial State ================= //

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,
};

// ================= Slice ================= //

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = state.workspaces.find(w => w.id === action.payload) || null;
    },
    clearCurrentWorkspace: (state) => {
      state.currentWorkspace = null;
    },
    clearWorkspaceError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchWorkspaces.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workspaces = action.payload;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch single
      .addCase(fetchWorkspaceById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaceById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentWorkspace = action.payload;
      })
      .addCase(fetchWorkspaceById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.workspaces.push(action.payload);
      })

      // Update
      .addCase(updateWorkspace.fulfilled, (state, action) => {
        const index = state.workspaces.findIndex(w => w.id === action.payload.id);
        if (index !== -1) state.workspaces[index] = action.payload;
      })

      // Delete
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.workspaces = state.workspaces.filter(w => w.id !== action.payload);
        if (state.currentWorkspace?.id === action.payload) state.currentWorkspace = null;
      });
  }
});

// ================= Exports ================= //

export const { setCurrentWorkspace, clearCurrentWorkspace, clearWorkspaceError } = workspaceSlice.actions;
export default workspaceSlice.reducer;
