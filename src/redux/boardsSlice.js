import { createSlice } from "@reduxjs/toolkit";
import data from "../data.json";

const loadBoardsFromLocalStorage = () => {
  const boards = JSON.parse(localStorage.getItem("boards"));
  return boards ? boards : data.boards;
};

const saveBoardsToLocalStorage = (boards) => {
  localStorage.setItem("boards", JSON.stringify(boards));
};

const boardsSlice = createSlice({
  name: "boards",
  initialState: loadBoardsFromLocalStorage(),
  reducers: {
    setBoardActive: (state, action) => {
      state.forEach((board, index) => {
        board.isActive = index === action.payload.index;
      });
      saveBoardsToLocalStorage(state);
    },
    addTask: (state, action) => {
      const { title, status, description, subtasks, newColIndex } = action.payload;
      const task = { title, status, description, subtasks };
      const activeBoard = state.find(board => board.isActive);
      const column = activeBoard.columns[newColIndex];
      column.tasks.push(task);
      saveBoardsToLocalStorage(state);
    },
    editTask: (state, action) => {
      const { title, status, description, subtasks, prevColIndex, newColIndex, taskIndex } = action.payload;
      const activeBoard = state.find(board => board.isActive);
      const prevColumn = activeBoard.columns[prevColIndex];
      const task = prevColumn.tasks[taskIndex];

      task.title = title;
      task.status = status;
      task.description = description;
      task.subtasks = subtasks;

      if (prevColIndex !== newColIndex) {
        prevColumn.tasks.splice(taskIndex, 1);
        const newColumn = activeBoard.columns[newColIndex];
        newColumn.tasks.push(task);
      }
      saveBoardsToLocalStorage(state);
    },
    dragTask: (state, action) => {
      const { colIndex, prevColIndex, taskIndex } = action.payload;
      const activeBoard = state.find(board => board.isActive);
      const prevColumn = activeBoard.columns[prevColIndex];
      const task = prevColumn.tasks.splice(taskIndex, 1)[0];
      activeBoard.columns[colIndex].tasks.push(task);
      saveBoardsToLocalStorage(state);
    },
    deleteTask: (state, action) => {
      const { colIndex, taskIndex } = action.payload;
      const activeBoard = state.find(board => board.isActive);
      const column = activeBoard.columns[colIndex];
      column.tasks.splice(taskIndex, 1);
      saveBoardsToLocalStorage(state);
    },
    setSubtaskCompleted: (state, action) => {
      const { colIndex, taskIndex, index } = action.payload;
      const activeBoard = state.find(board => board.isActive);
      const column = activeBoard.columns[colIndex];
      const task = column.tasks[taskIndex];
      task.subtasks[index].isCompleted = !task.subtasks[index].isCompleted;
      saveBoardsToLocalStorage(state);
    },
    setTaskStatus: (state, action) => {
      const { colIndex, taskIndex, status, newColIndex } = action.payload;
      const activeBoard = state.find(board => board.isActive);
      const columns = activeBoard.columns;
      const column = columns[colIndex];
      const task = column.tasks[taskIndex];

      if (colIndex !== newColIndex) {
        column.tasks.splice(taskIndex, 1);
        const newColumn = columns[newColIndex];
        newColumn.tasks.push(task);
      }
      task.status = status;
      saveBoardsToLocalStorage(state);
    },
  },
});

export default boardsSlice;
