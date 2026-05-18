import axiosInstance from "@/api/axiosInstance";
import type {
  Category,
  PaginationResponse,
  Product,
} from "@/types/product.types";

import { useEffect, useState } from "react";

import ProductModal, { type ProductForm } from "./ProductModal";
import DeleteConfirm from "./DeleteConfirm";
import ProductStats from "./ProductStats";
import ProductToolbar from "./ProductToolbar";
import ProductTable from "./ProductTable";
import ProductDetailModal from "./ProductDetailModal";

import { PAGE_SIZE } from "@/utils/utils";

type ModalMode = "add" | "edit" | null;

const emptyForm = (): ProductForm => ({
  productId: "",
  productName: "",
  price: 0,
  quantity: 0,
  discount: 0,
  status: true,
  description: "",
  categoryId: 0,
  image: null,
});

export default function ProductsPage() {
  // ─── States ───────────────────────────────────────────

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [status, setStatus] = useState<boolean | "">("");

  const [page, setPage] = useState(0);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const [form, setForm] = useState<ProductForm>(emptyForm());

  // ─── Fetch Categories ────────────────────────────────

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get<PaginationResponse<Category>>(
          "categories",
          {
            params: {
              status: true,
              pageSize: 100,
            },
          },
        );

        setCategories(res.data.content);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  // ─── Fetch Products ──────────────────────────────────

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const params: Record<string, unknown> = {
        pageNumber: page,
        pageSize: PAGE_SIZE,
        sortBy: "id",
        sortOrder: "asc",
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (categoryId !== "") {
        params.categoryId = categoryId;
      }

      if (status !== "") {
        params.status = status;
      }

      const res = await axiosInstance.get<PaginationResponse<Product>>(
        "products",
        {
          params,
        },
      );

      setProducts(res.data.content);
      setTotalElements(res.data.totalElements);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, categoryId, status]);

  // ─── Stats ───────────────────────────────────────────

  const activeCount = products.filter((p) => p.status).length;

  const outStockCount = products.filter((p) => p.quantity === 0).length;

  // ─── Modal ───────────────────────────────────────────

  const openAdd = () => {
    setForm(emptyForm());
    setModalMode("add");
  };

  const openEdit = (product: Product) => {
    setForm({
      productId: product.productId,
      productName: product.productName,
      price: product.price,
      quantity: product.quantity,
      discount: product.discount,
      status: product.status,
      description: product.description,
      categoryId: product.category.categoryId,
      image: null,
    });

    setEditingId(product.productId);

    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingId(null);
  };

  // ─── Form Change ─────────────────────────────────────

  const handleFormChange = (
    field: keyof ProductForm,
    value: string | number | boolean | File | null,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ─── Save ────────────────────────────────────────────

  const handleSave = async () => {
    if (!form.productName.trim() || !form.price || form.categoryId === 0) {
      return;
    }

    const fd = new FormData();

    fd.append("productId", form.productId);
    fd.append("productName", form.productName);
    fd.append("price", String(form.price));
    fd.append("quantity", String(form.quantity));
    fd.append("discount", String(form.discount));
    fd.append("status", String(form.status));
    fd.append("description", form.description);
    fd.append("categoryId", String(form.categoryId));

    if (form.image) {
      fd.append("image", form.image);
    }

    setSaving(true);

    try {
      if (modalMode === "edit" && editingId !== null) {
        await axiosInstance.put("products", fd);
      } else {
        await axiosInstance.post("products", fd);
      }

      closeModal();

      setPage(0);

      await fetchProducts();
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await axiosInstance.delete(`products/${deleteTarget.productId}`);

      setDeleteTarget(null);

      await fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  // ─── Render ──────────────────────────────────────────

  return (
    <>
      <ProductStats
        total={totalElements}
        active={activeCount}
        outStock={outStockCount}
      />

      <ProductToolbar
        search={search}
        setSearch={setSearch}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        status={status}
        setStatus={setStatus}
        categories={categories}
        onAdd={openAdd}
        setPage={setPage}
      />
      <ProductTable
        products={products}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteTarget}
        onView={setDetailProduct}
      />
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
        />
      )}

      {modalMode && (
        <ProductModal
          mode={modalMode}
          form={form}
          categories={categories}
          onChange={handleFormChange}
          onSave={handleSave}
          onClose={closeModal}
          saving={saving}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          product={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm">
        <span>
          Trang {page + 1} / {totalPages}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded-lg disabled:opacity-40"
          >
            Prev
          </button>

          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded-lg disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
