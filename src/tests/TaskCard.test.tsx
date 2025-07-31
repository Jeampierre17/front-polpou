import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import TaskCard from '../components/TaskCard';

const task = {
  id: '1',
  title: 'Tarea Importante',
  description: 'Descripción de la tarea',
  status: 'todo' as 'todo',
  priority: 'high' as 'high',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('TaskCard', () => {
  const onMoveTask = vi.fn();
  const onUpdateTask = vi.fn();
  const onDeleteTask = vi.fn();

  it('renderiza el título y descripción', () => {
    render(
      <TaskCard
        task={{
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }}
        onMoveTask={onMoveTask}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
      />
    );
    expect(screen.getByText('Tarea Importante')).toBeInTheDocument();
    expect(screen.getByText('Descripción de la tarea')).toBeInTheDocument();
  });

  it('muestra el estado y prioridad', () => {
    render(
      <TaskCard
        task={{
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }}
        onMoveTask={onMoveTask}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
      />
    );
    expect(screen.getByText(/Por Hacer/i)).toBeInTheDocument();
    expect(screen.getByText(/alta/i)).toBeInTheDocument();
  });
});
