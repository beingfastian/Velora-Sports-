import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Shirt, Package } from 'lucide-react';

export function ProductSlider({ activeProduct, onProductChange, products }) {
  const handlePrevProduct = () => {
    const currentIndex = products.findIndex(p => p.id === activeProduct);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : products.length - 1;
    onProductChange(products[prevIndex].id);
  };

  const handleNextProduct = () => {
    const currentIndex = products.findIndex(p => p.id === activeProduct);
    const nextIndex = currentIndex < products.length - 1 ? currentIndex + 1 : 0;
    onProductChange(products[nextIndex].id);
  };

  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-50 bg-white mb-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 backdrop-blur-md rounded-full shadow-2xl border border-white/20 p-2 flex items-center space-x-2"
      >
        <button
          onClick={handlePrevProduct}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-1">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <motion.button
                key={product.id}
                onClick={() => onProductChange(product.id)}
                className={`relative px-4 py-2 rounded-full transition-all duration-300 flex items-center space-x-2 ${
                  activeProduct === product.id
                    ? 'text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: activeProduct === product.id ? product.color : 'transparent'
                }}
                whileHover={{ scale: activeProduct === product.id ? 1.05 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-4 h-4 z-10" />
                <span className="text-sm font-medium z-10">{product.name}</span>
                {activeProduct === product.id && (
                  <motion.div
                    layoutId="activeProductIndicator"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: product.color }}
                    initial={false}
                    transition={{ type: "spring", duration: 0.3 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <button
          onClick={handleNextProduct}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}