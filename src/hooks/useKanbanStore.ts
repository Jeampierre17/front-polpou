import { useStore } from './useStore';

export function useKanbanTasks() {
  const kanbanTasks = useStore(state => state.kanbanTasks);
  const setKanbanTasks = useStore(state => state.setKanbanTasks);
  const addKanbanTask = useStore(state => state.addKanbanTask);
  const updateKanbanTask = useStore(state => state.updateKanbanTask);
  const deleteKanbanTask = useStore(state => state.deleteKanbanTask);
  const moveKanbanTask = useStore(state => state.moveKanbanTask);
  return { kanbanTasks, setKanbanTasks, addKanbanTask, updateKanbanTask, deleteKanbanTask, moveKanbanTask };
}

export function useKanbanFilters() {
  const kanbanFilters = useStore(state => state.kanbanFilters);
  const setKanbanFilters = useStore(state => state.setKanbanFilters);
  return { kanbanFilters, setKanbanFilters };
}
