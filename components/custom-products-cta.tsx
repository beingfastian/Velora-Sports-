"use client"

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Palette, Shirt } from "lucide-react";
import ShirtCustomizer from "./customizer/ShirtCustomizer";

export function CustomProductsCTA() {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  return (
    <>
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
                    Create custom athletic wear with our advanced 3D designer. Customize colors, add text, upload logos, and see your design come to life in real-time.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => setIsCustomizerOpen(true)}
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    <Palette className="w-5 h-5 mr-2" />
                    Start Designing
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg rounded-full bg-transparent transition-all duration-300"
                  >
                    <Link href="/gallery">View Examples</Link>
                  </Button>
                </div>

                <div className="flex items-center space-x-6 text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">Real-time 3D Preview</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm">Instant Download</span>
                  </div>
                </div>
              </div>

              {/* Right side - 3D Shirt Preview */}
              <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center p-8">
                <div className="relative">
                  {/* Enhanced 3D Shirt placeholder */}
                  <div className="w-64 h-80 bg-gradient-to-br from-gray-100 to-gray-300 rounded-2xl shadow-2xl transform rotate-12 hover:rotate-6 transition-all duration-500 hover:scale-105">
                    <div className="absolute inset-4 bg-white rounded-xl shadow-inner flex items-center justify-center overflow-hidden">
                      <Shirt className="w-24 h-24 text-gray-600" />
                      
                      {/* Animated design elements */}
                      <div className="absolute top-4 left-4 w-12 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-80 animate-pulse"></div>
                      <div className="absolute bottom-8 right-4 w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full opacity-90 animate-bounce"></div>
                      
                      {/* Mock text */}
                      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 opacity-60">
                        YOUR DESIGN
                      </div>
                    </div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse"></div>
                  </div>

                  {/* Floating design elements */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full animate-pulse shadow-lg"></div>
                  <div className="absolute -bottom-6 -right-6 w-6 h-6 bg-green-500 rounded-full animate-bounce shadow-lg"></div>
                  <div className="absolute top-1/3 -right-4 w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
                  
                  {/* Orbiting elements */}
                  <div className="absolute inset-0 animate-spin-slow">
                    <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-500 rounded-full transform -translate-x-1/2"></div>
                  </div>
                </div>

                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Shirt Customizer Modal */}
      <ShirtCustomizer 
        isOpen={isCustomizerOpen} 
        onClose={() => setIsCustomizerOpen(false)} 
      />
    </>
  );
}