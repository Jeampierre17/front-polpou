import React, { useState, useEffect } from 'react';
import type { KanbanTask } from '../hooks/useStore';
import { useKanbanTasks, useKanbanFilters } from '../hooks/useKanbanStore';
import KanbanColumn from '../components/KanbanColumn';
import TaskForm from '../components/TaskForm';
import { ChevronUpDownIcon, PlusIcon } from '@heroicons/react/24/outline';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import TaskCard from '../components/TaskCard';

import { usePageTitle } from '../hooks/usePageTitle';
import { Dialog, Transition, Listbox } from '@headlessui/react';

const Kanban: React.FC = () => {
  const { setPageTitle } = usePageTitle();
  useEffect(() => { setPageTitle('Dashboard Kanban'); }, [setPageTitle]);
  // kanban global state via custom hooks
  const { kanbanTasks, setKanbanTasks, addKanbanTask, updateKanbanTask, deleteKanbanTask, moveKanbanTask } = useKanbanTasks();
  const { kanbanFilters, setKanbanFilters } = useKanbanFilters();

  // Guardar en localStorage cada vez que cambian las tareas

  const [showForm, setShowForm] = useState(false);
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);

  // Filtros
  // Filtros globales
  const statusFilter = kanbanFilters.status;
  const priorityFilter = kanbanFilters.priority;
  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'todo', label: 'Por Hacer' },
    { value: 'in-progress', label: 'En Progreso' },
    { value: 'done', label: 'Completado' },
  ];
  const priorityOptions = [
    { value: 'all', label: 'Todas' },
    { value: 'high', label: 'Alta' },
    { value: 'medium', label: 'Media' },
    { value: 'low', label: 'Baja' },
  ];
  // Mostrar/ocultar filtros en mobile
  const [showFilters, setShowFilters] = useState(false);

  const addTask = (task: Omit<KanbanTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    addKanbanTask(task);
    setShowForm(false);
  };

  const updateTask = (id: string, updates: Partial<KanbanTask>) => {
    updateKanbanTask(id, updates);
  };

  const deleteTask = (id: string) => {
    deleteKanbanTask(id);
  };

  const moveTask = (taskId: string, newStatus: KanbanTask['status']) => {
    moveKanbanTask(taskId, newStatus);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const columnIds = ['todo', 'in-progress', 'done'];

    // Mover a otra columna (cambia status)
    if (columnIds.includes(over.id as string)) {
      const task = kanbanTasks.find(t => t.id === active.id);
      if (task && task.status !== over.id) {
        moveTask(active.id as string, over.id as KanbanTask['status']);
      }
      return;
    }

    // Reordenar dentro de la misma columna
    if (active.id !== over.id) {
      const activeTask = kanbanTasks.find(t => t.id === active.id);
      const overTask = kanbanTasks.find(t => t.id === over.id);
      if (activeTask && overTask && activeTask.status === overTask.status) {
        // Filtra solo las tareas de la columna
        const columnTasks = kanbanTasks.filter(t => t.status === activeTask.status);
        const oldIndex = columnTasks.findIndex(t => t.id === active.id);
        const newIndex = columnTasks.findIndex(t => t.id === over.id);
        const newColumnTasks = arrayMove(columnTasks, oldIndex, newIndex);
        // Reconstruye el array global manteniendo el orden de las otras columnas
        const newKanbanTasks: KanbanTask[] = [];
        kanbanTasks.forEach(t => {
          if (t.status !== activeTask.status) {
            newKanbanTasks.push(t);
          }
        });
        // Inserta las tareas reordenadas de la columna en el lugar correcto
        // (mantiene el orden global fuera de la columna)
        let insertIndex = kanbanTasks.findIndex(t => t.status === activeTask.status);
        if (insertIndex === -1) insertIndex = newKanbanTasks.length;
        newKanbanTasks.splice(insertIndex, 0, ...newColumnTasks);
        setKanbanTasks(newKanbanTasks);
      }
      // Mover entre columnas y a posición específica (drag sobre otra tarea de otra columna)
      if (activeTask && overTask && activeTask.status !== overTask.status) {
        // Quita la tarea a mover
        const filtered = kanbanTasks.filter(t => t.id !== active.id);
        // Encuentra las tareas de la columna destino
        const destColumnTasks = filtered.filter(t => t.status === overTask.status);
        const destIndex = destColumnTasks.findIndex(t => t.id === over.id);
        // Inserta la tarea en la posición correcta
        const updatedTask = { ...activeTask, status: overTask.status, updatedAt: new Date() };
        // Reconstruye el array global
        const newKanbanTasks: KanbanTask[] = [];
        let inserted = false;
        for (let i = 0, count = 0; i < filtered.length; i++) {
          const t = filtered[i];
          if (t.status === overTask.status && count === destIndex) {
            newKanbanTasks.push(updatedTask);
            inserted = true;
          }
          newKanbanTasks.push(t);
          if (t.status === overTask.status) count++;
        }
        if (!inserted) newKanbanTasks.push(updatedTask);
        setKanbanTasks(newKanbanTasks);
      }
    }
  };


  // Filtrado por estado y prioridad
  const filteredTasks = kanbanTasks.filter(task => {
    const statusOk = statusFilter === 'all' || task.status === statusFilter;
    const priorityOk = priorityFilter === 'all' || task.priority === priorityFilter;
    return statusOk && priorityOk;
  });

  const todoTasks = filteredTasks.filter(task => task.status === 'todo');
  const inProgressTasks = filteredTasks.filter(task => task.status === 'in-progress');
  const doneTasks = filteredTasks.filter(task => task.status === 'done');

  return (
    <DndContext
      onDragStart={event => {
        const task = kanbanTasks.find(t => t.id === event.active.id);
        setActiveTask(task || null);
      }}
      onDragEnd={event => {
        setActiveTask(null);
        handleDragEnd(event);
      }}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">

          {/* Filtros: visibles en desktop, toggle en mobile */}
          {/* Filtros Kanban: estilo moderno, chips en desktop, sheet en mobile */}
          {/* Mobile: Bottom Sheet Trigger */}
          <div className="sm:hidden mb-2">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 dark:bg-pink-600 dark:text-gray-100 rounded-lg border border-gray-200 dark:border-gray-700 text-white dark:text-gray-100 font-medium"
              onClick={() => setShowFilters(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" /></svg>
              Filtros
            </button>
          </div>
          {/* Mobile: Bottom Sheet */}
          <Transition.Root show={showFilters} as={React.Fragment}>
            <Dialog as="div" className="relative z-50 sm:hidden" onClose={setShowFilters}>
              <Transition.Child as={React.Fragment} enter="transition-opacity ease-linear duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="fixed inset-0 bg-black/30" />
              </Transition.Child>
              <div className="fixed inset-0 flex items-end">
                <Transition.Child as={React.Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="translate-y-full" enterTo="translate-y-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-y-0" leaveTo="translate-y-full">
                  <Dialog.Panel className="w-full bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl p-4 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-base text-gray-900 dark:text-gray-100">Filtros</span>
                      <button onClick={() => setShowFilters(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                        <svg className="w-5 h-5 text-gray-700 dark:text-gray-100" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {/* Estado */}
                      <Listbox value={statusFilter} onChange={val => setKanbanFilters({ ...kanbanFilters, status: val })}>
                        <div className="relative min-w-[120px] w-full">
                          <Listbox.Button className="flex-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs text-left focus:outline-none focus:ring-2 focus:ring-purple-400">
                            {statusOptions.find(o => o.value === statusFilter)?.label || 'Estado'}
                          </Listbox.Button>
                          <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="absolute left-0 right-0 z-10 mt-1 max-h-48 w-full min-w-[120px] overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-xs shadow-lg ring-1 ring-black/5 focus:outline-none">
                              {statusOptions.map(option => (
                                <Listbox.Option
                                  key={option.value}
                                  value={option.value}
                                  className={({ active }) => `relative cursor-pointer select-none py-2 pl-8 pr-2 ${active ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}
                                >
                                  {({ selected }) => (
                                    <>
                                      {selected ? <span className="absolute left-2 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400">✓</span> : null}
                                      <span className={`block truncate ${selected ? 'font-semibold' : ''}`}>{option.label}</span>
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                      {/* Prioridad */}
                      <Listbox value={priorityFilter} onChange={val => setKanbanFilters({ ...kanbanFilters, priority: val })}>
                        <div className="relative min-w-[120px] w-full">
                          <Listbox.Button className="flex-1 w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs text-left focus:outline-none focus:ring-2 focus:ring-purple-400">
                            {priorityOptions.find(o => o.value === priorityFilter)?.label || 'Prioridad'}
                          </Listbox.Button>
                          <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-xs shadow-lg ring-1 ring-black/5 focus:outline-none">
                              {priorityOptions.map(option => (
                                <Listbox.Option
                                  key={option.value}
                                  value={option.value}
                                  className={({ active }) => `relative cursor-pointer select-none py-2 pl-8 pr-2 ${active ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}
                                >
                                  {({ selected }) => (
                                    <>
                                      {selected ? <span className="absolute left-2 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400">✓</span> : null}
                                      <span className={`block truncate ${selected ? 'font-semibold' : ''}`}>{option.label}</span>
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md px-4 py-2 text-base font-medium dark:bg-purple-700 dark:hover:bg-purple-800" onClick={() => setShowFilters(false)}>
                        Aplicar filtros
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
          {/* Desktop: filtros alineados a la izquierda y botón a la derecha */}
          <div className="hidden sm:flex sticky top-4 z-30 w-full bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg px-2 md:px-3 xl:px-4 py-2 md:py-2.5 xl:py-3 mb-2 gap-2 items-center flex-nowrap scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 text-sm justify-between">
            <div className="flex gap-2 items-center">
              {/* Estado */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 min-w-[120px]">
                <span className="text-xs text-gray-500">Estado</span>
                <Listbox value={statusFilter} onChange={val => setKanbanFilters({ ...kanbanFilters, status: val })}>
                        <div className="relative min-w-[80px]">
                    <Listbox.Button className="bg-transparent flex items-center gap-1  border-none focus:ring-0 text-sm text-gray-900 dark:text-gray-100 min-w-[80px] text-left">
                      {statusOptions.find(o => o.value === statusFilter)?.label || 'Estado'}
                        <ChevronUpDownIcon className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                    </Listbox.Button>
                    
                    <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute left-0 right-0 z-10 mt-1 max-h-48 w-full min-w-[120px] overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-xs shadow-lg ring-1 ring-black/5 focus:outline-none">
                        {statusOptions.map(option => (
                          <Listbox.Option
                            key={option.value}
                            value={option.value}
                            className={({ active }) => `relative cursor-pointer select-none py-2 pl-8 pr-2 ${active ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}
                          >
                            {({ selected }) => (
                              <>
                                {selected ? <span className="absolute left-2 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400">✓</span> : null}
                                <span className={`block truncate ${selected ? 'font-semibold' : ''}`}>{option.label}</span>
                              
                             </>
                             
                            )}
                            
                          </Listbox.Option>
                          
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
              {/* Prioridad */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 min-w-[120px]">
                <span className="text-xs text-gray-500">Prioridad</span>
                <Listbox value={priorityFilter} onChange={val => setKanbanFilters({ ...kanbanFilters, priority: val })}>
                  <div className="relative min-w-[80px]">
                    <Listbox.Button className="bg-transparent flex items-center gap-1 border-none focus:ring-0 text-sm text-gray-900 dark:text-gray-100 min-w-[80px] text-left">
                      {priorityOptions.find(o => o.value === priorityFilter)?.label || 'Prioridad'}
                     <ChevronUpDownIcon className="h-4 w-4 text-gray-400 dark:text-gray-300" />

                    </Listbox.Button>
                    <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                      <Listbox.Options className="absolute left-0 right-0 z-10 mt-1 max-h-48 w-full min-w-[120px] overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-xs shadow-lg ring-1 ring-black/5 focus:outline-none">
                        {priorityOptions.map(option => (
                          <Listbox.Option
                            key={option.value}
                            value={option.value}
                            className={({ active }) => `relative cursor-pointer select-none py-2 pl-8 pr-2 ${active ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}
                          >
                            {({ selected }) => (
                              <>
                                {selected ? <span className="absolute left-2 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400">✓</span> : null}
                                <span className={`block truncate ${selected ? 'font-semibold' : ''}`}>{option.label}</span>
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex flex-row items-center justify-center gap-2 bg-pink-600 hover:bg-purple-700 text-white font-semibold tracking-wide py-2 px-5 rounded-xl shadow-lg transition focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
            >
              <PlusIcon className="w-5 h-5 font-bold" />
              <span className="whitespace-nowrap">Nueva Tarea</span>
            </button>
      
          </div>
  {/* Botón flotante + solo en mobile */}
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="sm:hidden fixed bottom-6 right-6 z-50 bg-pink-600 hover:bg-purple-700 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center text-3xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 transition"
          aria-label="Nueva Tarea"
        >
          <PlusIcon className="w-8 h-8 font-bold" />
        </button>
        </div>

        {/* Botón de filtros para mobile 
        <div className="sm:hidden flex justify-end mb-2">
          <button
            onClick={() => setShowFilters(f => !f)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-expanded={showFilters}
            aria-controls="kanban-filters"
          >
            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            <svg className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>*/}


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KanbanColumn
            title="Por Hacer"
            tasks={todoTasks}
            status="todo"
            onMoveTask={moveTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
          <KanbanColumn
            title="En Progreso"
            tasks={inProgressTasks}
            status="in-progress"
            onMoveTask={moveTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
          <KanbanColumn
            title="Completado"
            tasks={doneTasks}
            status="done"
            onMoveTask={moveTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        </div>

        {showForm && (
          <TaskForm
            onSubmit={addTask}
            onCancel={() => setShowForm(false)}
          />
        )}

        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              onMoveTask={() => { }}
              onUpdateTask={() => { }}
              onDeleteTask={() => { }}
            />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default Kanban;
