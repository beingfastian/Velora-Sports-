"use client"

import { useState } from "react"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RefundRequestPage() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      await addDoc(collection(db, "refundRequests"), {
        orderId: formData.get("orderId"),
        email: formData.get("email"),
        reason: formData.get("reason"),
        type: formData.get("type"),
        details: formData.get("details"),
        status: "pending",
        createdAt: new Date(),
      })

      toast({
        title: "Success",
        description: "Your request has been submitted. We'll contact you soon.",
      })

      e.currentTarget.reset()
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Failed to submit request",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container px-4 py-12 mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Refund/Cancellation Request</CardTitle>
          <CardDescription>Submit a request for order cancellation or refund</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID *</Label>
              <Input id="orderId" name="orderId" required placeholder="Enter your order ID" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required placeholder="your@email.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Request Type *</Label>
              <Select name="type" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cancellation">Order Cancellation</SelectItem>
                  <SelectItem value="refund">Refund Request</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Select name="reason" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="changed_mind">Changed my mind</SelectItem>
                  <SelectItem value="wrong_item">Received wrong item</SelectItem>
                  <SelectItem value="defective">Product defective</SelectItem>
                  <SelectItem value="late_delivery">Late delivery</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Additional Details</Label>
              <Textarea 
                id="details" 
                name="details" 
                placeholder="Provide more information about your request" 
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Submit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}