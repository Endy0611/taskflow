import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as Api from '../../Implement/api.js'; // include .js
// then use Api.getCurrentUser(), Api.PATHS, etc.
import { http } from '../../services/http.js';

// Fetch tasks by workspace or board
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async ({ workspaceId, boardId }, { rejectWithValue }) => {
    try {
      const url = boardId
        ? `${API_BASE}/boards/${boardId}/tasks`
        : `${API_BASE}/workspaces/${workspaceId}/tasks`;
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch tasks');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a new task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async ({ parentType, parentId, taskData }, { rejectWithValue }) => {
    try {
      const url = `${API_BASE}/${parentType}s/${parentId}/tasks`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to create task');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update a task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, updates }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to update task');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Failed to delete task');
      }
      return taskId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ================= Initial State ================= //

const initialState = {
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
    assignedTo: null,
    searchQuery: '',
    labels: [],
  },
};

// ================= Slice ================= //

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCurrentTask: (state, action) => {
      state.currentTask = state.tasks.find(t => t.id === action.payload) || null;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearTaskError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })

      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.tasks[index] = action.payload;
      })

      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
        if (state.currentTask?.id === action.payload) state.currentTask = null;
      });
  }
});

// ================= Exports ================= //

export const { setCurrentTask, clearCurrentTask, setFilters, clearFilters, clearTaskError } = taskSlice.actions;
export default taskSlice.reducer;
