'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Globe,
  Leaf,
  Menu,
  Moon,
  ShoppingCart,
  Sun,
  Truck,
  Users,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useMobile } from "@/hooks/use-mobile"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const isMobile = useMobile()
  const [mounted, setMounted] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    // Check if user is logged in
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token') || document.cookie.includes('token=')
        setIsLoggedIn(!!token)
      } catch (e) {
        console.error('Error checking authentication:', e)
        setIsLoggedIn(false)
      }
    }
    
    checkAuth()
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">FarmMarket</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="#benefits" className="text-sm font-medium transition-colors hover:text-primary">
              Benefits
            </Link>
            <Link href="#testimonials" className="text-sm font-medium transition-colors hover:text-primary">
              Testimonials
            </Link>
            <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </Link>
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button variant="default" size="sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="mr-2">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="default" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Mobile menu, show/hide based on menu state */}
          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <div className="w-full max-w-md overflow-hidden rounded-lg bg-background p-6 text-left align-middle shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl">FarmMarket</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                        <X className="h-6 w-6" />
                      </Button>
                    </div>
                    <div className="mt-4 flex flex-col">
                      <Link href="/" className="block py-2 px-3 text-base font-medium transition-colors hover:text-primary">
                        Home
                      </Link>
                      <Link href="#benefits" className="block py-2 px-3 text-base font-medium transition-colors hover:text-primary">
                        Benefits
                      </Link>
                      <Link href="#testimonials" className="block py-2 px-3 text-base font-medium transition-colors hover:text-primary">
                        Testimonials
                      </Link>
                      <Link href="#features" className="block py-2 px-3 text-base font-medium transition-colors hover:text-primary">
                        Features
                      </Link>
                      {isLoggedIn ? (
                        <Link href="/dashboard">
                          <Button variant="default" className="w-full mt-4">
                            Dashboard
                          </Button>
                        </Link>
                      ) : (
                        <>
                          <Link href="/auth/login">
                            <Button variant="outline" className="w-full mt-4">
                              Login
                            </Button>
                          </Link>
                          <Link href="/auth/register">
                            <Button variant="default" className="w-full mt-4">
                              Sign Up
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Fresh From Farms to Your Table
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Connect directly with local farmers and get fresh, sustainable produce delivered straight to your door.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-4">
                <Button asChild size="lg" className="flex items-center gap-2">
                  <Link href={isLoggedIn ? "/dashboard" : "/auth/register"}>
                    {isLoggedIn ? "Go to Dashboard" : "Get Started"} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/marketplace">
                    Browse Marketplace
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Organic Produce</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Local Farmers</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Fair Pricing</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/farm.jpg"
                alt="Farm landscape with fresh produce"
                width={550}
                height={550}
                className="aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                Benefits
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose FarmMarket?</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Skip the middleman and connect directly with local farmers for fresher, healthier, and more sustainable food options.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 md:gap-8">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold">Fast Delivery</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  From farm to your doorstep in record time, ensuring freshness.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Leaf className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold">Organic & Sustainable</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Supporting eco-friendly farming practices and organically grown produce.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold">Support Local Farmers</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Direct purchase ensuring farmers receive fair compensation for their work.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                Testimonials
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Customers Say</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Hear from our happy customers about their experience with FarmMarket.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="grid gap-1">
                    <p className="text-sm font-medium">★★★★★</p>
                    <h3 className="font-bold">Sarah Thompson</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      "The vegetables I get from FarmMarket are so much fresher than what I find at the supermarket. Plus, I love knowing I'm supporting local farmers."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="grid gap-1">
                    <p className="text-sm font-medium">★★★★★</p>
                    <h3 className="font-bold">David Chen</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      "As a chef, quality ingredients make all the difference. The organic produce from FarmMarket has elevated my cooking to another level."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="grid gap-1">
                    <p className="text-sm font-medium">★★★★★</p>
                    <h3 className="font-bold">Maria Rodriguez</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      "I've been searching for a way to get farm-fresh produce easily, and FarmMarket has exceeded my expectations. The delivery is always on time!"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our platform offers a comprehensive suite of features to connect farmers and consumers seamlessly.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2">
            <div className="grid gap-2">
              <h3 className="text-xl font-bold">For Consumers</h3>
              <ul className="grid gap-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Browse products by category, farm, or season</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Schedule deliveries at your convenience</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Learn about the farmers and their practices</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Transparent pricing with no hidden fees</span>
                </li>
              </ul>
            </div>
            <div className="grid gap-2">
              <h3 className="text-xl font-bold">For Farmers</h3>
              <ul className="grid gap-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Create your farm profile and showcase your products</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Manage inventory and pricing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Direct communication with customers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Analytics to optimize your business</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Taste the Difference?</h2>
              <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                Join FarmMarket today and start enjoying fresh, local produce while supporting sustainable farming.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" variant="secondary" className="gap-2 bg-white text-primary hover:bg-white/90">
                <Link href={isLoggedIn ? "/dashboard" : "/auth/register"}>
                  {isLoggedIn ? "Go to Dashboard" : "Join Now"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">FarmMarket</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Connecting farmers to customers for a sustainable future.
              </p>
            </div>
            <nav className="grid gap-2">
              <h3 className="text-sm font-medium">Platform</h3>
              <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                How It Works
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                Pricing
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                FAQ
              </Link>
            </nav>
            <nav className="grid gap-2">
              <h3 className="text-sm font-medium">Company</h3>
              <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                About Us
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                Blog
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                Careers
              </Link>
            </nav>
            <nav className="grid gap-2">
              <h3 className="text-sm font-medium">Legal</h3>
              <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:underline dark:text-gray-400">
                Cookie Policy
              </Link>
            </nav>
          </div>
          <div className="mt-8 border-t pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} FarmMarket. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
