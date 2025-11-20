"use client"

import { useState, useEffect } from "react"
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  query,
  orderBy as firestoreOrderBy,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Download, Mail, Eye, ChevronDown, ChevronUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"

interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  selectedSize: string
  selectedColor: string
  image: string
}

interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  address: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface Order {
  id: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingAddress: ShippingAddress
  paymentMethod: {
    type: string
    cardName?: string
  }
  shippingMethod: string
  status: OrderStatus
  createdAt: Date
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const ordersRef = collection(db, "orders")
      const q = query(ordersRef, firestoreOrderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      const ordersData: Order[] = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data()

        return {
          id: docSnap.id,
          items: data.items || [],
          subtotal: data.subtotal || 0,
          shipping: data.shipping || 0,
          tax: data.tax || 0,
          total: data.total || 0,
          shippingAddress: data.shippingAddress || {
            fullName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
          },
          paymentMethod: data.paymentMethod || { type: "card" },
          shippingMethod: data.shippingMethod || "standard",
          status: data.status || "pending",
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : new Date(),
        } as Order
      })

      setOrders(ordersData)
    } catch (error) {
      console.error("Fetch error:", error)
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status })

      toast({
        title: "Success",
        description: "Order status updated successfully",
      })

      fetchOrders()
    } catch (error) {
      console.error("Update error:", error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const toggleOrderExpand = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  const downloadCustomImage = (imageUrl: string, orderId: string) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `custom-product-${orderId}.png`
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const sendEmailToCustomer = async (order: Order) => {
    setSelectedOrder(order)
    setEmailDialogOpen(true)
    
    // Simulate email sending
    setTimeout(() => {
      toast({
        title: "Email Sent",
        description: `Order confirmation sent to ${order.shippingAddress.email}`,
      })
      setEmailDialogOpen(false)
    }, 1500)
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending": return "secondary"
      case "confirmed": return "default"
      case "shipped": return "outline"
      case "delivered": return "default"
      case "cancelled": return "destructive"
      default: return "default"
    }
  }

  const isCustomProduct = (item: OrderItem) => {
    return item.productId.startsWith("custom-")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading orders...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Order Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {orders.length} Total Orders
        </Badge>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expandedOrders.has(order.id)
            const hasCustomProducts = order.items.some(isCustomProduct)

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-base">
                          #{order.id.slice(-8).toUpperCase()}
                        </CardTitle>
                        <Badge variant={getStatusColor(order.status)}>
                          {order.status.toUpperCase()}
                        </Badge>
                        {hasCustomProducts && (
                          <Badge variant="secondary">Custom Design</Badge>
                        )}
                      </div>
                      <CardDescription className="mt-1">
                        {order.createdAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" • "}
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                        {" • "}
                        ${order.total.toFixed(2)}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sendEmailToCustomer(order)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleOrderExpand(order.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Order Items */}
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3 text-sm">Order Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex gap-3 p-3 rounded-lg bg-muted/50"
                            >
                              <div className="relative w-16 h-16 rounded overflow-hidden bg-white flex-shrink-0">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{item.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {item.selectedSize && `Size: ${item.selectedSize}`}
                                      {item.selectedColor && ` • ${item.selectedColor}`}
                                    </p>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-medium">
                                      ${item.price.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>
                                </div>

                                {isCustomProduct(item) && (
                                  <div className="flex gap-2 mt-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs"
                                      onClick={() => setSelectedImage(item.image)}
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      View
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs"
                                      onClick={() => downloadCustomImage(item.image, order.id)}
                                    >
                                      <Download className="h-3 w-3 mr-1" />
                                      Download
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer & Shipping */}
                      <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Customer</h4>
                          <div className="text-sm space-y-1">
                            <p className="font-medium">{order.shippingAddress.fullName}</p>
                            <p className="text-muted-foreground">{order.shippingAddress.email}</p>
                            <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 text-sm">Shipping Address</h4>
                          <div className="text-sm text-muted-foreground space-y-0.5">
                            <p>{order.shippingAddress.address}</p>
                            {order.shippingAddress.apartment && (
                              <p>{order.shippingAddress.apartment}</p>
                            )}
                            <p>
                              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                              {order.shippingAddress.zipCode}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Order Summary & Actions */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          Payment: {order.paymentMethod.type.toUpperCase()} • Shipping:{" "}
                          {order.shippingMethod === "express" ? "Express" : "Standard"}
                        </div>

                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            updateOrderStatus(order.id, value as OrderStatus)
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Custom Product Design</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative w-full aspect-square">
              <Image
                src={selectedImage}
                alt="Custom design"
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Email Confirmation Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sending Email...</DialogTitle>
            <DialogDescription>
              Sending order confirmation to {selectedOrder?.shippingAddress.email}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}