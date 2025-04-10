"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Check, Minus, Moon, Plus, ShoppingBag, ShoppingCart, Sun, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Product type definition
type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  inStock: boolean;
  description?: string;
  quantity?: number;
};

// Cart item type
type CartItem = Product & {
  quantity: number;
};

export default function MarketplacePage() {
  const { theme, setTheme } = useTheme();
  const [addedToCart, setAddedToCart] = useState<number[]>([]); // Tracks product IDs added to the cart
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // State for selected product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false); // State for modal

  const cartRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...(selectedCategories.length > 0 && { category: selectedCategories.join(",") }),
        ...(priceRange[0] !== undefined && { priceMin: priceRange[0].toString() }),
        ...(priceRange[1] !== undefined && { priceMax: priceRange[1].toString() }),
        ...(inStockOnly && { inStock: "true" }),
      }).toString();

      const response = await fetch(`/api/products?${queryParams}`);
      const data = await response.json();

      const parsedData = data.map((product: Product) => ({
        ...product,
        price: isNaN(Number(product.price)) ? 0 : Number(product.price),
        quantity: product.quantity ?? 0,
        inStock: product.inStock ?? (product.quantity ?? 0) > 0,
      }));

      setProducts(parsedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch products on filters change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategories, priceRange, inStockOnly]);

  // Add to cart function
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    setAddedToCart((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedToCart((prev) => prev.filter((id) => id !== product.id));
    }, 2000); 
  };

  // Remove from cart function
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Update cart item quantity
  const updateCartItemQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculate total cart items
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Calculate total cart price
  const totalCartPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Handle click outside cart dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Open product detail modal
  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">FarmMarket</span>
          </Link>
          <div className="flex items-center gap-4">
            {/* Back to Dashboard Button */}
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Back to Dashboard
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Cart Button with Dropdown */}
            <div className="relative" ref={cartRef}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </Button>

              {/* Cart Dropdown */}
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-background rounded-md shadow-lg border z-50">
                  {cart.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p>Your cart is empty</p>
                    </div>
                  ) : (
                    <>
                      <ScrollArea className="max-h-[300px]">
                        <div className="p-4 space-y-4">
                          {cart.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  ${isNaN(item.price) ? "N/A" : item.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="flex items-center">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center text-sm">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="p-4 border-t">
                        <div className="flex justify-between mb-4">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold">${totalCartPrice.toFixed(2)}</span>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => {
                            setCart([]);
                            setIsCartOpen(false);
                            toast({
                              title: "Checkout successful!",
                              description: "Your order has been placed.",
                            });
                          }}
                        >
                          Checkout
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Marketplace</h1>
        </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="hidden md:block w-[240px] shrink-0 space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Categories</h3>
                <div className="space-y-2">
                  {["seeds", "fertilizers", "equipment", "pesticides"].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`desktop-category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() =>
                          setSelectedCategories((prev) =>
                            prev.includes(category)
                              ? prev.filter((item) => item !== category)
                              : [...prev, category]
                          )
                        }
                      />
                      <Label htmlFor={`desktop-category-${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Price Range</h3>
                  <span className="text-sm text-muted-foreground">
                    ${priceRange[0]} - ${priceRange[1]}
                  </span>
                </div>
                <Slider value={priceRange} max={100} step={1} onValueChange={setPriceRange} />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Availability</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="desktop-in-stock"
                    checked={inStockOnly}
                    onCheckedChange={() => setInStockOnly(!inStockOnly)}
                  />
                  <Label htmlFor="desktop-in-stock">In Stock Only</Label>
                </div>
              </div>
            </div>

            <div className="flex-1">
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-muted-foreground">Try adjusting your filter criteria</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      className="overflow-hidden transition-all hover:shadow-md group cursor-pointer"
                      onClick={() => openProductModal(product)}
                    >
                      <CardHeader className="p-0">
                        <div className="relative h-48 w-full">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                              <Badge variant="destructive" className="text-muted-foreground">
                                Out of Stock
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{product.category}</Badge>
                        </div>
                        <CardTitle className="text-base">{product.name}</CardTitle>
                        <div className="mt-2 font-bold">${product.price.toFixed(2)}</div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full"
                        disabled={!product.inStock || addedToCart.includes(product.id)}
                        variant={addedToCart.includes(product.id) ? "secondary" : "default"}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                      >
                        {addedToCart.includes(product.id) ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Added to Cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Add to Cart
                          </>
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
      </main>

      {/* Product Detail Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
                <DialogDescription>
                  {selectedProduct.category} • ${selectedProduct.price.toFixed(2)}
                </DialogDescription>
              </DialogHeader>
              <div className="relative h-56 w-full my-4">
                <Image
                  src={selectedProduct.image || "/placeholder.svg"}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedProduct.description || "No description available."}
                  </p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Status</h4>
                    <Badge variant={selectedProduct.inStock ? "default" : "destructive"}>
                      {selectedProduct.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Available Quantity</h4>
                    <p className="text-sm">{selectedProduct.quantity || 0} units</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="w-full"
                  disabled={!selectedProduct.inStock}
                  variant="default"
                  onClick={() => {
                    addToCart(selectedProduct);
                    setIsProductModalOpen(false);
                  }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}