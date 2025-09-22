"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchingProducts, setFetchingProducts] = useState(true)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    sizes: "",
    colors: "",
    inStock: true,
    featured: false,
  })

  const [imageFiles, setImageFiles] = useState<FileList | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setFetchingProducts(true)
      const productsRef = collection(db, "products")
      const q = query(productsRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Product[]
      
      setProducts(productsData)
      console.log("Fetched products:", productsData.length)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setFetchingProducts(false)
    }
  }

  const uploadImages = async (files: FileList): Promise<string[]> => {
    console.log("Uploading", files.length, "images...")
    const uploadPromises = Array.from(files).map(async (file, index) => {
      try {
        const fileName = `${Date.now()}_${index}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
        const storageRef = ref(storage, `products/${fileName}`)
        
        console.log(`Uploading image ${index + 1}:`, fileName)
        const snapshot = await uploadBytes(storageRef, file)
        const downloadURL = await getDownloadURL(snapshot.ref)
        console.log(`Image ${index + 1} uploaded successfully:`, downloadURL)
        return downloadURL
      } catch (error) {
        console.error(`Error uploading image ${index + 1}:`, error)
        throw new Error(`Failed to upload image: ${file.name}`)
      }
    })

    return Promise.all(uploadPromises)
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "Product name is required", variant: "destructive" })
      return false
    }
    if (!formData.description.trim()) {
      toast({ title: "Error", description: "Product description is required", variant: "destructive" })
      return false
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast({ title: "Error", description: "Valid price is required", variant: "destructive" })
      return false
    }
    if (!formData.category) {
      toast({ title: "Error", description: "Category is required", variant: "destructive" })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      console.log("Starting product save process...")
      
      let imageUrls: string[] = []
      if (imageFiles && imageFiles.length > 0) {
        console.log("Uploading images...")
        imageUrls = await uploadImages(imageFiles)
        console.log("Images uploaded successfully:", imageUrls)
      } else if (editingProduct) {
        imageUrls = editingProduct.images || []
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category as Product["category"],
        subcategory: formData.subcategory?.trim() || null,
        sizes: formData.sizes ? formData.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [],
        colors: formData.colors ? formData.colors.split(",").map((c) => c.trim()).filter(Boolean) : [],
        inStock: formData.inStock,
        featured: formData.featured,
        images: imageUrls,
        updatedAt: new Date(),
      }

      console.log("Product data to save:", productData)

      if (editingProduct) {
        console.log("Updating existing product:", editingProduct.id)
        await updateDoc(doc(db, "products", editingProduct.id), productData)
        toast({
          title: "Success",
          description: "Product updated successfully",
        })
      } else {
        console.log("Adding new product...")
        const docRef = await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: new Date(),
        })
        console.log("New product added with ID:", docRef.id)
        toast({
          title: "Success",
          description: "Product added successfully",
        })
      }

      resetForm()
      setIsDialogOpen(false)
      console.log("Refreshing products list...")
      await fetchProducts()
      
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product: Product) => {
    console.log("Editing product:", product.id)
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      category: product.category,
      subcategory: product.subcategory || "",
      sizes: product.sizes?.join(", ") || "",
      colors: product.colors?.join(", ") || "",
      inStock: product.inStock,
      featured: product.featured,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      console.log("Deleting product:", productId)
      await deleteDoc(doc(db, "products", productId))
      toast({
        title: "Success",
        description: "Product deleted successfully",
      })
      await fetchProducts()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "",
      subcategory: "",
      sizes: "",
      colors: "",
      inStock: true,
      featured: false,
    })
    setImageFiles(null)
    setEditingProduct(null)
    
    const fileInput = document.getElementById('images') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleDialogClose = () => {
    if (!loading) {
      resetForm()
      setIsDialogOpen(false)
    }
  }

  const handleAddProduct = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  if (fetchingProducts) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading products...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button onClick={handleAddProduct}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found. Add your first product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>{product.category}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">${product.price}</p>
                  {product.originalPrice && (
                    <p className="text-sm text-gray-500 line-through">${product.originalPrice}</p>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {product.featured && <Badge variant="secondary">Featured</Badge>}
                    <Badge variant={product.inStock ? "default" : "destructive"}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  {product.images && product.images.length > 0 && (
                    <div className="text-xs text-gray-500">
                      {product.images.length} image(s)
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update product information" : "Add a new product to your store"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price ($)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sizes">Sizes (comma separated)</Label>
                <Input
                  id="sizes"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  placeholder="XS, S, M, L, XL"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="colors">Colors (comma separated)</Label>
                <Input
                  id="colors"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  placeholder="Black, White, Red"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory (optional)</Label>
              <Input
                id="subcategory"
                value={formData.subcategory}
                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Product Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImageFiles(e.target.files)}
                disabled={loading}
              />
              <p className="text-xs text-gray-500">
                {editingProduct ? "Leave empty to keep existing images" : "Select one or more images"}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="inStock"
                  checked={formData.inStock}
                  onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                  disabled={loading}
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  disabled={loading}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingProduct ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingProduct ? "Update Product" : "Add Product"
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleDialogClose}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}