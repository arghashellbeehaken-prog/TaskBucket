import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/apiClient";

export const fetchTask = createAsyncThunk("task/fetch", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/tasks");
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to fetch tasks");
  }
});

export const createTask = createAsyncThunk("tasks/create", async (payload, { rejectWithValue }) => {
  try {
    const res = await api.post("/tasks", payload);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to create task");
  }
});

export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/tasks/${id}`, payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update task");
    }
  }
);

export const deleteTask = createAsyncThunk("tasks/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to delete task");
  }
});

export const addSubtask = createAsyncThunk(
  "tasks/addSubtask",
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/tasks/${id}/subtasks`, { text });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add subtask");
    }
  }
);

export const toggleSubtask = createAsyncThunk(
  "tasks/toggleSubtask",
  async ({ id, subId }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/tasks/${id}/subtasks/${subId}/toggle`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to toggle subtask");
    }
  }
);

export const deleteSubtask = createAsyncThunk(
  "tasks/deleteSubtask",
  async ({ id, subId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/tasks/${id}/subtasks/${subId}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete subtask");
    }
  }
);

export const editSubtask = createAsyncThunk(
  "tasks/editSubtask",
  async ({ id, subId, text }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/tasks/${id}/subtasks/${subId}`, { text });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to edit subtask");
    }
  }
);

const slice = createSlice({
  name: "tasks",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.status = "succeeded";
      })
      .addCase(createTask.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t._id !== action.payload);
      })
      .addCase(addSubtask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(toggleSubtask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(editSubtask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteSubtask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default slice.reducer;
