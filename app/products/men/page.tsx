import { ProductGrid } from "@/components/product-grid"
import { getProductsByCategory } from "@/lib/products"

export default async function MenProductsPage() {
  const products = await getProductsByCategory("men")

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex flex-col items-center text-center space-y-2 mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Men's Collection</h1>
        <p className="text-muted-foreground max-w-[600px]">
          Discover our premium men's sportswear and athletic apparel
        </p>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found in this category</p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
}