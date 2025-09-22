"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, updateDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Order } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"))
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Order[]
      setOrders(ordersData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      })
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status })
      toast({
        title: "Success",
        description: "Order status updated successfully",
      })
      fetchOrders()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "default"
      case "confirmed":
        return "secondary"
      case "shipped":
        return "outline"
      case "delivered":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Order Management</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                  <CardDescription>
                    {order.createdAt.toLocaleDateString()} • {order.items.length} items
                  </CardDescription>
                </div>
                <Badge variant={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Items</h4>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="text-sm">
                          {item.name} - {item.size} - {item.color} × {item.quantity}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <div className="text-sm space-y-1">
                      <div>{order.shippingAddress.fullName}</div>
                      <div>{order.shippingAddress.address}</div>
                      <div>
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </div>
                      <div>{order.shippingAddress.phone}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-lg font-semibold">Total: ${order.total.toFixed(2)}</div>
                  <Select
                    value={order.status}
                    onValueChange={(value) => updateOrderStatus(order.id, value as Order["status"])}
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
          </Card>
        ))}
      </div>
    </div>
  )
}
