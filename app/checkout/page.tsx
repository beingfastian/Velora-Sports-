"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, CreditCard, ShieldCheck, Tag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart } from "@/components/cart-provider"
import { collection, addDoc, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { CartItem } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface PromoCode {
  id: string
  code: string
  discount: number
  type: "percentage" | "fixed"
  minOrderAmount?: number
  isActive: boolean
}

export default function CheckoutPage() {
  const { cartItems, subtotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null)
  const [promoLoading, setPromoLoading] = useState(false)
  const { toast } = useToast()

  if (cartItems.length === 0 && !isComplete) {
    return (
      <div className="container px-4 py-12 mx-auto text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-4">You need to add items to your cart before checking out.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="container px-4 py-12 mx-auto max-w-md">
        <Card className="text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <ShieldCheck className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Thank you for your purchase. Your order has been confirmed and will be shipped soon.</p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="font-medium">Order #{orderId.slice(-8).toUpperCase()}</p>
              <p className="text-sm text-muted-foreground">A confirmation email has been sent to your email address.</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const shippingCost = shippingMethod === "express" ? 9.99 : 0
  
  // Calculate discount
  let discountAmount = 0
  if (appliedPromo) {
    if (appliedPromo.type === "percentage") {
      discountAmount = (subtotal * appliedPromo.discount) / 100
    } else {
      discountAmount = appliedPromo.discount
    }
  }

  const subtotalAfterDiscount = subtotal - discountAmount
  const tax = subtotalAfterDiscount * 0.1
  const total = subtotalAfterDiscount + shippingCost + tax

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a promo code",
        variant: "destructive",
      })
      return
    }

    setPromoLoading(true)

    try {
      const promoRef = collection(db, "promoCodes")
      const q = query(
        promoRef,
        where("code", "==", promoCode.trim().toUpperCase()),
        where("isActive", "==", true)
      )

      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        toast({
          title: "Invalid Code",
          description: "This promo code is not valid or has expired",
          variant: "destructive",
        })
        return
      }

      const promoDoc = querySnapshot.docs[0]
      const promoData = { id: promoDoc.id, ...promoDoc.data() } as PromoCode

      // Check minimum order amount
      if (promoData.minOrderAmount && subtotal < promoData.minOrderAmount) {
        toast({
          title: "Minimum Amount Required",
          description: `This promo code requires a minimum order of $${promoData.minOrderAmount}`,
          variant: "destructive",
        })
        return
      }

      setAppliedPromo(promoData)
      toast({
        title: "Promo Code Applied!",
        description: `You saved ${promoData.type === "percentage" ? `${promoData.discount}%` : `$${promoData.discount}`}`,
      })
    } catch (error) {
      console.error("Error applying promo code:", error)
      toast({
        title: "Error",
        description: "Failed to apply promo code",
        variant: "destructive",
      })
    } finally {
      setPromoLoading(false)
    }
  }

  const removePromoCode = () => {
    setAppliedPromo(null)
    setPromoCode("")
    toast({
      title: "Promo Code Removed",
      description: "Promo code has been removed from your order",
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          image: item.images[0],
        })),
        subtotal,
        discount: discountAmount,
        promoCode: appliedPromo?.code || null,
        shipping: shippingCost,
        tax,
        total,
        shippingAddress: {
          fullName: `${formData.get("firstName")} ${formData.get("lastName")}`,
          email: formData.get("email"),
          phone: formData.get("phone"),
          address: formData.get("address"),
          apartment: formData.get("apartment") || "",
          city: formData.get("city"),
          state: formData.get("state"),
          zipCode: formData.get("zip"),
          country: "USA",
        },
        paymentMethod: {
          type: paymentMethod,
          ...(paymentMethod === "card" && {
            cardName: formData.get("cardName"),
          }),
        },
        shippingMethod,
        status: "pending",
        createdAt: new Date(),
      }

      const docRef = await addDoc(collection(db, "orders"), orderData)
      
      setOrderId(docRef.id)
      setIsComplete(true)
      clearCart()

      toast({
        title: "Success",
        description: "Your order has been placed successfully!",
      })
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/cart">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-medium mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" name="firstName" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" name="lastName" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" required />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                    <Input id="apartment" name="apartment" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select name="state" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" name="zip" required />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="card">Credit Card</TabsTrigger>
                    <TabsTrigger value="paypal">PayPal</TabsTrigger>
                    <TabsTrigger value="cod">Cash on Delivery</TabsTrigger>
                  </TabsList>
                  <TabsContent value="card" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" name="cardName" required={paymentMethod === "card"} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <Input 
                          id="cardNumber" 
                          name="cardNumber" 
                          placeholder="1234 5678 9012 3456" 
                          required={paymentMethod === "card"} 
                        />
                        <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input 
                          id="expiry" 
                          name="expiry" 
                          placeholder="MM/YY" 
                          required={paymentMethod === "card"} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input 
                          id="cvc" 
                          name="cvc" 
                          placeholder="123" 
                          required={paymentMethod === "card"} 
                        />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="paypal" className="pt-4">
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <p>You will be redirected to PayPal to complete your purchase securely.</p>
                    </div>
                  </TabsContent>
                  <TabsContent value="cod" className="pt-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm">
                        Pay with cash when your order is delivered. A small COD fee may apply.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <Separator />

              <div>
                <h2 className="text-lg font-medium mb-4">Shipping Method</h2>
                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                  <div className="flex items-center space-x-3 border rounded-lg p-4">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard" className="flex-1 cursor-pointer">
                      <div className="flex justify-between">
                        <span>Standard Shipping</span>
                        <span className="font-medium">Free</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Delivery in 5-7 business days</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex-1 cursor-pointer">
                      <div className="flex justify-between">
                        <span>Express Shipping</span>
                        <span className="font-medium">$9.99</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Delivery in 2-3 business days</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="lg:hidden">
                <OrderSummary 
                  cartItems={cartItems} 
                  subtotal={subtotal}
                  discountAmount={discountAmount}
                  appliedPromo={appliedPromo}
                  shippingCost={shippingCost}
                  tax={tax}
                  total={total}
                  promoCode={promoCode}
                  setPromoCode={setPromoCode}
                  applyPromoCode={applyPromoCode}
                  removePromoCode={removePromoCode}
                  promoLoading={promoLoading}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div className="hidden lg:block">
          <OrderSummary 
            cartItems={cartItems} 
            subtotal={subtotal}
            discountAmount={discountAmount}
            appliedPromo={appliedPromo}
            shippingCost={shippingCost}
            tax={tax}
            total={total}
            promoCode={promoCode}
            setPromoCode={setPromoCode}
            applyPromoCode={applyPromoCode}
            removePromoCode={removePromoCode}
            promoLoading={promoLoading}
          />
        </div>
      </div>
    </div>
  )
}

