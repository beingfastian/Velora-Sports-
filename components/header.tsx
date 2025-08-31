"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, Search, ShoppingCart, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/components/cart-provider"
import { MarqueeBanner } from "@/components/marquee-banner"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { cartItems } = useCart()
  const cartItemCount = cartItems.length

  return (
    <>
      <MarqueeBanner />

      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium">
                  Home
                </Link>
                <Link href="/products" className="text-lg font-medium">
                  All Products
                </Link>
                <Link href="/products/men" className="text-lg font-medium">
                  Men
                </Link>
                <Link href="/products/women" className="text-lg font-medium">
                  Women
                </Link>
                <Link href="/products/training" className="text-lg font-medium">
                  Training
                </Link>
                <Link href="/products/running" className="text-lg font-medium">
                  Running
                </Link>
                <Link href="/products/equipment" className="text-lg font-medium">
                  Equipment
                </Link>
                <Link href="/about" className="text-lg font-medium">
                  About
                </Link>
                <Link href="/contact" className="text-lg font-medium">
                  Contact
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-black tracking-tight">VELORA</span>
            <span className="text-2xl font-light text-gray-600">SPORTS</span>
          </Link>

          <nav className="flex-1 hidden md:flex items-center justify-center gap-8 text-sm">
            <Link href="/" className="font-medium transition-colors hover:text-black">
              Home
            </Link>
            <Link href="/products" className="font-medium transition-colors hover:text-black">
              All Products
            </Link>
            <Link href="/products/men" className="font-medium transition-colors hover:text-black">
              Men
            </Link>
            <Link href="/products/women" className="font-medium transition-colors hover:text-black">
              Women
            </Link>
            <Link href="/products/training" className="font-medium transition-colors hover:text-black">
              Training
            </Link>
            <Link href="/products/running" className="font-medium transition-colors hover:text-black">
              Running
            </Link>
            <Link href="/products/equipment" className="font-medium transition-colors hover:text-black">
              Equipment
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {isSearchOpen ? (
              <div className="relative flex items-center">
                <Input type="search" placeholder="Search products..." className="w-[200px] md:w-[300px]" autoFocus />
                <Button variant="ghost" size="icon" className="absolute right-0" onClick={() => setIsSearchOpen(false)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close search</span>
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}

            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {cartItemCount}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
