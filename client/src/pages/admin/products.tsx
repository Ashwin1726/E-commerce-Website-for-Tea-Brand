import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { Link } from "wouter";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

import { useToast } from "../../hooks/use-toast";
import { useStore } from "../../lib/store";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../../lib/firebase";
import type { Product, ProductVariation } from "../../../../shared/schema";
import { packSizes } from "../../../../shared/schema";

const defaultVariations: ProductVariation[] = packSizes.map((size) => ({
  packSize: size,
  price: size * 15,
  stock: 100,
}));

export default function AdminProducts() {
  const { user } = useStore();
  const [, setLocation] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    description: "",
    category: "blue-tea",
    images: [""],
    tags: "",
    isFeatured: false,
    isNew: false,
    isBestseller: false,
    brewingInstructions: "",
    ingredients: "",
    variations: defaultVariations,
  });

  useEffect(() => {
    if (!user || (user && user.role !== "admin")) {
      setLocation("/");
      return;
    }
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, setLocation]);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNew = () => {
    setFormData({
      name: "",
      shortDescription: "",
      description: "",
      category: "blue-tea",
      images: [""],
      tags: "",
      isFeatured: false,
      isNew: true,
      isBestseller: false,
      brewingInstructions: "",
      ingredients: "",
      variations: defaultVariations,
    });
    setIsNewProduct(true);
    setEditProduct({} as Product);
  };

  const handleOpenEdit = (product: Product) => {
    setFormData({
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      category: product.category,
      images: product.images || [""],
      tags: (product.tags || []).join(", "),
      isFeatured: !!product.isFeatured,
      isNew: !!product.isNew,
      isBestseller: !!product.isBestseller,
      brewingInstructions: product.brewingInstructions || "",
      ingredients: product.ingredients || "",
      variations: product.variations || defaultVariations,
    });
    setIsNewProduct(false);
    setEditProduct(product);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Name and description are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const productData = {
        name: formData.name,
        shortDescription: formData.shortDescription || formData.description.slice(0, 100),
        description: formData.description,
        category: formData.category,
        images: formData.images.filter((img) => img && img.trim()),
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        isFeatured: formData.isFeatured,
        isNew: formData.isNew,
        isBestseller: formData.isBestseller,
        brewingInstructions: formData.brewingInstructions || undefined,
        ingredients: formData.ingredients || undefined,
        variations: formData.variations,
      };

      if (isNewProduct) {
        await createProduct(productData);
        toast({ title: "Product Created", description: `${formData.name} added successfully` });
      } else if (editProduct) {
        await updateProduct(editProduct.id, productData);
        toast({ title: "Product Updated", description: `${formData.name} updated successfully` });
      }

      setEditProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Save product error:", error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteProductId) return;

    try {
      await deleteProduct(deleteProductId);
      toast({ title: "Product Deleted", description: "Product removed successfully" });
      setDeleteProductId(null);
      fetchProducts();
    } catch (error) {
      console.error("Delete product error:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const updateVariation = (packSize: number, field: "price" | "stock", value: number) => {
    setFormData((prev) => ({
      ...prev,
      variations: prev.variations.map((v) =>
        v.packSize === packSize ? { ...v, [field]: value } : v
      ),
    }));
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin" data-testid="button-back-admin">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-serif text-3xl font-medium">Manage Products</h1>
            <p className="text-muted-foreground">
              {products.length} products
            </p>
          </div>
        </div>
        <Button onClick={handleOpenNew} data-testid="button-add-product">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-products"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No products found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} data-testid={`product-card-${product.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base line-clamp-1">{product.name}</CardTitle>
                  <div className="flex gap-1 flex-shrink-0">
                    {product.isFeatured && <Badge variant="default">Featured</Badge>}
                    {product.isNew && <Badge variant="secondary">New</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {product.shortDescription}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.variations.slice(0, 3).map((v) => (
                    <Badge key={v.packSize} variant="outline" className="text-xs">
                      {v.packSize}pc - Rs.{v.price}
                    </Badge>
                  ))}
                  {product.variations.length > 3 && (
                    <Badge variant="outline" className="text-xs">+{product.variations.length - 3}</Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleOpenEdit(product)}
                    data-testid={`button-edit-${product.id}`}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setDeleteProductId(product.id)}
                    data-testid={`button-delete-${product.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editProduct} onOpenChange={(open) => !open && setEditProduct(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isNewProduct ? "Add New Product" : "Edit Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="Premium Blue Tea"
                data-testid="input-product-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDesc">Short Description</Label>
              <Input
                id="shortDesc"
                value={formData.shortDescription}
                onChange={(e) => setFormData((p) => ({ ...p, shortDescription: e.target.value }))}
                placeholder="Brief product description"
                data-testid="input-short-description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Detailed product description"
                rows={4}
                data-testid="input-description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                  placeholder="blue-tea"
                  data-testid="input-category"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))}
                  placeholder="organic, premium"
                  data-testid="input-tags"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={formData.images[0] || ""}
                onChange={(e) => setFormData((p) => ({ ...p, images: [e.target.value] }))}
                placeholder="https://..."
                data-testid="input-image"
              />
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={formData.isFeatured}
                  onCheckedChange={(c) => setFormData((p) => ({ ...p, isFeatured: c }))}
                  data-testid="switch-featured"
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="new"
                  checked={formData.isNew}
                  onCheckedChange={(c) => setFormData((p) => ({ ...p, isNew: c }))}
                  data-testid="switch-new"
                />
                <Label htmlFor="new">New</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="bestseller"
                  checked={formData.isBestseller}
                  onCheckedChange={(c) => setFormData((p) => ({ ...p, isBestseller: c }))}
                  data-testid="switch-bestseller"
                />
                <Label htmlFor="bestseller">Bestseller</Label>
              </div>
            </div>
            <div className="space-y-3">
              <Label>Price & Stock by Pack Size</Label>
              <div className="grid gap-3">
                {formData.variations.map((v) => (
                  <div key={v.packSize} className="flex items-center gap-4">
                    <span className="w-20 text-sm text-muted-foreground">Pack of {v.packSize}</span>
                    <div className="flex-1 flex gap-2">
                      <Input
                        type="number"
                        value={v.price}
                        onChange={(e) => updateVariation(v.packSize, "price", Number(e.target.value))}
                        placeholder="Price"
                        className="w-24"
                        data-testid={`input-price-${v.packSize}`}
                      />
                      <Input
                        type="number"
                        value={v.stock}
                        onChange={(e) => updateVariation(v.packSize, "stock", Number(e.target.value))}
                        placeholder="Stock"
                        className="w-24"
                        data-testid={`input-stock-${v.packSize}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProduct(null)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} data-testid="button-save-product">
              {saving ? "Saving..." : isNewProduct ? "Create Product" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteProductId} onOpenChange={(open) => !open && setDeleteProductId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
