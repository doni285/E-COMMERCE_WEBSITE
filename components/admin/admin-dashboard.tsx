"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Upload,
  X,
  Package,
  ImageIcon,
  Settings,
  Save,
  Phone,
  Mail,
  Instagram,
  MessageCircle,
  MapPin,
  Truck,
  Type,
  FileText,
  BarChart3,
  Palette,
} from "lucide-react"

interface ProductImage {
  id: number
  image_url: string
  sort_order: number
  label: string
}

interface DBProduct {
  id: string
  name: string
  price: number
  description: string
  category: string
  sizes: string
  colors: string
  in_stock: boolean
  images: ProductImage[]
}

type TabType = "products" | "settings"

export function AdminDashboard({ username }: { username: string }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("products")
  const [products, setProducts] = useState<DBProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<DBProduct | null>(null)
  const [uploadingFor, setUploadingFor] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/products")
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      } else if (res.status === 401) {
        router.push("/admin/login")
      }
    } catch (err) {
      console.error("Failed to fetch products", err)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" })
    if (res.ok) fetchProducts()
  }

  async function handleDeleteImage(productId: string, imageId: number) {
    const res = await fetch(`/api/admin/products/${productId}/images?imageId=${imageId}`, {
      method: "DELETE",
    })
    if (res.ok) fetchProducts()
  }

  async function handleImageUpload(productId: string, files: FileList) {
    setUploadingFor(productId)
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("image", file)
      formData.append("label", "View")
      await fetch(`/api/admin/products/${productId}/images`, {
        method: "POST",
        body: formData,
      })
    }
    setUploadingFor(null)
    fetchProducts()
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.jpeg"
              alt="David Mollanni"
              width={100}
              height={36}
              className="h-9 w-auto object-contain"
            />
            <span className="hidden rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary sm:inline-block">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {username}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl gap-0 px-4 lg:px-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === "products"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="h-4 w-4" />
            Products
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-medium transition-colors ${
              activeTab === "settings"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="h-4 w-4" />
            Site Settings
          </button>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {activeTab === "products" ? (
          <ProductsTab
            products={products}
            loading={loading}
            uploadingFor={uploadingFor}
            formatPrice={formatPrice}
            onAddProduct={() => {
              setEditingProduct(null)
              setShowForm(true)
            }}
            onEditProduct={(p) => {
              setEditingProduct(p)
              setShowForm(true)
            }}
            onDeleteProduct={handleDelete}
            onDeleteImage={handleDeleteImage}
            onUploadImages={handleImageUpload}
          />
        ) : (
          <SiteSettingsTab />
        )}
      </main>

      {/* Product Form Modal */}
      {showForm && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => {
            setShowForm(false)
            setEditingProduct(null)
          }}
          onSaved={() => {
            setShowForm(false)
            setEditingProduct(null)
            fetchProducts()
          }}
        />
      )}
    </div>
  )
}

