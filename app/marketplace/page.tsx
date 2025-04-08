"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/store/cart";
import { ProductFilters } from "@/components/product-filters";
import { Cart } from "@/components/cart";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

interface FilterOptions {
  search: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image?: string;
  rating: number;
  in_stock: boolean;
  description?: string;
  quantity: number;
}

const products: Product[] = [
  {
    id: 1,
    name: "Organic Tomato Seeds",
    category: "Seeds",
    price: 4.99,
    image: "/farm.jpg",
    rating: 4.5,
    in_stock: true,
    description:
      "High-quality organic tomato seeds for growing delicious, juicy tomatoes. These seeds are non-GMO and perfect for home gardens.",
    quantity: 50,
  },
  {
    id: 2,
    name: "Natural Fertilizer",
    category: "Fertilizers",
    price: 19.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.2,
    in_stock: true,
    description:
      "Organic, all-natural fertilizer that promotes healthy plant growth without harmful chemicals. Suitable for all types of plants.",
    quantity: 25,
  },
  {
    id: 3,
    name: "Garden Trowel Set",
    category: "Equipment",
    price: 24.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    in_stock: true,
    description:
      "Durable 3-piece garden trowel set with ergonomic handles. Includes a trowel, transplanter, and weeder for all your gardening needs.",
    quantity: 15,
  },
  {
    id: 4,
    name: "Heirloom Carrot Seeds",
    category: "Seeds",
    price: 3.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.3,
    in_stock: true,
    description:
      "Rare heirloom carrot seeds that produce sweet, colorful carrots. These traditional varieties have been preserved for generations.",
    quantity: 40,
  },
  {
    id: 5,
    name: "Organic Pest Control",
    category: "Pesticides",
    price: 14.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.0,
    in_stock: false,
    description:
      "Eco-friendly pest control solution that effectively eliminates common garden pests without harming beneficial insects or plants.",
    quantity: 0,
  },
  {
    id: 6,
    name: "Pruning Shears",
    category: "Equipment",
    price: 18.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    in_stock: false,
    description:
      "Professional-grade pruning shears with sharp, stainless steel blades and comfortable grip handles for precise cutting.",
    quantity: 0,
  },
  {
    id: 7,
    name: "Herb Garden Kit",
    category: "Seeds",
    price: 29.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    in_stock: true,
    description:
      "Complete herb garden starter kit with 6 varieties of herb seeds, biodegradable pots, soil discs, and detailed growing instructions.",
    quantity: 10,
  },
  {
    id: 8,
    name: "Compost Bin",
    category: "Equipment",
    price: 34.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.4,
    in_stock: true,
    description:
      "Durable outdoor compost bin with 80-gallon capacity. Features a secure lid, ventilation system, and easy access door for finished compost.",
    quantity: 8,
  },
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 50]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query)),
      );
    }

    if (selectedTab !== "all") {
      result = result.filter((product) => product.category.toLowerCase() === selectedTab.toLowerCase());
    }

    if (selectedCategories.length > 0) {
      result = result.filter((product) => selectedCategories.includes(product.category));
    }

    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);

    if (inStockOnly) {
      result = result.filter((product) => product.in_stock);
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedTab, selectedCategories, priceRange, inStockOnly]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category],
    );
  };

  const handleFilterChange = (filters: FilterOptions) => {
    setSearchQuery(filters.search);
    setSelectedCategories([filters.category]);
    setPriceRange([filters.minPrice, filters.maxPrice]);
    setInStockOnly(filters.inStock);
  };

  const addToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="container py-8">
      <div className="flex items-start gap-6">
        <div className="w-64 flex-none">
          <ProductFilters onFilterChange={handleFilterChange} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Products</h1>
            <Cart />
          </div>
          {filteredProducts.length === 0 ? (
            <p className="text-center text-muted-foreground">
              No products found matching your criteria
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <Card key={product.id}>
                  {product.image && (
                    <div className="aspect-square relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {product.category}
                        </p>
                      </div>
                      <p className="font-bold">${product.price.toFixed(2)}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => addToCart(product)}
                      disabled={!product.in_stock}
                    >
                      {product.in_stock ? (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </>
                      ) : (
                        "Out of Stock"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}