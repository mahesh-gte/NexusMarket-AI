from fastapi import APIRouter
from app.utils.mock_products import products
from app.schemas.schemas import ProductCreate

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/")
def get_all_products():
    return products


@router.get("/{product_id}")
def get_product(product_id: int):
    for product in products:
        if product["id"] == product_id:
            return product
    return {"error": "Product not found"}


@router.get("/vendor/{vendor_id}")
def get_products_by_vendor(vendor_id: int):
    vendor_products = [
        product for product in products
        if product["vendor_id"] == vendor_id
    ]
    return vendor_products

@router.post("/", status_code=201)
def create_product(payload: ProductCreate):
    new_product = {
        "id": len(products) + 1,
        "name": payload.name,
        "price": payload.price,
        "stock": payload.stock,
        "category": payload.category,
        "vendor_id": payload.vendor_id
    }
    products.append(new_product)
    return new_product
