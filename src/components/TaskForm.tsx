import React, { useState } from 'react';
import type { Task } from '../types';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    status: 'todo' as Task['status'],
    assignee: '',
    dueDate: '',
  });
  const [closing, setClosing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!form.title.trim()) {
    alert('El título es requerido');
    return;
  }
  setClosing(true);
  setTimeout(() => {
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      status: form.status,
      assignee: form.assignee.trim() || undefined,
      dueDate: form.dueDate ? new Date(form.dueDate) : undefined,
    });
    setForm({
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      assignee: '',
      dueDate: '',
    });
    setClosing(false);
  }, 300); // Debe coincidir con la duración de la animación
};

  // Nuevo: animación de cierre
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onCancel();
      setClosing(false);
    }, 300); // Debe coincidir con la duración de la animación
  };



  return (
   <div style={{ marginTop: '0px' }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-2">
    <div
      className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md px-6 py-6 sm:px-8 sm:py-8
      transition-all duration-300 transform
      ${closing
        ? 'animate-[zoomOut_0.3s_ease-in_forwards]'
        : 'animate-[zoomIn_0.3s_ease-out_forwards]'
      }`}
    >
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
        Nueva Tarea
      </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Título *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              placeholder="Título de la tarea"
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
              rows={3}
              placeholder="Descripción de la tarea"
            />
          </div>
          <div>
            <label htmlFor="priority" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Prioridad
            </label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Estado
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            >
              <option value="todo">Por Hacer</option>
              <option value="in-progress">En Progreso</option>
              <option value="done">Completada</option>
            </select>
          </div>
          <div>
            <label htmlFor="assignee" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Asignado a
            </label>
            <input
              id="assignee"
              name="assignee"
              type="text"
              value={form.assignee}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              placeholder="Nombre de la persona (opcional)"
            />
          </div>
     {/*      <div>
            <label htmlFor="dueDate" className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Fecha de vencimiento
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
          </div> */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <PlusIcon className="w-5 h-5" />
              Crear
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <XMarkIcon className="w-5 h-5" />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