function OrderSummary({ 
  cartItems, 
  subtotal,
  discountAmount,
  appliedPromo,
  shippingCost, 
  tax, 
  total,
  promoCode,
  setPromoCode,
  applyPromoCode,
  removePromoCode,
  promoLoading
}: { 
  cartItems: CartItem[]
  subtotal: number
  discountAmount: number
  appliedPromo: PromoCode | null
  shippingCost: number
  tax: number
  total: number
  promoCode: string
  setPromoCode: (code: string) => void
  applyPromoCode: () => void
  removePromoCode: () => void
  promoLoading: boolean
}) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {cartItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex justify-between text-sm">
              <div className="flex items-start gap-2">
                <span className="font-medium">{item.quantity}×</span>
                <div>
                  <div>{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.selectedSize && `Size: ${item.selectedSize}`}
                    {item.selectedColor && `, ${item.selectedColor}`}
                  </div>
                </div>
              </div>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <Separator />

        {/* Promo Code Section */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Promo Code</Label>
          {appliedPromo ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">{appliedPromo.code}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removePromoCode}
                className="h-6 w-6 p-0 hover:bg-green-100"
              >
                <X className="h-4 w-4 text-green-600" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && applyPromoCode()}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={applyPromoCode}
                disabled={promoLoading}
              >
                {promoLoading ? "..." : "Apply"}
              </Button>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount ({appliedPromo?.type === "percentage" ? `${appliedPromo.discount}%` : `$${appliedPromo?.discount}`})</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax (10%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}