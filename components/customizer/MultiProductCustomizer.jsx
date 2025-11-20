"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, RotateCcw, Shirt, Package, ShoppingCart } from "lucide-react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
// Modular components
import { Canvas3D } from "./Canvas3D";
import { ProductSlider } from "./ProductSlider";
import { ColorPicker } from "./ColorPicker";
import { ControlSidebar } from "./ControlPanels";
import { useCart } from "@/components/cart-provider";
import { useToast } from "@/hooks/use-toast";

export default function MultiProductCustomizer({ isOpen = false, onClose = () => {} }) {
  // ✅ Move hooks INSIDE the component
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [mounted, setMounted] = useState(false);
  const [activePopup, setActivePopup] = useState("");
  const [activeProduct, setActiveProduct] = useState("shirt");

  const products = [
    { id: "shirt", name: "T-Shirt", icon: Shirt, color: "#3B82F6" },
    { id: "trouser", name: "Trouser", icon: Package, color: "#8B5CF6" },
    { id: "shoe", name: "Shoe", icon: Package, color: "#F59E0B" },
  ];

  const getDefaultState = (productType) => {
    const baseState = {
      intro: true,
      color:
        productType === "trouser"
          ? "#2563EB"
          : productType === "shoe"
          ? "#1F2937"
          : "#EFBD48",
    };

    switch (productType) {
      case "shirt":
        return {
          ...baseState,
          isFullTexture: false,
          isLeftChestLogo: false,
          isMainChestLogo: false,
          isRightChestLogo: false,
          isFullBackLogo: false,
          isFrontText: true,
          isBackText: true,
          leftChestDecal: "",
          mainChestDecal: "",
          rightChestDecal: "",
          fullBackDecal: "",
          fullDecal: "",
          frontText: "FRONT",
          backText: "BACK",
          frontTextFont: "Arial",
          backTextFont: "Arial",
          frontTextColor: "#000000",
          backTextColor: "#000000",
          frontTextSize: 60,
          backTextSize: 60,
        };

      case "trouser":
        return {
          ...baseState,
        };

      case "shoe":
        return {
          ...baseState,
          isBodyColor: true,
          bodyColor: "#F3F4F6",
        };

      default:
        return baseState;
    }
  };

  const [customState, setCustomState] = useState(() => getDefaultState("shirt"));

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) setCustomState((prev) => ({ ...prev, intro: false }));
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setActiveProduct("shirt");
        setCustomState(getDefaultState("shirt"));
        setActivePopup("");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const updateState = (updates) => setCustomState((prev) => ({ ...prev, ...updates }));
  
  const switchProduct = (productId) => {
    setActiveProduct(productId);
    setCustomState(getDefaultState(productId));
    setActivePopup("");
  };

  const handleFileUpload = (type, event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert("Image under 5MB required.");
    if (!file.type.startsWith("image/")) return alert("Invalid file type.");

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;

      if (activeProduct === "shirt") {
        switch (type) {
          case "leftChest": updateState({ leftChestDecal: imageUrl, isLeftChestLogo: true }); break;
          case "mainChest": updateState({ mainChestDecal: imageUrl, isMainChestLogo: true }); break;
          case "rightChest": updateState({ rightChestDecal: imageUrl, isRightChestLogo: true }); break;
          case "fullBack": updateState({ fullBackDecal: imageUrl, isFullBackLogo: true }); break;
          case "fullPattern": updateState({ fullDecal: imageUrl, isFullTexture: true }); break;
        }
      }
    };

    reader.readAsDataURL(file);
  };

  const toggleElement = (element) => updateState({ [element]: !customState[element] });

  const downloadCanvas = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const dataURL = canvas.toDataURL("image/png", 1.0);
    const link = document.createElement("a");
    link.download = `custom-${activeProduct}-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

const handleAddToCart = async () => {
  try {
    // 1. Capture canvas screenshot
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      toast({
        title: "Error",
        description: "Failed to capture design",
        variant: "destructive",
      });
      return;
    }

    // 2. Convert canvas to blob
    const blob = await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png", 0.9);
    });

    if (!blob) {
      toast({
        title: "Error",
        description: "Failed to create image",
        variant: "destructive",
      });
      return;
    }

    // 3. Upload to Firebase Storage
    const timestamp = Date.now();
    const fileName = `custom-products/${activeProduct}-${timestamp}.png`;
    const storageRef = ref(storage, fileName);
    
    toast({
      title: "Uploading...",
      description: "Saving your custom design",
    });

    await uploadBytes(storageRef, blob);
    const imageUrl = await getDownloadURL(storageRef);

    // 4. Prepare product data with Firebase image URL
    const prices = {
      shirt: 10,
      trouser: 15,
      shoe: 20,
    };

    const customProduct = {
      id: `custom-${activeProduct}-${timestamp}`,
      name: `Custom ${activeProduct.charAt(0).toUpperCase() + activeProduct.slice(1)}`,
      description: `Personalized ${activeProduct} with your custom design`,
      price: prices[activeProduct],
      images: [imageUrl], // Use Firebase URL
      category: activeProduct === "shirt" ? "men" : activeProduct === "trouser" ? "training" : "running",
      sizes: ["One Size"],
      colors: [customState.color || "#000000"],
      inStock: true,
      featured: false,
      quantity: 1,
      selectedSize: "One Size",
      selectedColor: customState.color || "#000000",
      isCustom: true,
      customization: customState,
    };

    // 5. Add to cart
    addToCart(customProduct);

    toast({
      title: "Success!",
      description: `Custom ${activeProduct} added to cart - $${prices[activeProduct]}`,
    });
    
  } catch (error) {
    console.error("Error adding to cart:", error);
    toast({
      title: "Error",
      description: "Failed to save design. Please try again.",
      variant: "destructive",
    });
  }
};

  const resetToDefaults = () => {
    setCustomState(getDefaultState(activeProduct));
    setActivePopup("");
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-white"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full h-full"
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-4">
                  <h1 className="text-xl font-bold text-gray-800">3D Designer Studio</h1>
                  <button
                    onClick={resetToDefaults}
                    className="flex items-center px-3 py-1.5 space-x-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  {activeProduct !== "shoe" && (
                    <>
                      <div className="text-sm text-gray-600">Color:</div>
                      <ColorPicker
                        isOpen={activePopup === "colorPicker"}
                        currentColor={customState.color}
                        onColorChange={(c) => updateState({ color: c })}
                        onToggle={() =>
                          setActivePopup(
                            activePopup === "colorPicker" ? "" : "colorPicker"
                          )
                        }
                      />
                    </>
                  )}

                  {activeProduct === "shoe" && (
                    <>
                      <div className="text-sm text-gray-600">Body:</div>
                      <ColorPicker
                        isOpen={activePopup === "bodyColorPicker"}
                        currentColor={customState.bodyColor}
                        onColorChange={(color) => updateState({ bodyColor: color })}
                        onToggle={() =>
                          setActivePopup(
                            activePopup === "bodyColorPicker" ? "" : "bodyColorPicker"
                          )
                        }
                      />
                    </>
                  )}

                  <button
                    onClick={onClose}
                    className="p-2 ml-2 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <ControlSidebar
              activeProduct={activeProduct}
              activePopup={activePopup}
              onSetActivePopup={setActivePopup}
              customState={customState}
              onUpdateState={updateState}
              onFileUpload={handleFileUpload}
              onToggleElement={toggleElement}
              onDownload={downloadCanvas}
              onReset={resetToDefaults}
              onAddToCart={handleAddToCart}
            />

            {/* Canvas */}
            <div
              className={`relative w-full h-full pt-20 pb-16 ${
                activeProduct === "shirt" || activeProduct === "trouser" ? "pl-20" : ""
              } z-10`}
            >
              <Canvas3D activeProduct={activeProduct} customState={customState} />
            </div>

            {/* Product Slider */}
            <ProductSlider
              activeProduct={activeProduct}
              onProductChange={switchProduct}
              products={products}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}