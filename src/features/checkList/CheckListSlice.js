import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as Api from '../../Implement/api.js'; // include .js
// then use Api.getCurrentUser(), Api.PATHS, etc.
import { http } from '../../services/http.js';


// Fetch all checklists for a card
export const fetchChecklists = createAsyncThunk(
  'checklists/fetchChecklists',
  async (cardId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/cards/${cardId}/checklists`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch checklists');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a new checklist
export const createChecklist = createAsyncThunk(
  'checklists/createChecklist',
  async ({ cardId, checklistData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/cards/${cardId}/checklists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checklistData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to create checklist');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update a checklist
export const updateChecklist = createAsyncThunk(
  'checklists/updateChecklist',
  async ({ checklistId, updates }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/checklists/${checklistId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to update checklist');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a checklist
export const deleteChecklist = createAsyncThunk(
  'checklists/deleteChecklist',
  async (checklistId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/checklists/${checklistId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Failed to delete checklist');
      }
      return checklistId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ================= Initial State ================= //

const initialState = {
  checklists: [],
  currentChecklist: null,
  isLoading: false,
  error: null,
};

// ================= Slice ================= //

const checkListSlice = createSlice({
  name: 'checklists',
  initialState,
  reducers: {
    setCurrentChecklist: (state, action) => {
      state.currentChecklist = state.checklists.find(c => c.id === action.payload) || null;
    },
    clearCurrentChecklist: (state) => {
      state.currentChecklist = null;
    },
    clearChecklistError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch checklists
      .addCase(fetchChecklists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChecklists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.checklists = action.payload;
      })
      .addCase(fetchChecklists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create checklist
      .addCase(createChecklist.fulfilled, (state, action) => {
        state.checklists.push(action.payload);
      })

      // Update checklist
      .addCase(updateChecklist.fulfilled, (state, action) => {
        const index = state.checklists.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.checklists[index] = action.payload;
      })

      // Delete checklist
      .addCase(deleteChecklist.fulfilled, (state, action) => {
        state.checklists = state.checklists.filter(c => c.id !== action.payload);
        if (state.currentChecklist?.id === action.payload) state.currentChecklist = null;
      });
  }
});

// ================= Exports ================= //

export const { setCurrentChecklist, clearCurrentChecklist, clearChecklistError } = checkListSlice.actions;
export default checkListSlice.reducer;
