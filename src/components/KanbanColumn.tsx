import React from 'react';
import TaskCard from './TaskCard';
import type { Task } from '../types';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: Task['status'];
  onMoveTask: (taskId: string, newStatus: Task['status']) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  tasks,
  status,
  onMoveTask,
  onUpdateTask,
  onDeleteTask
}) => {
  const { setNodeRef } = useDroppable({ id: status });

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-yellow-400/50 dark:bg-amber-400/10 text-amber-600 dark:text-amber-300';
      case 'in-progress':
        return 'bg-pink-400/20 dark:bg-pink-400/10 text-pink-600 dark:text-pink-300';
      case 'done':
        return 'bg-green-400/20 dark:bg-green-400/10 text-green-600 dark:text-green-300';
      default:
        return 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300';
    }
  };

  // Solo el color de texto para el título
  const getTitleTextColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'text-amber-600 dark:text-amber-300';
      case 'in-progress':
        return 'text-pink-600 dark:text-pink-300';
      case 'done':
        return 'text-green-600 dark:text-green-300';
      default:
        return 'text-gray-500 dark:text-gray-300';
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col h-full bg-white/90 dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 min-w-[220px] sm:min-w-[300px] md:min-w-[360px] min-h-[460px]"
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`font-bold text-lg tracking-tight flex items-center gap-2 font-quicksand ${getTitleTextColor(status)}`}
        >
          <span
            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${getStatusColor(
              status
            )}`}
          >
            <ClipboardIcon className="w-5 h-5" />
          </span>
          {title}
        </h3>
      </div>
      <div className="space-y-3 flex-1 scrollbar-none scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 max-h-[90vh]">
        <SortableContext
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onMoveTask={onMoveTask}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-400 dark:text-gray-500">
            <ClipboardIcon className="w-8 h-8 mb-2" />
            <p className="text-xs text-center">No hay tareas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
