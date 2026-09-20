import { ProductItem } from '../types';
import { PRODUCTS_CATALOG } from '../data/companyData';

const CUSTOM_PRODUCTS_KEY = 'curome_custom_products';
const DELETED_PRODUCTS_KEY = 'curome_deleted_product_ids';
const PRODUCTS_UPDATED_EVENT = 'curome-products-updated';

/**
 * Loads custom products added via Admin Adon section from localStorage
 */
export function getCustomProducts(): ProductItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error loading custom products:', err);
    return [];
  }
}

/**
 * Loads list of product IDs marked as removed by the admin
 */
export function getDeletedProductIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DELETED_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error loading deleted product IDs:', err);
    return [];
  }
}

/**
 * Returns all active products: default catalog (minus deleted) + custom products published in Adon
 */
export function getAllLiveProducts(): ProductItem[] {
  const deletedIds = new Set(getDeletedProductIds());
  const custom = getCustomProducts();

  // Filter default catalog by deleted IDs
  const activeDefault = PRODUCTS_CATALOG.filter((p) => !deletedIds.has(p.id));

  // Custom products override or append
  const activeCustom = custom.filter((p) => !deletedIds.has(p.id));

  // Return custom first (new arrivals) followed by active defaults
  return [...activeCustom, ...activeDefault];
}

/**
 * Publishes a new product from the Adon admin section and immediately notifies the website
 */
export function publishAdonProduct(product: Omit<ProductItem, 'id'> & { id?: string }): ProductItem {
  const customList = getCustomProducts();
  
  const id = product.id || `adon-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newProduct: ProductItem = {
    ...product,
    id,
    badges: product.badges && product.badges.length > 0 ? product.badges : ['Adon Published', 'In Stock'],
    inStock: product.inStock ?? true,
    minOrderQty: product.minOrderQty || 1,
  };

  // Remove existing with same id if any, then prepend
  const updated = [newProduct, ...customList.filter((p) => p.id !== id)];

  try {
    localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(updated));
    // Remove from deleted if it was previously marked
    const deleted = getDeletedProductIds().filter((delId) => delId !== id);
    localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(deleted));
  } catch (err) {
    console.error('Failed to save published product to localStorage:', err);
  }

  // Trigger real-time event across app
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(PRODUCTS_UPDATED_EVENT, { detail: { product: newProduct, allProducts: getAllLiveProducts() } })
    );
  }

  return newProduct;
}

/**
 * Deletes or unpublishes a product (either custom or from default catalog)
 */
export function deleteLiveProduct(productId: string): void {
  // Remove from custom list if present
  const customList = getCustomProducts();
  const updatedCustom = customList.filter((p) => p.id !== productId);
  try {
    localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(updatedCustom));

    // Also record in deleted products to prevent default catalog appearance
    const deletedIds = getDeletedProductIds();
    if (!deletedIds.includes(productId)) {
      deletedIds.push(productId);
      localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(deletedIds));
    }
  } catch (err) {
    console.error('Failed to update deleted products in localStorage:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(PRODUCTS_UPDATED_EVENT, { detail: { deletedId: productId, allProducts: getAllLiveProducts() } })
    );
  }
}

/**
 * Subscribe to real-time product updates (when new products are published via Adon)
 */
export function subscribeToProducts(callback: (products: ProductItem[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = () => {
    callback(getAllLiveProducts());
  };

  window.addEventListener(PRODUCTS_UPDATED_EVENT, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(PRODUCTS_UPDATED_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
