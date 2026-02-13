from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from app.routes import vendor, product, order

# Create FastAPI app
app = FastAPI(
    title="AI-Powered Multi-Vendor E-Commerce",
    description="Backend API (DB-less phase) for multi-vendor e-commerce system",
    version="1.0.0"
)

# --------------------
# CORS Configuration
# --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Allow all in dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# Routes Registration
# --------------------
app.include_router(vendor.router)
app.include_router(product.router)
app.include_router(order.router)
# Register Analytics Router
from app.routes import analytics
app.include_router(analytics.router)

# --------------------
# Health Check
# --------------------
@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "UP",
        "service": "AI Multi-Vendor E-Commerce Backend",
        "mode": "DB-less / In-Memory"
    }

# --------------------
# Root Endpoint
# --------------------
@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to AI-Powered Multi-Vendor E-Commerce Backend",
        "available_endpoints": [
            "/vendors",
            "/products",
            "/orders",
            "/docs"
        ]
    }
