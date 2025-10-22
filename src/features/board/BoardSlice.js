import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as Api from '../../Implement/api.js'; // include .js
// then use Api.getCurrentUser(), Api.PATHS, etc.
import { http } from '../../services/http.js';


// Fetch all boards
export const fetchBoards = createAsyncThunk(
  'boards/fetchBoards',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/boards`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch boards');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch single board
export const fetchBoardById = createAsyncThunk(
  'boards/fetchBoardById',
  async (boardId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/boards/${boardId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch board');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create board
export const createBoard = createAsyncThunk(
  'boards/createBoard',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/boards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to create board');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update board
export const updateBoard = createAsyncThunk(
  'boards/updateBoard',
  async ({ boardId, updates }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/boards/${boardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to update board');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete board
export const deleteBoard = createAsyncThunk(
  'boards/deleteBoard',
  async (boardId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/boards/${boardId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Failed to delete board');
      }
      return boardId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  boards: [],
  currentBoard: null,
  isLoading: false,
  error: null,
};

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setCurrentBoard: (state, action) => {
      state.currentBoard = state.boards.find(b => b.id === action.payload) || null;
    },
    clearCurrentBoard: (state) => {
      state.currentBoard = null;
    },
    clearBoardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Boards
      .addCase(fetchBoards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Single Board
      .addCase(fetchBoardById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBoard = action.payload;
      })
      .addCase(fetchBoardById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create Board
      .addCase(createBoard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.boards.push(action.payload);
      })
      .addCase(createBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Board
      .addCase(updateBoard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.boards.findIndex(b => b.id === action.payload.id);
        if (index !== -1) state.boards[index] = action.payload;
      })
      .addCase(updateBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Board
      .addCase(deleteBoard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.boards = state.boards.filter(b => b.id !== action.payload);
        if (state.currentBoard?.id === action.payload) state.currentBoard = null;
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentBoard, clearCurrentBoard, clearBoardError } = boardSlice.actions;
export default boardSlice.reducer;
