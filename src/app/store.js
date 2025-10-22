import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/AuthSlice';
import workspaceReducer from '../features/workspace/WorkspaceSlice';
import taskReducer from '../features/task/TaskSlice'
import boadsReducer from '../features/board/BoardSlice';
import cardReducer from '../features/cards/CardSlice';
import checklistReducer from "../features/checkList/CheckListSlice.js";
import { workspaceApi } from '../features/workspace/workspaceApi';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    workspace: workspaceReducer,
    tasks: taskReducer,
    board: boadsReducer,
    card: cardReducer,
    checklist: checklistReducer,
    
    [workspaceApi.reducerPath]: workspaceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(workspaceApi.middleware),
});


export default store;