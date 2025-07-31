import React, { useState, useEffect, Fragment } from 'react';
import type { ProductFilters as ProductFiltersType } from '../types';
import { Dialog, Transition, Listbox } from '@headlessui/react';
import { FunnelIcon, ChevronUpDownIcon, CheckIcon, XMarkIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

interface ProductFiltersProps {
  filters: ProductFiltersType;
  categories: string[];
  onFiltersChange: (filters: ProductFiltersType) => void;
}

const sortOptions = [
  { value: 'name', label: 'Nombre' },
  { value: 'price-asc', label: 'Precio: Menor a Mayor' },
  { value: 'price-desc', label: 'Precio: Mayor a Menor' },
  { value: 'rating', label: 'Rating' }
];

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  categories,
  onFiltersChange
}) => {
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [showSheet, setShowSheet] = useState(false); // Para mobile bottom sheet

  // Sincroniza el searchTerm local cuando cambian los filtros externos
  useEffect(() => {
    setSearchTerm(filters.search);
  }, [filters.search]);

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.search !== searchTerm) {
        onFiltersChange({ ...filters, search: searchTerm });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category });
  };

  const handleSortChange = (sortBy: ProductFiltersType['sortBy']) => {
    onFiltersChange({ ...filters, sortBy });
  };

  // Handle price changes for min and max
  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : Number(value);
    if (type === 'min') {
      onFiltersChange({ ...filters, minPrice: numValue });
    } else {
      onFiltersChange({ ...filters, maxPrice: numValue });
    }
  };

  // Handle rating change
  const handleRatingChange = (value: number | '') => {
    // Si el valor es 5, filtrar solo productos con rating igual a 5
    if (value === 5) {
      onFiltersChange({ ...filters, minRating: 5 });
    } else {
      // Para otros valores, filtrar productos con rating >= valor
      const numValue = value === '' ? undefined : value;
      onFiltersChange({ ...filters, minRating: numValue });
    }
  };

  // Compact Listbox for category
  const categoryOptions = [{ value: '', label: 'Todas las categorías' }, ...categories.map(c => ({
    value: c,
    label: c.charAt(0).toUpperCase() + c.slice(1)
  }))];

  // Compact Listbox for sort
  const selectedSort = sortOptions.find(opt => opt.value === filters.sortBy) || sortOptions[0];
  const selectedCategory = categoryOptions.find(opt => opt.value === filters.category) || categoryOptions[0];

  return (
    <div className="w-full md:px-6 xl:px-0 max-w-full md:max-w-3xl xl:max-w-7xl mx-auto">
      {/* Mobile: Bottom Sheet Trigger */}
      <div className="xl:hidden mb-3">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-pink-500 dark:bg-pink-600 dark:text-gray-100 rounded-lg border border-gray-200 dark:border-gray-700 text-white dark:text-gray-100 font-medium"
          onClick={() => setShowSheet(true)}
        >
          <FunnelIcon className="w-5 h-5" />
          Filtros
        </button>
      </div>
      {/* Mobile: Bottom Sheet (compact, agrupado) */}
      <Transition.Root show={showSheet} as={Fragment}>
        <Dialog as="div" className="relative z-50 xl:hidden" onClose={setShowSheet}>
          <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>
          <div className="fixed inset-0 flex items-end">
            <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="translate-y-full" enterTo="translate-y-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-y-0" leaveTo="translate-y-full">
              <Dialog.Panel className="w-full bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl p-4 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-base text-gray-900 dark:text-gray-100">Filtros</span>
                  <button onClick={() => setShowSheet(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <XMarkIcon className="w-5 h-5 text-gray-700 dark:text-gray-100" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {/* Búsqueda */}
                  <input
                    id="search"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar..."
                    className="flex-1 min-w-[120px] px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  {/* Categoría */}
                  <div className="flex-1 min-w-[120px]">
                    <Listbox value={filters.category} onChange={handleCategoryChange}>
                      <div className="relative">
                        <Listbox.Button className="w-full flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100">
                          <span className="truncate">{selectedCategory.label}</span>
                          <ChevronUpDownIcon className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                        </Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <Listbox.Options className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-xs shadow-lg ring-1 ring-black/5 focus:outline-none">
                            {categoryOptions.map(option => (
                              <Listbox.Option key={option.value} value={option.value} className={({ active }) => `cursor-pointer select-none py-2 pl-8 pr-2 ${active ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                {({ selected }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-semibold' : ''}`}>{option.label}</span>
                                    {selected ? <span className="absolute left-2 top-2 text-purple-600 dark:text-purple-400"><CheckIcon className="w-3 h-3" /></span> : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>
                  {/* Ordenar */}
                  <div className="flex-1 min-w-[120px]">
                    <Listbox value={filters.sortBy} onChange={handleSortChange}>
                      <div className="relative">
                        <Listbox.Button className="w-full flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800 text-xs text-gray-900 dark:text-gray-100">
                          <span className="truncate">{selectedSort.label}</span>
                          <ChevronUpDownIcon className="h-4 w-4 text-gray-400 dark:text-gray-300" />
                        </Listbox.Button>
                        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                          <Listbox.Options className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white dark:bg-gray-800 py-1 text-xs shadow-lg ring-1 ring-black/5 focus:outline-none">
                            {sortOptions.map(option => (
                              <Listbox.Option key={option.value} value={option.value} className={({ active }) => `cursor-pointer select-none py-2 pl-8 pr-2 ${active ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                {({ selected }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-semibold' : ''}`}>{option.label}</span>
                                    {selected ? <span className="absolute left-2 top-2 text-purple-600 dark:text-purple-400"><CheckIcon className="w-3 h-3" /></span> : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                  </div>
                  {/* Precio */}
                  <div className="flex items-center gap-1 min-w-[120px]">
                    <span className="text-purple-500 text-xs font-bold">$</span>
                    <input type="number" min={0} value={filters.minPrice ?? ''} onChange={e => handlePriceChange('min', e.target.value)} placeholder="Mín" className="w-14 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 text-xs" />
                    <span className="text-gray-400">-</span>
                    <input type="number" min={0} value={filters.maxPrice ?? ''} onChange={e => handlePriceChange('max', e.target.value)} placeholder="Máx" className="w-14 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 text-xs" />
                  </div>
                  {/* Rating */}
                  <div className="flex items-center gap-1 min-w-[100px]">
                    <span className="text-yellow-400 text-xs font-bold">★</span>
                    <select value={filters.minRating ?? ''} onChange={e => handleRatingChange(Number(e.target.value))} className="px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 text-xs">
                      <option value="">Todas</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md px-4 py-2 text-base font-medium dark:bg-purple-700 dark:hover:bg-purple-800" onClick={() => setShowSheet(false)}>
                    Aplicar filtros
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {/* Desktop: Barra horizontal sticky, filtros como chips compactos, sin flex-wrap */}
      <div className="hidden xl:flex sticky top-4 z-30 w-full bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg px-2 md:px-3 xl:px-4 py-2 md:py-2.5 xl:py-3 mb-6 gap-1 md:gap-2 xl:gap-3 items-center flex-nowrap scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 text-sm md:text-[15px] xl:text-base">
        {/* Búsqueda */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
          <FunnelIcon className="w-4 h-4 text-purple-500" />
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar..."
            className="bg-transparent border-none focus:ring-0 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 min-w-[100px]"
            style={{ fontFamily: 'inherit', fontSize: '15px' }}
          />
        </div>
        {/* Categoría */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 min-w-[120px]">
          <span className="text-xs text-gray-500">Categoría</span>
          <Listbox value={filters.category} onChange={handleCategoryChange}>
            <div className="relative">
              <Listbox.Button className="flex items-center gap-1 bg-transparent text-sm text-gray-900 dark:text-gray-100">
                <span className="truncate">{selectedCategory.label}</span>
                <ChevronUpDownIcon className="h-4 w-4 text-gray-400 dark:text-gray-300" />
              </Listbox.Button>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options
                  className="absolute left-0 mt-2 max-h-56 w-48 min-w-[160px] overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 text-xs border border-purple-200 dark:border-pink-500 shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] drop-shadow-2xl z-[9999] focus:outline-none"
                  style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25), 0 0 0 2px #f1f1f1' }}
                >
                  {categoryOptions.map(option => (
                    <Listbox.Option
                      key={option.value}
                      value={option.value}
                      className={({ active }) => (
                        `cursor-pointer select-none py-2 pl-8 pr-2 ${active ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`
                      )}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-semibold' : ''}`}>{option.label}</span>
                          {selected ? (
                            <span className="absolute left-2 top-2 text-purple-600 dark:text-purple-400">
                              <CheckIcon className="w-3 h-3" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        {/* Ordenar */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 min-w-[120px]">
          <span className="text-xs text-gray-500">Ordenar</span>
          <Listbox value={filters.sortBy} onChange={handleSortChange}>
            <div className="relative">
              <Listbox.Button className="flex items-center gap-1 bg-transparent text-sm text-gray-900 dark:text-gray-100">
                <span className="truncate">{selectedSort.label}</span>
                <ChevronUpDownIcon className="h-4 w-4 text-gray-400 dark:text-gray-300" />
              </Listbox.Button>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options
                  className="absolute left-0 mt-2 max-h-56 w-48 min-w-[160px] overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 text-xs border border-purple-200 dark:border-pink-500 shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] drop-shadow-2xl z-[9999] focus:outline-none"
                  style={{ boxShadow: '0 8px 32px 0 rgba(0,0,0,0.25), 0 0 0 2px #f1f1f1' }}
                >
                  {sortOptions.map(option => (
                    <Listbox.Option
                      key={option.value}
                      value={option.value}
                      className={({ active }) => (
                        `cursor-pointer select-none py-2 pl-8 pr-2 ${active ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`
                      )}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-semibold' : ''}`}>{option.label}</span>
                          {selected ? (
                            <span className="absolute left-2 top-2 text-purple-600 dark:text-purple-400">
                              <CheckIcon className="w-3 h-3" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        {/* Precio */}
        <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 min-w-[120px]">
          <CurrencyDollarIcon className="w-4 h-4 text-purple-500" aria-label="Precio" />
          <input type="number" min={0} value={filters.minPrice ?? ''} onChange={e => handlePriceChange('min', e.target.value)} placeholder="Mín" className="w-15 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 text-xs" />
          <span className="text-gray-400">-</span>
          <input type="number" min={0} value={filters.maxPrice ?? ''} onChange={e => handlePriceChange('max', e.target.value)} placeholder="Máx" className="w-15 px-2 py-1 border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-800 text-xs" />
        </div>
        {/* Rating */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 min-w-[120px]">
          <StarSolid className="w-5 h-5 text-yellow-500 flex-shrink-0" aria-label="Rating" />
          <Listbox value={filters.minRating ?? ''} onChange={handleRatingChange}>
            <div className="relative min-w-[90px]">
              <Listbox.Button className="flex items-center gap-1 bg-transparent text-xs text-gray-900 dark:text-gray-100 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 w-full">
                {filters.minRating ? (
                  <span className="flex items-center gap-0.5">
                
                    <span className="ml-1 font-bold">{filters.minRating}+</span>
                  </span>
                ) : (
                  <span className="text-gray-400">Todas</span>
                )}
                <ChevronUpDownIcon className="h-4 w-4 text-gray-400 dark:text-gray-300 ml-1" />
              </Listbox.Button>
              <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="absolute left-0 mt-2 max-h-56 w-32 min-w-[100px] overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 text-xs shadow-2xl ring-1 ring-black/10 focus:outline-none z-[9999] border border-gray-100 dark:border-gray-700">
                  <Listbox.Option value={''} className={({ active }) => `cursor-pointer select-none py-2 pl-8 pr-2 ${active ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                    {({ selected }) => (
                      <span className={`block truncate ${selected ? 'font-semibold' : ''}`}>Todas</span>
                    )}
                  </Listbox.Option>
                  {[1,2,3,4].map(val => (
                    <Listbox.Option key={val} value={val} className={({ active }) => `cursor-pointer select-none py-2 pl-8 pr-2 flex items-center ${active ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                      {({ selected }) => (
                        <span className={`flex items-center gap-1 ${selected ? 'font-semibold' : ''}`}>
                          <span className="ml-1 font-bold">{val}+</span>
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                  <Listbox.Option value={5} className={({ active }) => `cursor-pointer select-none py-2 pl-8 pr-2 flex items-center ${active ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                    {({ selected }) => (
                      <span className={`flex items-center gap-1 ${selected ? 'font-semibold' : ''}`}>
                        <span className="ml-1 font-bold">5</span>
                      </span>
                    )}
                  </Listbox.Option>
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;