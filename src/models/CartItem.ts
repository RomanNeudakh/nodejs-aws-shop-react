import { Product } from "~/models/Product";

export type CartItem = {
  product: Product;
  count: number;
};
export type CartItemTask = {
  cart_id: string;
  product_id: string;
  count: number;
};
