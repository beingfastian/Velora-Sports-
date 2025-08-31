"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart-provider"

const products = [
  {
    id: 1,
    name: "Pro Training Shorts",
    price: 49.99,
    image: "/black-athletic-training-shorts.png",
    category: "training",
    isNew: true,
  },
  {
    id: 2,
    name: "Performance Running Shoes",
    price: 129.99,
    image: "/modern-running-shoes-athletic-footwear.png",
    category: "running",
    isNew: false,
  },
  {
    id: 3,
    name: "Wireless Sport Headphones",
    price: 89.99,
    image: "/wireless-sports-headphones-black.png",
    category: "equipment",
    isNew: true,
  },
  {
    id: 4,
    name: "Compression Tank Top",
    price: 39.99,
    image: "/athletic-compression-tank-top.png",
    category: "training",
    isNew: false,
  },
]

export function FeaturedProducts() {
  return (
    <section className="space-y-12 py-16 bg-gray-50">
      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-4xl font-bold tracking-tight text-black">Featured Products</h2>
        <p className="text-gray-600 max-w-[600px] text-lg">Premium athletic gear trusted by champions</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <Card className="overflow-hidden group shadow-lg rounded-2xl border-0 bg-white">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.isNew && <Badge className="absolute top-3 right-3 bg-black text-white rounded-full">New</Badge>}
        </div>
      </Link>
      <CardContent className="p-6">
        <Link href={`/products/${product.id}`} className="hover:underline">
          <h3 className="font-bold text-lg text-black">{product.name}</h3>
        </Link>
        <p className="font-bold mt-2 text-xl text-gray-800">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          className="w-full bg-black text-white hover:bg-gray-800 rounded-full py-6"
          size="sm"
          onClick={() => addToCart(product)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
