import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewService from '../../services/reviewService';

export const submitReviewDecision = createAsyncThunk(
  'review/submitDecision',
  async ({ reviewCycleId, decisionData }, { rejectWithValue }) => {
    try {
      const data = await reviewService.submitDecision(reviewCycleId, decisionData);
      return { reviewCycleId, ...decisionData, data };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit review decision');
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    pendingReviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    setPendingReviews: (state, action) => {
      state.pendingReviews = action.payload;
    },
    clearReviewError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitReviewDecision.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitReviewDecision.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingReviews = state.pendingReviews.filter(
          (r) => r.id !== action.payload.reviewCycleId
        );
      })
      .addCase(submitReviewDecision.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPendingReviews, clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;
