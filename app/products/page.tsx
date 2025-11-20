import { ProductGrid } from "@/components/product-grid"
import { getAllProducts } from "@/lib/products"

export default async function ProductsPage() {
  const products = await getAllProducts()

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex flex-col items-center text-center space-y-2 mb-12">
        <h1 className="text-3xl font-bold tracking-tight">All Products</h1>
        <p className="text-muted-foreground max-w-[600px]">
          Browse our complete collection of premium sportswear
        </p>
      </div>
      <ProductGrid products={products} />
    </div>
  )
}