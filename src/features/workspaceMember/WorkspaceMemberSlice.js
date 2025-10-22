import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as Api from '../../Implement/api.js'; // include .js
// then use Api.getCurrentUser(), Api.PATHS, etc.

const API_BASE = import.meta.env.VITE_API_BASE;


// Fetch all members of a workspace
export const fetchWorkspaceMembers = createAsyncThunk(
  'workspaceMembers/fetchWorkspaceMembers',
  async (workspaceId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/workspaces/${workspaceId}/members`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch workspace members');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add a new member to a workspace
export const addWorkspaceMember = createAsyncThunk(
  'workspaceMembers/addWorkspaceMember',
  async ({ workspaceId, memberData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/workspaces/${workspaceId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to add member');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update a member's role or info
export const updateWorkspaceMember = createAsyncThunk(
  'workspaceMembers/updateWorkspaceMember',
  async ({ workspaceId, memberId, updates }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/workspaces/${workspaceId}/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to update member');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Remove a member from a workspace
export const removeWorkspaceMember = createAsyncThunk(
  'workspaceMembers/removeWorkspaceMember',
  async ({ workspaceId, memberId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/workspaces/${workspaceId}/members/${memberId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Failed to remove member');
      }
      return memberId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ================= Initial State ================= //

const initialState = {
  members: [],
  isLoading: false,
  error: null,
};

// ================= Slice ================= //

const workspaceMemberSlice = createSlice({
  name: 'workspaceMembers',
  initialState,
  reducers: {
    clearWorkspaceMemberError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch members
      .addCase(fetchWorkspaceMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaceMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members = action.payload;
      })
      .addCase(fetchWorkspaceMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add member
      .addCase(addWorkspaceMember.fulfilled, (state, action) => {
        state.members.push(action.payload);
      })

      // Update member
      .addCase(updateWorkspaceMember.fulfilled, (state, action) => {
        const index = state.members.findIndex(m => m.id === action.payload.id);
        if (index !== -1) state.members[index] = action.payload;
      })

      // Remove member
      .addCase(removeWorkspaceMember.fulfilled, (state, action) => {
        state.members = state.members.filter(m => m.id !== action.payload);
      });
  },
});

// ================= Exports ================= //

export const { clearWorkspaceMemberError } = workspaceMemberSlice.actions;
export default workspaceMemberSlice.reducer;
