"use client"

import { useState, useEffect } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function SettingsManagement() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [bannerText, setBannerText] = useState("")
  const [siteDiscount, setSiteDiscount] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, "settings", "general"))
      if (settingsDoc.exists()) {
        const data = settingsDoc.data()
        setBannerText(data.bannerText || "")
        setSiteDiscount(data.siteDiscount || "0")
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, "settings", "general"), {
        bannerText,
        siteDiscount: parseFloat(siteDiscount) || 0,
        updatedAt: new Date(),
      })

      toast({
        title: "Success",
        description: "Settings saved successfully",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Site Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage global site configurations
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Banner Text</CardTitle>
            <CardDescription>
              Update the promotional banner text displayed at the top of the site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bannerText">Banner Message</Label>
              <Input
                id="bannerText"
                value={bannerText}
                onChange={(e) => setBannerText(e.target.value)}
                placeholder="Free shipping on orders over $100!"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Site-Wide Discount</CardTitle>
            <CardDescription>
              Apply a percentage discount to all products
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteDiscount">Discount Percentage (%)</Label>
              <Input
                id="siteDiscount"
                type="number"
                min="0"
                max="100"
                value={siteDiscount}
                onChange={(e) => setSiteDiscount(e.target.value)}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Set to 0 to disable site-wide discount
              </p>
            </div>
          </CardContent>
        </Card>

        <Button onClick={saveSettings} disabled={saving} className="w-full md:w-auto">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>
    </div>
  )
}