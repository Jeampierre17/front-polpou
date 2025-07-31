import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import ProductFilters from '../components/ProductFilters';

expect.extend(toHaveNoViolations);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}

describe('Accesibilidad de ProductFilters', () => {
  it('no debe tener violaciones de accesibilidad (axe)', async () => {
    const filters = { search: '', category: '', sortBy: "name" as "name", minPrice: undefined, maxPrice: undefined, minRating: undefined };
    const categories = ['cat1', 'cat2'];
    const { container } = render(
      <ProductFilters filters={filters} categories={categories} onFiltersChange={() => {}} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
