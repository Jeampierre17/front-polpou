import React, { useState } from "react";
import type { Task } from "../types";
import {
  PencilSquareIcon,
  TrashIcon,
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
  onMoveTask: (taskId: string, newStatus: Task["status"]) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onMoveTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
      case "medium":
        return "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300";
      case "low":
        return "bg-slate-100 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getPriorityLabel = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "Alta";
      case "medium":
        return "Media";
      case "low":
        return "Baja";
      default:
        return priority;
    }
  };

  const handleMove = (newStatus: Task["status"]) => {
    if (newStatus !== task.status) {
      onMoveTask(task.id, newStatus);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className="bg-white dark:bg-sky-950 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow flex flex-col gap-3"
    >
      {/* Fade transition for edit/view mode */}
      <div className="relative min-h-[90px]">
        {/* Edit mode */}
        <div
          className={`transition-opacity duration-300 ${isEditing ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
            } ${isEditing ? "" : "absolute inset-0"}`}
        >
          {isEditing && (
            <div className="flex flex-col gap-2 h-fit justify-between">
              <div className="space-y-1 ">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Título de la tarea"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  rows={3}
                  placeholder="Descripción de la tarea"
                />
              </div>{" "}
              <div className="flex gap-2 p-2">
                <button
                  onClick={() => {
                    onUpdateTask(task.id, {
                      title: editTitle,
                      description: editDescription,
                    });
                    setIsEditing(false);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 px-3 rounded-lg transition-colors duration-200 flex-1"
                >
                  Guardar
                </button>
                <button
                  onClick={() => {
                    setEditTitle(task.title);
                    setEditDescription(task.description);
                    setIsEditing(false);
                  }}
                  className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs py-2 px-3 rounded-lg transition-colors duration-200 flex-1"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
        {/* View mode */}
        <div
          className={`transition-opacity duration-300 ${isEditing
              ? "opacity-0 pointer-events-none absolute inset-0"
              : "opacity-100"
            }`}
        >
          {/* ...tu código de vista normal aquí... */}
          <div className="space-y-1 ">
            <div
              className="flex items-start justify-between gap-2"
              {...listeners}
              {...attributes}
            >
              {/* Área de drag: todo menos los botones */}
            </div>

            <div
              className="flex items-center gap-2 justify-between w-full"
              {...listeners}
              {...attributes}
            >
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="p-1 rounded cursor-grab active:cursor-grabbing hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  aria-label="Mover tarea"
                  {...listeners}
                  {...attributes}
                  tabIndex={-1}
                >
                  <Bars3Icon className="w-5 h-5 text-gray-400" />
                </button>

                <h4 className="font-semibold text-gray-900 dark:text-white text-base line-clamp-2">
                  {task.title}
                </h4>
              </div>
              <span
                className={`px-4 py-1 text-sm rounded-full end font-bold font-quicksand ${getPriorityColor(
                  task.priority
                )}`}
              >
                {getPriorityLabel(task.priority)}
              </span>
            </div>

            {task.description && (
              <p
                className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 pt-2"
                {...listeners}
                {...attributes}
              >
                {task.description}
              </p>
            )}
            {task.assignee && (
              <div className="flex items-center gap-2 text-xs font-medium mb-1 text-cyan-700 dark:text-purple-300">
                <UserCircleIcon className="w-5 h-5 text-purple-400 dark:text-purple-300" />
                <span>Asignado a: {task.assignee}</span>
              </div>
            )}
            <div className="flex items-center justify-between gap-2 pt-3">
              <select
                value={task.status}
                onChange={(e) => handleMove(e.target.value as Task["status"])}
                className={`
                    text-xs font-medium px-2 py-1 rounded-lg border
                    focus:outline-none focus:ring-1 focus:ring-purple-500
                    transition
                    ${task.status === "todo"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200"
                    : task.status === "in-progress"
                      ? "bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900 dark:text-pink-200"
                      : "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200"
                  }
                  `}
              >
                <option value="todo">Por Hacer</option>
                <option value="in-progress">En Progreso</option>
                <option value="done">Completado</option>
              </select>

              {/* Botones fuera del área de drag */}
              <div className="flex gap-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  aria-label="Editar tarea"
                >
                  <PencilSquareIcon className="w-5 h-5 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400" />
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  aria-label="Eliminar tarea"
                >
                  <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700 dark:hover:text-red-300" />
                </button>
              </div>
              {/*task.createdAt instanceof Date
                ? task.createdAt.toLocaleDateString()
                : new Date(task.createdAt).toLocaleDateString()*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
