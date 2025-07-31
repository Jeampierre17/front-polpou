import { useKanbanFilters as useZustandKanbanFilters } from './useKanbanStore';

// Hook reutilizable para filtros de Kanban
export function useKanbanFilters() {
  // Puedes extender aquí lógica de filtros, memoización, helpers, etc.
  const { kanbanFilters, setKanbanFilters } = useZustandKanbanFilters();
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
  return {
    kanbanFilters,
    setKanbanFilters,
    statusFilter: kanbanFilters.status,
    priorityFilter: kanbanFilters.priority,
    statusOptions,
    priorityOptions,
  };
}
