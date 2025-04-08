'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface FiltersProps {
  onFilterChange: (filters: {
    search: string;
    category: string;
    minPrice: number;
    maxPrice: number;
    inStock: boolean;
  }) => void;
}

const CATEGORIES = [
  'All',
  'Vegetables',
  'Fruits',
  'Grains',
  'Dairy',
  'Meat',
  'Poultry',
  'Herbs',
  'Other',
];

export function ProductFilters({ onFilterChange }: FiltersProps) {
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    minPrice: 0,
    maxPrice: 1000,
    inStock: false,
  });

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <div>
        <Label htmlFor="search">Search Products</Label>
        <Input
          id="search"
          placeholder="Search by name..."
          value={filters.search}
          onChange={(e) => handleFilterChange({ search: e.target.value })}
        />
      </div>

      <div>
        <Label>Category</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {filters.category}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <div className="grid gap-1 p-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  className="justify-start font-normal"
                  onClick={() => handleFilterChange({ category })}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      filters.category === category ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  {category}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>Price Range</Label>
        <div className="pt-2">
          <Slider
            defaultValue={[filters.minPrice, filters.maxPrice]}
            max={1000}
            step={10}
            onValueChange={([min, max]) =>
              handleFilterChange({ minPrice: min, maxPrice: max })
            }
          />
          <div className="flex justify-between mt-2">
            <span>${filters.minPrice}</span>
            <span>${filters.maxPrice}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="in-stock"
          checked={filters.inStock}
          onChange={(e) => handleFilterChange({ inStock: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="in-stock">In Stock Only</Label>
      </div>
    </div>
  );
}
