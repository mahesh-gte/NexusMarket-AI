from pydantic import BaseModel
from typing import List, Optional

class CartItem(BaseModel):
    product_id: int
    quantity: int

class CartAdd(BaseModel):
    product_id: int
    quantity: int = 1

class OrderItem(BaseModel):
    product_id: int
    name: str
    price: float
    quantity: int

class OrderSchema(BaseModel):
    order_id: int
    items: List[OrderItem]
    status: str

class ProductCreate(BaseModel):
    name: str
    price: float
    stock: int
    category: str = "General"
    vendor_id: int

class VendorCreate(BaseModel):
    name: str
    email: str
    rating: float = 0.0
