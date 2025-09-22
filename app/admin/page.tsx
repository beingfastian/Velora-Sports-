"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase" // Make sure you export db from your firebase config
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductManagement } from "@/components/admin/product-management"
import { OrderManagement } from "@/components/admin/order-management"
import { PromoCodeManagement } from "@/components/admin/promo-code-management"
import { LogOut, Package, ShoppingCart, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AdminUser {
  id: string
  username: string
  password: string // In production, this should be hashed!
  role: string
  isActive: boolean
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null)
  const { toast } = useToast()

  // Check if user is already logged in (using localStorage for session persistence)
  useEffect(() => {
    const savedAdmin = localStorage.getItem('adminSession')
    if (savedAdmin) {
      const adminData = JSON.parse(savedAdmin)
      setCurrentAdmin(adminData)
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Query Firestore for admin credentials
      const adminsRef = collection(db, "admins")
      const q = query(
        adminsRef, 
        where("username", "==", username),
        where("password", "==", password), // In production, hash the password before comparing
        where("isActive", "==", true)
      )
      
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        // Admin found and credentials match
        const adminDoc = querySnapshot.docs[0]
        const adminData = { id: adminDoc.id, ...adminDoc.data() } as AdminUser
        
        setCurrentAdmin(adminData)
        setIsAuthenticated(true)
        
        // Save session to localStorage
        localStorage.setItem('adminSession', JSON.stringify(adminData))
        
        toast({
          title: "Success",
          description: `Welcome back, ${adminData.username}!`,
        })
      } else {
        // Invalid credentials
        toast({
          title: "Error",
          description: "Invalid username or password",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentAdmin(null)
    setUsername("")
    setPassword("")
    localStorage.removeItem('adminSession')
    
    toast({
      title: "Success",
      description: "Logged out successfully",
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Sign in to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Velora Sports Admin</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {currentAdmin?.username}
            </span>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="promos">
              <Tag className="w-4 h-4 mr-2" />
              Promo Codes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="promos">
            <PromoCodeManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}