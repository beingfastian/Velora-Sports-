import Link from "next/link"
import { ShoppingBag, Target, Zap, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FeaturedProducts } from "@/components/featured-products"
import { HeroSection } from "@/components/hero-section"
import { CategorySection } from "@/components/category-section"
import { CustomProductsCTA } from "@/components/custom-products-cta"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
              <CustomProductsCTA />
      <div className="container px-4 mx-auto space-y-20">
        <CategorySection />

        <section className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black">Precision Performance</h3>
              <p className="text-gray-600">Engineered for athletes who demand excellence in every movement</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black">Energy & Strength</h3>
              <p className="text-gray-600">Boost your power with gear designed to enhance your natural abilities</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black">Champion Quality</h3>
              <p className="text-gray-600">Premium materials and construction trusted by professional athletes</p>
            </div>
          </div>
        </section>

        <FeaturedProducts />



        <div className="flex flex-col items-center justify-center space-y-6 text-center py-16 bg-black rounded-3xl text-white">
          <h2 className="text-4xl font-bold tracking-tight">Ready to Elevate Your Game?</h2>
          <p className="max-w-[600px] text-xl text-gray-300">
            Join thousands of athletes who trust Velora Sports for their performance needs.
          </p>
          <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg rounded-full">
            <Link href="/products">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Shop Collection
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
