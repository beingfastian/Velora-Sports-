"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="relative bg-white overflow-hidden">
      <div
        className="fixed w-64 h-64 bg-black rounded-full opacity-5 blur-3xl pointer-events-none transition-all duration-300 ease-out z-10"
        style={{
          left: mousePosition.x - 128,
          top: mousePosition.y - 128,
        }}
      />

      <div className="absolute top-20 right-10 w-32 h-32 bg-black rounded-full opacity-10 blur-xl"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-gray-800 rounded-full opacity-5 blur-lg"></div>

      <div className="container px-4 mx-auto py-20 lg:py-32 relative z-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black leading-tight">
            ELEVATE YOUR
            <span className="block text-gray-600">PERFORMANCE</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Premium athletic gear designed for champions. Strength, energy, and health in every product.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-full">
              <Link href="/products">Shop Collection</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-black text-black hover:bg-black hover:text-white px-8 py-6 text-lg rounded-full bg-transparent"
            >
              <Link href="/products/new">New Arrivals</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="relative py-16 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-60">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg mx-auto flex items-center justify-center">
                <div className="w-12 h-12 bg-black rounded-lg"></div>
              </div>
              <p className="text-sm font-medium text-gray-600">Athletic Wear</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg mx-auto flex items-center justify-center">
                <div className="w-12 h-8 bg-gray-800 rounded-full"></div>
              </div>
              <p className="text-sm font-medium text-gray-600">Footwear</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg mx-auto flex items-center justify-center">
                <div className="w-10 h-10 bg-black rounded-full border-4 border-gray-300"></div>
              </div>
              <p className="text-sm font-medium text-gray-600">Equipment</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-lg mx-auto flex items-center justify-center">
                <div className="w-12 h-6 bg-gradient-to-r from-black to-gray-600 rounded-lg"></div>
              </div>
              <p className="text-sm font-medium text-gray-600">Accessories</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
