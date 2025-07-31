import { render, screen } from '@testing-library/react';
import KanbanColumn from '../components/KanbanColumn';

const tasks = [
  {
    id: '1',
    title: 'Tarea 1',
    description: 'Desc 1',
    status: 'todo' as const,
    priority: 'medium' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Tarea 2',
    description: 'Desc 2',
    status: 'todo' as const,
    priority: 'medium' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('KanbanColumn', () => {
  it('muestra el título de la columna', () => {
    render(
      <KanbanColumn
        title="Por hacer"
        tasks={tasks}
        status="todo"
        onMoveTask={() => {}}
        onUpdateTask={() => {}}
        onDeleteTask={() => {}}
      />
    );
    expect(screen.getByText('Por hacer')).toBeInTheDocument();
  });

  it('muestra las tareas', () => {
    render(
      <KanbanColumn
        title="Por hacer"
        tasks={tasks}
        status="todo"
        onMoveTask={() => {}}
        onUpdateTask={() => {}}
        onDeleteTask={() => {}}
      />
    );
    expect(screen.getByText('Tarea 1')).toBeInTheDocument();
    expect(screen.getByText('Tarea 2')).toBeInTheDocument();
  });
});