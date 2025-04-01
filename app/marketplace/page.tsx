"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Check, Filter, Info, Minus, Moon, Plus, Search, ShoppingBag, ShoppingCart, Sun, X } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/scroll-area"
import { useToast } from "@/hooks/use-toast"

// Product type definition
type Product = {
  id: number
  name: string
  category: string
  price: number
  image: string
  rating: number
  inStock: boolean
  description?: string
  quantity?: number
}

// Initial products data
const products: Product[] = [
  {
    id: 1,
    name: "Organic Tomato Seeds",
    category: "Seeds",
    price: 4.99,
    image: "/farm.jpg",
    rating: 4.5,
    inStock: true,
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
    inStock: true,
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
    inStock: true,
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
    inStock: true,
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
    inStock: false,
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
    inStock: false,
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
    inStock: true,
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
    inStock: true,
    description:
      "Durable outdoor compost bin with 80-gallon capacity. Features a secure lid, ventilation system, and easy access door for finished compost.",
    quantity: 8,
  },
]

// Cart item type
type CartItem = Product & {
  quantity: number
}

export default function MarketplacePage() {
  const { theme, setTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<number[]>([0, 50])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [selectedTab, setSelectedTab] = useState("all")
  const [filteredProducts, setFilteredProducts] = useState(products)

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Product detail modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)

  // Ref for click outside detection
  const cartRef = useRef<HTMLDivElement>(null)

  const { toast } = useToast()

  // Filter products based on search, tabs, and filters
  useEffect(() => {
    let result = [...products]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query)),
      )
    }

    // Apply tab filter
    if (selectedTab !== "all") {
      result = result.filter((product) => product.category.toLowerCase() === selectedTab.toLowerCase())
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter((product) => selectedCategories.includes(product.category))
    }

    // Apply price range filter
    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Apply in-stock filter
    if (inStockOnly) {
      result = result.filter((product) => product.inStock)
    }

    setFilteredProducts(result)
  }, [searchQuery, selectedTab, selectedCategories, priceRange, inStockOnly])

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category],
    )
  }

  // Add to cart function
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)

      if (existingItem) {
        // Update quantity if item already exists
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        // Add new item
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  // Remove from cart function
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  // Update cart item quantity
  const updateCartItemQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
  }

  // Calculate total cart items
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0)

  // Calculate total cart price
  const totalCartPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  // Check if product is in cart
  const isInCart = (productId: number) => {
    return cart.some((item) => item.id === productId)
  }

  // Open product detail modal
  const openProductModal = (product: Product) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }

  // Handle click outside cart dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">FarmMarket</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-[300px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Cart Button with Dropdown */}
            <div className="relative" ref={cartRef}>
              <Button variant="outline" size="icon" onClick={() => setIsCartOpen(!isCartOpen)} className="relative">
                <ShoppingBag className="h-5 w-5" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>

              {/* Cart Dropdown */}
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-background rounded-md shadow-lg border z-50">
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Your Cart</h3>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsCartOpen(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

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
                                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
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
                            // Clear the cart
                            setCart([])
                            // Close the cart dropdown
                            setIsCartOpen(false)
                            // Show success message with toast
                            toast({
                              title: "Checkout successful!",
                              description: "Your order has been placed.",
                            })
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

            <Button asChild variant="default" size="sm">
              <Link href="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6 md:py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <div className="flex items-center gap-2">
              <div className="block md:hidden">
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Narrow down products by category, price, and more.</SheetDescription>
                  </SheetHeader>
                  <div className="py-4 space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Categories</h3>
                      <div className="space-y-2">
                        {["Seeds", "Fertilizers", "Equipment", "Pesticides"].map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={selectedCategories.includes(category)}
                              onCheckedChange={() => handleCategoryChange(category)}
                            />
                            <Label htmlFor={`category-${category}`}>{category}</Label>
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
                          id="in-stock"
                          checked={inStockOnly}
                          onCheckedChange={() => setInStockOnly(!inStockOnly)}
                        />
                        <Label htmlFor="in-stock">In Stock Only</Label>
                      </div>
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button className="w-full">Apply Filters</Button>
                      </SheetClose>
                    </SheetFooter>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="hidden md:block w-[240px] shrink-0 space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Categories</h3>
                <div className="space-y-2">
                  {["Seeds", "Fertilizers", "Equipment", "Pesticides"].map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`desktop-category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
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
              <Button className="w-full">Apply Filters</Button>
            </div>

            <div className="flex-1">
              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => setSelectedTab("all")}>
                    All Products
                  </TabsTrigger>
                  <TabsTrigger value="seeds" onClick={() => setSelectedTab("seeds")}>
                    Seeds
                  </TabsTrigger>
                  <TabsTrigger value="fertilizers" onClick={() => setSelectedTab("fertilizers")}>
                    Fertilizers
                  </TabsTrigger>
                  <TabsTrigger value="equipment" onClick={() => setSelectedTab("equipment")}>
                    Equipment
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden transition-all hover:shadow-md group">
                      <CardHeader className="p-0 cursor-pointer" onClick={() => openProductModal(product)}>
                        <div className="relative h-48 w-full">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                              <Badge variant="outline" className="text-muted-foreground">
                                Out of Stock
                              </Badge>
                            </div>
                          )}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                              <Info className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{product.category}</Badge>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="h-4 w-4 text-yellow-500 mr-1"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {product.rating}
                          </div>
                        </div>
                        <CardTitle
                          className="text-base cursor-pointer hover:text-primary transition-colors"
                          onClick={() => openProductModal(product)}
                        >
                          {product.name}
                        </CardTitle>
                        <div className="mt-2 font-bold">${product.price.toFixed(2)}</div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button
                          className="w-full"
                          disabled={!product.inStock}
                          variant={isInCart(product.id) ? "secondary" : "default"}
                          onClick={() => addToCart(product)}
                        >
                          {isInCart(product.id) ? (
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

      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} FarmMarket. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>

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
                  variant={isInCart(selectedProduct.id) ? "secondary" : "default"}
                  onClick={() => {
                    addToCart(selectedProduct)
                    setIsProductModalOpen(false)
                  }}
                >
                  {isInCart(selectedProduct.id) ? (
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
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}