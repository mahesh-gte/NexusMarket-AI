from fastapi import APIRouter
from app.utils.mock_orders import cart, orders
from app.utils.mock_products import products

router = APIRouter(prefix="/orders", tags=["Orders"])


from app.schemas.schemas import CartAdd

@router.post("/cart/add")
def add_to_cart(payload: CartAdd):
    product_id = payload.product_id
    quantity = payload.quantity
    
    # Find product
    product = next((p for p in products if p["id"] == product_id), None)

    if not product:
        return {"error": "Product not found"}

    cart_item = {
        "product_id": product_id,
        "name": product["name"],
        "price": product["price"],
        "quantity": quantity
    }

    cart.append(cart_item)

    return {
        "message": "Item added to cart",
        "cart": cart
    }


@router.get("/cart")
def view_cart():
    return cart


@router.post("/place")
def place_order():
    if not cart:
        return {"error": "Cart is empty"}

    # ---------------------------
    # Step 1: Check stock
    # ---------------------------
    for item in cart:
        product = next(
            (p for p in products if p["id"] == item["product_id"]),
            None
        )

        if not product:
            return {"error": f"Product {item['product_id']} not found"}

        if product["stock"] < item["quantity"]:
            return {
                "error": f"Insufficient stock for {product['name']}",
                "available_stock": product["stock"]
            }

    # ---------------------------
    # Step 2: Reduce stock
    # ---------------------------
    for item in cart:
        product = next(p for p in products if p["id"] == item["product_id"])
        product["stock"] -= item["quantity"]

    # ---------------------------
    # Step 3: Create order
    # ---------------------------
    order = {
        "order_id": len(orders) + 1,
        "items": cart.copy(),
        "status": "PLACED"
    }

    orders.append(order)
    cart.clear()

    return {
        "message": "Order placed successfully",
        "order": order
    }


@router.get("/")
def get_all_orders():
    return orders
