"use client"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Filter, Moon, Search, ShoppingCart, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const products = [
  {
    id: 1,
    name: "Organic Tomato Seeds",
    category: "Seeds",
    price: 4.99,
    //image: "/placeholder.svg?height=200&width=200",
    image: "/farm.jpg",
    rating: 4.5,
    inStock: true,
  },
  {
    id: 2,
    name: "Natural Fertilizer",
    category: "Fertilizers",
    price: 19.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.2,
    inStock: true,
  },
  {
    id: 3,
    name: "Garden Trowel Set",
    category: "Equipment",
    price: 24.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.8,
    inStock: true,
  },
  {
    id: 4,
    name: "Heirloom Carrot Seeds",
    category: "Seeds",
    price: 3.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.3,
    inStock: true,
  },
  {
    id: 5,
    name: "Organic Pest Control",
    category: "Pesticides",
    price: 14.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.0,
    inStock: false,
  },
  {
    id: 6,
    name: "Pruning Shears",
    category: "Equipment",
    price: 18.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.7,
    inStock: true,
  },
  {
    id: 7,
    name: "Herb Garden Kit",
    category: "Seeds",
    price: 29.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.9,
    inStock: true,
  },
  {
    id: 8,
    name: "Compost Bin",
    category: "Equipment",
    price: 34.99,
    image: "/placeholder.svg?height=200&width=200",
    rating: 4.4,
    inStock: true,
  },
]

export default function MarketplacePage() {
  const { theme, setTheme } = useTheme()

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
              <Input type="search" placeholder="Search products..." className="w-[300px] pl-8" />
            </div>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="outline" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
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
                            <Checkbox id={`category-${category}`} />
                            <Label htmlFor={`category-${category}`}>{category}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Price Range</h3>
                        <span className="text-sm text-muted-foreground">$0 - $50</span>
                      </div>
                      <Slider defaultValue={[50]} max={100} step={1} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Availability</h3>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="in-stock" />
                        <Label htmlFor="in-stock">In Stock Only</Label>
                      </div>
                    </div>
                    <Button className="w-full">Apply Filters</Button>
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
                      <Checkbox id={`desktop-category-${category}`} />
                      <Label htmlFor={`desktop-category-${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Price Range</h3>
                  <span className="text-sm text-muted-foreground">$0 - $50</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Availability</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox id="desktop-in-stock" />
                  <Label htmlFor="desktop-in-stock">In Stock Only</Label>
                </div>
              </div>
              <Button className="w-full">Apply Filters</Button>
            </div>

            <div className="flex-1">
              <Tabs defaultValue="all" className="mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Products</TabsTrigger>
                  <TabsTrigger value="seeds">Seeds</TabsTrigger>
                  <TabsTrigger value="fertilizers">Fertilizers</TabsTrigger>
                  <TabsTrigger value="equipment">Equipment</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden transition-all hover:shadow-md">
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
                            <Badge variant="outline" className="text-muted-foreground">
                              Out of Stock
                            </Badge>
                          </div>
                        )}
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
                      <CardTitle className="text-base">{product.name}</CardTitle>
                      <div className="mt-2 font-bold">${product.price.toFixed(2)}</div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button className="w-full" disabled={!product.inStock}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
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
    </div>
  )
}

