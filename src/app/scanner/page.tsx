"use client";

import { useState, useEffect } from "react";
import {
  ScanBarcode,
  Search,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Leaf,
  XCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import type { ProductScan } from "@/lib/data";
import { useApp } from "@/lib/context";
import { apiFetch } from "@/lib/api";

export default function ScannerPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductScan | null>(null);
  const [scanned, setScanned] = useState(false);
  const [products, setProducts] = useState<ProductScan[]>([]);
  const { logAction } = useApp();

  useEffect(() => {
    apiFetch<ProductScan[]>("/api/products")
      .then(setProducts)
      .catch(console.error);
  }, []);

  const filteredProducts = searchQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  const handleScan = (product: ProductScan) => {
    setSelectedProduct(product);
    setScanned(true);
    logAction(1); // Scanning earns 1 point
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low":
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case "medium":
        return <ShieldAlert className="w-5 h-5 text-amber-500" />;
      case "high":
        return <ShieldX className="w-5 h-5 text-red-500" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-amber-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Scanner</h1>
        <p className="text-sm text-gray-500 mt-1">
          Check product sustainability — every scan feeds your score
        </p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSelectedProduct(null);
            setScanned(false);
          }}
          placeholder="Search or scan a product..."
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
        />
        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
          <ScanBarcode className="w-4 h-4" />
        </button>
      </div>

      {/* Product scan result */}
      {selectedProduct && scanned && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-slide-up">
          {/* Score header */}
          <div
            className={`p-6 ${
              selectedProduct.sustainabilityScore >= 70
                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                : selectedProduct.sustainabilityScore >= 40
                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                : "bg-gradient-to-r from-red-500 to-rose-500"
            } text-white`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Sustainability Score</p>
                <p className="text-5xl font-bold mt-1">
                  {selectedProduct.sustainabilityScore}
                  <span className="text-lg text-white/60">/100</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{selectedProduct.name}</p>
                <p className="text-sm text-white/80">{selectedProduct.brand}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Risk assessment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`border rounded-xl p-4 ${getRiskColor(
                  selectedProduct.deforestationRisk
                )}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {getRiskIcon(selectedProduct.deforestationRisk)}
                  <span className="text-sm font-bold capitalize">
                    {selectedProduct.deforestationRisk} Deforestation Risk
                  </span>
                </div>
                <p className="text-xs opacity-80">
                  {selectedProduct.deforestationRisk === "high"
                    ? "This product is linked to deforestation"
                    : selectedProduct.deforestationRisk === "medium"
                    ? "Moderate risk — consider alternatives"
                    : "Low environmental impact"}
                </p>
              </div>
              <div
                className={`border rounded-xl p-4 ${
                  selectedProduct.palmOilFree
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                    : "bg-red-50 border-red-200 text-red-600"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {selectedProduct.palmOilFree ? (
                    <Leaf className="w-5 h-5" />
                  ) : (
                    <XCircle className="w-5 h-5" />
                  )}
                  <span className="text-sm font-bold">
                    {selectedProduct.palmOilFree
                      ? "Palm Oil Free"
                      : "Contains Non-Sustainable Palm Oil"}
                  </span>
                </div>
              </div>
            </div>

            {/* Certifications */}
            {selectedProduct.certifications.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                  Certifications
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.certifications.map((cert) => (
                    <span
                      key={cert}
                      className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Alternatives */}
            {selectedProduct.alternatives.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                  Sustainable Alternatives
                </p>
                <div className="space-y-2">
                  {selectedProduct.alternatives.map((alt) => (
                    <div
                      key={alt}
                      className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl"
                    >
                      <span className="text-sm font-medium text-emerald-800">
                        {alt}
                      </span>
                      <ArrowRight className="w-4 h-4 text-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Product list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase">
            {searchQuery ? "Search Results" : "Popular Products"}
          </p>
        </div>
        <div className="divide-y divide-gray-50">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => handleScan(product)}
              className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-all text-left ${
                selectedProduct?.id === product.id ? "bg-emerald-50" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    product.sustainabilityScore >= 70
                      ? "bg-emerald-100"
                      : product.sustainabilityScore >= 40
                      ? "bg-amber-100"
                      : "bg-red-100"
                  }`}
                >
                  {getRiskIcon(product.deforestationRisk)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">{product.brand}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${getScoreColor(product.sustainabilityScore)}`}>
                  {product.sustainabilityScore}
                </p>
                <p className="text-[10px] text-gray-400">score</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
