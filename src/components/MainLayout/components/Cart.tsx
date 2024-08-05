import Badge from "@mui/material/Badge";
import CartIcon from "@mui/icons-material/ShoppingCart";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import { useCart } from "~/queries/cart";

export default function Cart() {
  const { data = [] } = useCart();

  const badgeContent =
    data.reduce((sum, item) => sum + item.count, 0) || undefined;

  return (
    // <IconButton color="inherit" component={Link} to="/cart" size="large">
    <IconButton color="inherit" size="large">
      <Badge badgeContent={badgeContent} color="secondary">
        <CartIcon />
      </Badge>
    </IconButton>
  );
}
