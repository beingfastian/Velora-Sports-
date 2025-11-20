"use client"

import { useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("")
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const { toast } = useToast()

  const trackOrder = async () => {
    if (!orderId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order ID",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const orderDoc = await getDoc(doc(db, "orders", orderId.trim()))
      
      if (!orderDoc.exists()) {
        toast({
          title: "Not Found",
          description: "Order ID not found",
          variant: "destructive",
        })
        setOrder(null)
      } else {
        setOrder({ id: orderDoc.id, ...orderDoc.data() })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to track order",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Package className="h-5 w-5" />
      case "confirmed": return <CheckCircle className="h-5 w-5" />
      case "shipped": return <Truck className="h-5 w-5" />
      case "delivered": return <CheckCircle className="h-5 w-5 text-green-600" />
      case "cancelled": return <XCircle className="h-5 w-5 text-red-600" />
      default: return <Package className="h-5 w-5" />
    }
  }

  return (
    <div className="container px-4 py-12 mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Track Your Order</CardTitle>
          <CardDescription>Enter your order ID to track your shipment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderId">Order ID</Label>
            <div className="flex gap-2">
              <Input
                id="orderId"
                placeholder="Enter order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && trackOrder()}
              />
              <Button onClick={trackOrder} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}
              </Button>
            </div>
          </div>

          {order && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Order #{order.id.slice(-8).toUpperCase()}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                  </p>
                </div>
                <Badge className="flex items-center gap-1">
                  {getStatusIcon(order.status)}
                  {order.status.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Order Items ({order.items.length})</h4>
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="font-medium">Shipping Address</h4>
                <p className="text-sm text-muted-foreground">
                  {order.shippingAddress.fullName}<br />
                  {order.shippingAddress.address}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
              </div>

              <Link href="/refund-request">
                <Button variant="outline" className="w-full">Request Refund/Cancellation</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}