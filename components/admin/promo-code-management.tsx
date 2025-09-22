"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { PromoCode } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PromoCodeManagement() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    type: "percentage" as "percentage" | "fixed",
    minOrderAmount: "",
    expiresAt: "",
    isActive: true,
  })

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  const fetchPromoCodes = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "promoCodes"))
      const promoData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        expiresAt: doc.data().expiresAt?.toDate(),
      })) as PromoCode[]
      setPromoCodes(promoData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch promo codes",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const promoData = {
        code: formData.code.toUpperCase(),
        discount: Number.parseFloat(formData.discount),
        type: formData.type,
        minOrderAmount: formData.minOrderAmount ? Number.parseFloat(formData.minOrderAmount) : undefined,
        expiresAt: new Date(formData.expiresAt),
        isActive: formData.isActive,
      }

      if (editingPromo) {
        await updateDoc(doc(db, "promoCodes", editingPromo.id), promoData)
        toast({
          title: "Success",
          description: "Promo code updated successfully",
        })
      } else {
        await addDoc(collection(db, "promoCodes"), promoData)
        toast({
          title: "Success",
          description: "Promo code added successfully",
        })
      }

      resetForm()
      fetchPromoCodes()
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save promo code",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (promo: PromoCode) => {
    setEditingPromo(promo)
    setFormData({
      code: promo.code,
      discount: promo.discount.toString(),
      type: promo.type,
      minOrderAmount: promo.minOrderAmount?.toString() || "",
      expiresAt: promo.expiresAt.toISOString().split("T")[0],
      isActive: promo.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (promoId: string) => {
    if (confirm("Are you sure you want to delete this promo code?")) {
      try {
        await deleteDoc(doc(db, "promoCodes", promoId))
        toast({
          title: "Success",
          description: "Promo code deleted successfully",
        })
        fetchPromoCodes()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete promo code",
          variant: "destructive",
        })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      code: "",
      discount: "",
      type: "percentage",
      minOrderAmount: "",
      expiresAt: "",
      isActive: true,
    })
    setEditingPromo(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Promo Code Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Promo Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPromo ? "Edit Promo Code" : "Add New Promo Code"}</DialogTitle>
              <DialogDescription>
                {editingPromo ? "Update promo code details" : "Create a new promotional discount code"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Promo Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="SAVE20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount</Label>
                  <Input
                    id="discount"
                    type="number"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as "percentage" | "fixed" })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minOrderAmount">Min Order Amount ($)</Label>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    step="0.01"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Expires At</Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <Button type="submit" className="w-full">
                {editingPromo ? "Update Promo Code" : "Add Promo Code"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promoCodes.map((promo) => (
          <Card key={promo.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{promo.code}</CardTitle>
                  <CardDescription>
                    {promo.type === "percentage" ? `${promo.discount}% off` : `$${promo.discount} off`}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(promo)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(promo.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant={promo.isActive ? "default" : "secondary"}>
                  {promo.isActive ? "Active" : "Inactive"}
                </Badge>
                {promo.minOrderAmount && <p className="text-sm text-gray-600">Min order: ${promo.minOrderAmount}</p>}
                <p className="text-sm text-gray-600">Expires: {promo.expiresAt.toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
