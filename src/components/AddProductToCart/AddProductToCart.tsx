import Typography from "@mui/material/Typography";
import { Product } from "~/models/Product";
import CartIcon from "@mui/icons-material/ShoppingCart";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { useCart, useInvalidateCart, useUpsertCart } from "~/queries/cart";
import { CartItemTask } from "~/models/CartItem";
import { Tooltip } from "@mui/material";

type AddProductToCartProps = {
  product: Product;
};

export default function AddProductToCart({ product }: AddProductToCartProps) {
  const { data, isFetching } = useCart();
  const { mutate: upsertCart } = useUpsertCart();
  const invalidateCart = useInvalidateCart();
  let cartItem: CartItemTask | null | undefined;
  if (data?.length) {
    cartItem = data?.find((i) => i.product_id === product.id);
  } else {
    cartItem = null;
  }

  const addProduct = () => {
    upsertCart(
      { product, count: cartItem ? cartItem.count + 1 : 1 },
      { onSuccess: invalidateCart }
    );
  };

  const removeProduct = () => {
    if (cartItem) {
      // upsertCart(
      // { ...cartItem, count: cartItem.count - 1 },
      // { onSuccess: invalidateCart }
      // );
    }
  };

  return cartItem ? (
    <>
      <Tooltip title="now you have to buy it!">
        <IconButton disabled={isFetching} onClick={removeProduct} size="large">
          <Remove color={"secondary"} />
        </IconButton>
      </Tooltip>
      <Typography align="center">{cartItem.count}</Typography>
      <IconButton disabled={isFetching} onClick={addProduct} size="large">
        <Add color={"secondary"} />
      </IconButton>
    </>
  ) : (
    <IconButton disabled={isFetching} onClick={addProduct} size="large">
      <CartIcon color={"secondary"} />
    </IconButton>
  );
}
