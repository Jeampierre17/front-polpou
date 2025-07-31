import { renderHook, act } from '@testing-library/react';
import { useKanbanTasks } from '../hooks/useKanbanStore';

describe('useKanbanTasks', () => {
  it('sets and gets kanban tasks', () => {
    const { result } = renderHook(() => useKanbanTasks());
    act(() => {
      result.current.setKanbanTasks([{ id: '1', title: 'Tarea', description: '', status: 'todo', priority: 'high', createdAt: new Date(), updatedAt: new Date() }]);
    });
    expect(result.current.kanbanTasks[0].title).toBe('Tarea');
  });
  it('adds a kanban task', () => {
    const { result } = renderHook(() => useKanbanTasks());
    act(() => {
      result.current.addKanbanTask({ title: 'Nueva', description: '', status: 'todo', priority: 'high' });
    });
    expect(result.current.kanbanTasks.length).toBeGreaterThan(0);
  });
});
