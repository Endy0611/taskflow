import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as Api from '../../Implement/api.js'; // include .js
// then use Api.getCurrentUser(), Api.PATHS, etc.
import { http } from '../../services/http.js';
// Fetch all cards for a board
export const fetchCards = createAsyncThunk(
  'cards/fetchCards',
  async (boardId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/boards/${boardId}/cards`);
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch cards');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a new card
export const createCard = createAsyncThunk(
  'cards/createCard',
  async ({ boardId, cardData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/boards/${boardId}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to create card');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update a card
export const updateCard = createAsyncThunk(
  'cards/updateCard',
  async ({ cardId, updates }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/cards/${cardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to update card');
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a card
export const deleteCard = createAsyncThunk(
  'cards/deleteCard',
  async (cardId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_BASE}/cards/${cardId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || 'Failed to delete card');
      }
      return cardId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ================= Initial State ================= //

const initialState = {
  cards: [],
  currentCard: null,
  isLoading: false,
  error: null,
};

// ================= Slice ================= //

const cardSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setCurrentCard: (state, action) => {
      state.currentCard = state.cards.find(c => c.id === action.payload) || null;
    },
    clearCurrentCard: (state) => {
      state.currentCard = null;
    },
    clearCardError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cards
      .addCase(fetchCards.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cards = action.payload;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create card
      .addCase(createCard.fulfilled, (state, action) => {
        state.cards.push(action.payload);
      })

      // Update card
      .addCase(updateCard.fulfilled, (state, action) => {
        const index = state.cards.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.cards[index] = action.payload;
      })

      // Delete card
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.cards = state.cards.filter(c => c.id !== action.payload);
        if (state.currentCard?.id === action.payload) state.currentCard = null;
      });
  }
});

// ================= Exports ================= //

export const { setCurrentCard, clearCurrentCard, clearCardError } = cardSlice.actions;
export default cardSlice.reducer;
