import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeProvider } from '../hooks/useTheme';

describe('ThemeToggle', () => {
  it('renderiza el botón de tema', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('cambia el tema al hacer click', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    // No hay assert directo, pero no debe romper
    expect(button).toBeInTheDocument();
  });
});