/* ─── Products Tab ─── */
function ProductsTab({
  products,
  loading,
  uploadingFor,
  formatPrice,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onDeleteImage,
  onUploadImages,
}: {
  products: DBProduct[]
  loading: boolean
  uploadingFor: string | null
  formatPrice: (p: number) => string
  onAddProduct: () => void
  onEditProduct: (p: DBProduct) => void
  onDeleteProduct: (id: string, name: string) => void
  onDeleteImage: (productId: string, imageId: number) => void
  onUploadImages: (productId: string, files: FileList) => void
}) {
  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} product{products.length !== 1 ? "s" : ""} in your collection
          </p>
        </div>
        <button
          onClick={onAddProduct}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20">
          <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">No products yet. Add your first product to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <div key={product.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-secondary">
                    {product.images && product.images.length > 0 ? (
                      <Image src={product.images[0].image_url} alt={product.name} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-card-foreground">{product.name}</h3>
                    <p className="text-sm font-bold text-primary">{formatPrice(product.price)}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {product.category} | Sizes: {product.sizes || "None"} | Colors: {product.colors || "None"}
                    </p>
                    <span
                      className={`mt-1 inline-block rounded-sm px-1.5 py-0.5 text-xs font-medium ${
                        product.in_stock ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onEditProduct(product)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteProduct(product.id, product.name)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Images */}
              <div className="mt-4 border-t border-border pt-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Product Images ({product.images?.length || 0})
                  </p>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80">
                    <Upload className="h-3 w-3" />
                    {uploadingFor === product.id ? "Uploading..." : "Upload"}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      disabled={uploadingFor === product.id}
                      onChange={(e) => {
                        if (e.target.files?.length) onUploadImages(product.id, e.target.files)
                      }}
                    />
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.images?.map((img) => (
                    <div key={img.id} className="group relative h-16 w-16 overflow-hidden rounded-md border border-border">
                      <Image src={img.image_url} alt={img.label || "Product image"} fill className="object-cover" sizes="64px" />
                      <button
                        onClick={() => onDeleteImage(product.id, img.id)}
                        className="absolute inset-0 flex items-center justify-center bg-foreground/60 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Remove image"
                      >
                        <X className="h-4 w-4 text-background" />
                      </button>
                    </div>
                  ))}
                  {(!product.images || product.images.length === 0) && (
                    <p className="text-xs text-muted-foreground">No images. Upload some to show customers multiple angles.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

/* ─── Site Settings Tab ─── */
function SiteSettingsTab() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  function update(key: string, value: string) {
    setSettings((s) => ({ ...s, [key]: value }))
    setSaved(false)
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  const sections = [
    {
      title: "Contact Information",
      icon: Phone,
      description: "Phone number, email, social media, and location shown on the website.",
      fields: [
        { key: "phone", label: "Phone Number", icon: Phone, placeholder: "+234 XXX XXX XXXX" },
        { key: "email", label: "Email Address", icon: Mail, placeholder: "info@davidmollanni.com" },
        { key: "instagram_handle", label: "Instagram Handle", icon: Instagram, placeholder: "@davidmollanni" },
        { key: "whatsapp_number", label: "WhatsApp Number", icon: MessageCircle, placeholder: "+2348000000000" },
        { key: "location", label: "Location", icon: MapPin, placeholder: "Lagos, Nigeria" },
      ],
    },
    {
      title: "Homepage Content",
      icon: Type,
      description: "The text shown in the hero banner at the top of the website.",
      fields: [
        { key: "hero_subtitle", label: "Hero Subtitle", icon: Type, placeholder: "David Mollanni" },
        { key: "hero_tagline", label: "Hero Tagline", icon: FileText, placeholder: "Step ahead...", multiline: true },
      ],
    },
    {
      title: "About Page",
      icon: FileText,
      description: "The about section heading and paragraphs.",
      fields: [
        { key: "about_heading", label: "About Heading", icon: Type, placeholder: "Quality Handmade Shoe Maker" },
        { key: "about_paragraph_1", label: "Paragraph 1", icon: FileText, placeholder: "Welcome to David Mollanni...", multiline: true },
        { key: "about_paragraph_2", label: "Paragraph 2", icon: FileText, placeholder: "At David Mollanni, we believe...", multiline: true },
        { key: "about_paragraph_3", label: "Paragraph 3", icon: FileText, placeholder: "Explore our range...", multiline: true },
      ],
    },
    {
      title: "Statistics",
      icon: BarChart3,
      description: "Numbers displayed in the About section.",
      fields: [
        { key: "stat_authentic", label: "Authentic Stat", icon: BarChart3, placeholder: "100%" },
        { key: "stat_states", label: "States Covered", icon: BarChart3, placeholder: "36+" },
        { key: "stat_customers", label: "Happy Customers", icon: BarChart3, placeholder: "500+" },
      ],
    },
    {
      title: "Delivery Information",
      icon: Truck,
      description: "Delivery details displayed on the contact section.",
      fields: [
        { key: "delivery_info", label: "Delivery Info", icon: Truck, placeholder: "We deliver nationwide...", multiline: true },
      ],
    },
    {
      title: "Theme",
      icon: Palette,
      description: "Choose a colour theme for your website.",
      fields: [
        { key: "theme_color", label: "Theme Color", icon: Palette, placeholder: "lime", isTheme: true },
      ],
    },
  ]

  const themeOptions = [
    { value: "lime", label: "Lime Green", bg: "bg-[#7CB342]" },
    { value: "emerald", label: "Emerald", bg: "bg-[#059669]" },
    { value: "gold", label: "Gold", bg: "bg-[#D97706]" },
    { value: "slate", label: "Slate", bg: "bg-[#475569]" },
    { value: "rose", label: "Rose", bg: "bg-[#E11D48]" },
    { value: "sky", label: "Sky Blue", bg: "bg-[#0284C7]" },
  ]

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Site Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your website content, contact info, and theme.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save All Changes"}
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {sections.map((section) => (
          <div key={section.title} className="rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                <section.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-card-foreground">{section.title}</h2>
                <p className="text-xs text-muted-foreground">{section.description}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-5">
              {section.fields.map((field) => {
                if ("isTheme" in field && field.isTheme) {
                  return (
                    <div key={field.key}>
                      <label className="mb-2 block text-sm font-medium text-card-foreground">
                        {field.label}
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {themeOptions.map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() => update(field.key, theme.value)}
                            className={`flex items-center gap-2 rounded-md border-2 px-4 py-2.5 text-sm font-medium transition-all ${
                              settings[field.key] === theme.value
                                ? "border-primary bg-primary/5 text-card-foreground"
                                : "border-border text-muted-foreground hover:border-primary/50"
                            }`}
                          >
                            <div className={`h-4 w-4 rounded-full ${theme.bg}`} />
                            {theme.label}
                          </button>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Theme changes will apply after saving and refreshing the page.
                      </p>
                    </div>
                  )
                }

                if ("multiline" in field && field.multiline) {
                  return (
                    <div key={field.key}>
                      <label className="mb-1 block text-sm font-medium text-card-foreground">
                        {field.label}
                      </label>
                      <textarea
                        value={settings[field.key] || ""}
                        onChange={(e) => update(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={3}
                        className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                      />
                    </div>
                  )
                }

                return (
                  <div key={field.key}>
                    <label className="mb-1 block text-sm font-medium text-card-foreground">
                      {field.label}
                    </label>
                    <div className="relative">
                      <field.icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        value={settings[field.key] || ""}
                        onChange={(e) => update(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm text-foreground outline-none ring-ring focus:ring-2"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-0 mt-6 flex items-center justify-end border-t border-border bg-background py-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : saved ? "Saved!" : "Save All Changes"}
        </button>
      </div>
    </>
  )
}

/* ─── Product Form Modal ─── */
function ProductFormModal({
  product,
  onClose,
  onSaved,
}: {
  product: DBProduct | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEditing = !!product
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [name, setName] = useState(product?.name || "")
  const [price, setPrice] = useState(product?.price?.toString() || "")
  const [description, setDescription] = useState(product?.description || "")
  const [category, setCategory] = useState(product?.category || "")
  const [sizes, setSizes] = useState(product?.sizes || "39,40,41,42,43,44,45")
  const [colors, setColors] = useState(product?.colors || "")
  const [inStock, setInStock] = useState(product?.in_stock !== false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError("")

    const body = {
      name,
      price: Number(price),
      description,
      category,
      sizes,
      colors,
      in_stock: inStock,
    }

    try {
      const url = isEditing ? `/api/admin/products/${product!.id}` : "/api/admin/products"
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        onSaved()
      } else {
        const data = await res.json()
        setError(data.error || "Failed to save product")
      }
    } catch {
      setError("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold text-card-foreground">
            {isEditing ? "Edit Product" : "Add Product"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-card-foreground">Price (NGN) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
                required
                min="0"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-card-foreground">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Oxford, Loafer"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-card-foreground">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-card-foreground">
                Sizes <span className="text-xs text-muted-foreground">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="39,40,41,42,43"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-card-foreground">
                Colors <span className="text-xs text-muted-foreground">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={colors}
                onChange={(e) => setColors(e.target.value)}
                placeholder="Black,Brown"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-ring focus:ring-2"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="in_stock"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <label htmlFor="in_stock" className="text-sm font-medium text-card-foreground">
              In Stock
            </label>
          </div>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
