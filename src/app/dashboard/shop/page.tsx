"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Trash2, Star, Upload, Lock, Crown } from "lucide-react";
import { currencies } from "@/lib/currencies";

interface Product {
  productId: string;
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  currency: string;
  isFeatured: boolean;
  position: number;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", imageUrl: "", price: "", currency: "USD" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = useCallback(async () => {
    const [prodRes, profRes] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/profile"),
    ]);
    if (prodRes.ok) setProducts(await prodRes.json());
    if (profRes.ok) setProfile(await profRes.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const isPro = profile?.isPro;

  const handleUpload = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "products");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json();
      setForm({ ...form, imageUrl: data.url });
    }
    setUploading(false);
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);
    setError("");
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ title: "", description: "", imageUrl: "", price: "", currency: "USD" });
      setShowForm(false);
      fetchData();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to add product");
    }
    setSaving(false);
  };

  const toggleFeatured = async (product: Product) => {
    const res = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.productId, isFeatured: !product.isFeatured }),
    });
    if (res.ok) fetchData();
    else {
      const data = await res.json();
      alert(data.error || "Failed to update");
    }
  };

  const deleteProduct = async (productId: string) => {
    await fetch(`/api/products/${productId}`, { method: "DELETE" });
    fetchData();
  };

  const featuredCount = products.filter((p) => p.isFeatured).length;

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;
  }

  const formatPrice = (product: Product) => {
    const cur = currencies.find((c) => c.code === product.currency);
    return product.price ? `${cur?.symbol || ""}${product.price}` : "";
  };

  if (!isPro) {
    return (
      <div className="max-w-lg mx-auto mt-16 text-center">
        <div className="bg-white p-10 rounded-2xl border shadow-sm">
          <Lock className="w-10 h-10 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Pro feature</h2>
          <p className="text-sm text-gray-500 mb-6">
            The Shop feature is available on the Pro plan and above. Showcase up to 10 products with images, prices, and currencies.
          </p>
          <a
            href="/dashboard/billing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
          >
            <Crown className="w-4 h-4" />
            Upgrade to Pro
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop</h1>
          <p className="text-sm text-gray-500 mt-1">
            Showcase up to 10 products. Featured products ({featuredCount}/3) appear on your public page.
          </p>
        </div>
      </div>

      <div className="max-w-3xl space-y-3">
        {products.map((product) => (
          <div key={product.productId} className="flex items-center gap-4 p-4 bg-white border rounded-xl">
            <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0 border">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900 truncate">{product.title}</p>
                {product.isFeatured && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">Featured</span>
                )}
              </div>
              {product.description && <p className="text-sm text-gray-500 truncate">{product.description}</p>}
              {product.price && <p className="text-sm font-medium text-gray-700">{formatPrice(product)}</p>}
            </div>
            <button
              onClick={() => toggleFeatured(product)}
              className={`p-2 rounded-lg transition-colors ${
                product.isFeatured ? "text-yellow-500 hover:bg-yellow-50" : "text-gray-300 hover:bg-gray-100"
              }`}
              title={product.isFeatured ? "Unfeature" : "Feature (max 3)"}
            >
              <Star className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteProduct(product.productId)}
              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {showForm ? (
          <form onSubmit={addProduct} className="p-4 bg-purple-50 border border-purple-200 rounded-xl space-y-3">
            <input
              type="text"
              placeholder="Product title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />

            <div className="space-y-2">
              {form.imageUrl && (
                <div className="relative w-32 h-24 rounded-lg overflow-hidden border">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg text-sm hover:bg-gray-50 cursor-pointer transition-colors w-fit">
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload image"}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
              </label>
              <p className="text-xs text-gray-400">JPEG, PNG, WebP, or GIF. Max 5MB.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Price</label>
                <input
                  type="text"
                  placeholder="e.g. 29.99"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Currency</label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.symbol} - {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => { setShowForm(false); setError(""); }}
                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving || !form.title}
                className="px-4 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {saving ? "Adding..." : "Add product"}
              </button>
            </div>
          </form>
        ) : products.length < 10 ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-purple-400 hover:text-purple-500 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add product ({products.length}/10)
          </button>
        ) : null}
      </div>
    </div>
  );
}
