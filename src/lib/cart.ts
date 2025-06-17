import { CartItem } from "@/types";

/**
 * Calculates the total price of all items in a cart.
 * @param {CartItem[]} cartItems - The array of cart items.
 * @returns {number} - The total price.
 */
export function getCartTotal(cartItems: CartItem[]): number {
  return cartItems.reduce((total, item) => {
    if (!item || !item.product) return total;
    return total + item.product.price * item.quantity;
  }, 0);
}

/**
 * A placeholder function to simulate getting gumroad items.
 * In a real scenario, this would filter cart items by source.
 * @param {CartItem[]} cartItems - The array of cart items.
 * @returns {CartItem[]} - The filtered array of Gumroad cart items.
 */
export function getGumroadItemsFromCartData(cartItems: CartItem[]): CartItem[] {
  // Assuming all items are from Gumroad for this implementation
  return cartItems;
} 