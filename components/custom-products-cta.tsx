"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Palette, Shirt } from "lucide-react"

export function CustomProductsCTA() {
  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[500px]">
            {/* Left side - Content */}
            <div className="p-8 lg:p-16 space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Design Your
                  <span className="block text-gray-300">Perfect Gear</span>
                </h2>
                <p className="text-xl text-gray-400 leading-relaxed">
                  Create custom athletic wear that matches your style and performance needs. From colors to cuts, make
                  it uniquely yours.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg rounded-full"
                >
                  <Link href="/custom">
                    <Palette className="w-5 h-5 mr-2" />
                    Start Customizing
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg rounded-full bg-transparent"
                >
                  <Link href="/custom/gallery">View Examples</Link>
                </Button>
              </div>
            </div>

            {/* Right side - 3D Shirt */}
            <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center p-8">
              <div className="relative">
                {/* 3D Shirt placeholder with enhanced styling */}
                <div className="w-64 h-80 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-500">
                  <div className="absolute inset-4 bg-white rounded-xl shadow-inner flex items-center justify-center">
                    <Shirt className="w-24 h-24 text-gray-600" />
                  </div>
                  {/* Mock design elements */}
                  <div className="absolute top-8 left-8 w-16 h-4 bg-black rounded-full opacity-80"></div>
                  <div className="absolute bottom-12 right-8 w-12 h-12 bg-red-500 rounded-full opacity-90"></div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-6 -right-6 w-6 h-6 bg-green-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
