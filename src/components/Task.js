import React, { useState } from "react";
import { useSelector } from "react-redux";
import TaskModal from "../modals/TaskModal";

const Task = ({ colIndex, taskIndex }) => {
  const boards = useSelector((state) => state.boards);
  
  // Initialize useState before any early returns
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Find the active board
  const board = boards.find((board) => board.isActive === true);
  
  // If no active board is found, return null
  if (!board) {
    return <div>No active board found</div>;
  }

  const columns = board.columns;
  
  // Ensure the column exists
  const col = columns[colIndex];
  if (!col) {
    return <div>Column not found</div>;
  }

  const task = col.tasks[taskIndex];
  
  // If no task is found, return null
  if (!task) {
    return <div>Task not found</div>;
  }

  // Safely handle subtasks and ensure it's an array
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  let completed = 0;

  // Safely iterate over subtasks
  subtasks.forEach((subtask) => {
    if (subtask.isCompleted) {
      completed++;
    }
  });

  const handleOnDrag = (e) => {
    e.dataTransfer.setData(
      "text",
      JSON.stringify({ taskIndex, prevColIndex: colIndex })
    );
  };

  return (
    <div>
      <div
        onClick={() => {
          setIsTaskModalOpen(true);
        }}
        draggable
        onDragStart={handleOnDrag}
        className="w-full first:my-5 rounded-md bg-white border-[#767474] dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-3 shadow-lg hover:text-[#c25fc7] dark:text-white dark:hover:text-[#635fc7] cursor-pointer"
      >
        <p className="font-bold tracking-wide text-lg">{task.title}</p>
        <p className="font-bold text-xs tracking-tighter mt-2 text-gray-500">
          {completed} of {subtasks.length} completed tasks
        </p>
      </div>
      {isTaskModalOpen && (
        <TaskModal
          colIndex={colIndex}
          taskIndex={taskIndex}
          setIsTaskModalOpen={setIsTaskModalOpen}
        />
      )}
    </div>
  );
};

export default Task;
