export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: "men" | "women" | "training" | "running"
  subcategory?: string
  sizes: string[]
  colors: string[]
  inStock: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

export interface PromoCode {
  id: string
  code: string
  discount: number
  type: "percentage" | "fixed"
  minOrderAmount?: number
  expiresAt: Date
  isActive: boolean
}

export interface Order {
  id: string
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  promoCode?: string
  shippingAddress: ShippingAddress
  paymentMethod: PaymentMethod
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
}

export interface ShippingAddress {
  fullName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
}

export interface PaymentMethod {
  type: "card" | "paypal" | "apple_pay" | "google_pay"
  cardLast4?: string
  cardBrand?: string
}
