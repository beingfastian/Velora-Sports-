import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

export function CategorySection() {
  const categories = [
    {
      name: "Training Gear",
      image: "/modern-training-equipment-weights-dumbbells.png",
      href: "/products/training",
    },
    {
      name: "Running Essentials",
      image: "/running-shoes-and-athletic-wear.png",
      href: "/products/running",
    },
    {
      name: "Sports Equipment",
      image: "/sports-balls-equipment-gym-accessories.png",
      href: "/products/equipment",
    },
  ]

  return (
    <section className="space-y-12 py-16">
      <div className="flex flex-col items-center text-center space-y-4">
        <h2 className="text-4xl font-bold tracking-tight text-black">Shop by Category</h2>
        <p className="text-gray-600 max-w-[600px] text-lg">
          Discover premium athletic gear designed for peak performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link key={category.name} href={category.href}>
            <Card className="overflow-hidden h-[350px] transition-all hover:shadow-xl rounded-2xl border-0 shadow-lg">
              <CardContent className="p-0 h-full relative">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 hover:scale-105"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-3xl font-bold text-white tracking-wide">{category.name}</h3>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
