from fastapi import APIRouter, HTTPException
from app.utils.mock_products import products
from app.utils.mock_orders import orders
from app.utils.mock_data import vendors
from app.ml.forecasting import get_product_analytics
import random

router = APIRouter(prefix="/analytics", tags=["Analytics & AI"])

@router.get("/dashboard")
def get_dashboard_stats():
    """
    Aggregated stats for the admin dashboard.
    """
    total_products = len(products)
    total_orders = len(orders)
    # Estimate revenue (mock)
    total_revenue = sum([o.get('total', 0) for o in orders]) if orders else 12500.50
    
    # Count basic risks
    high_risk_items = 0
    categories = {}
    
    for p in products:
        # Category distribution
        cat = p.get('category', 'Computing & Tech')
        categories[cat] = categories.get(cat, 0) + 1
        
        # Risk analysis
        analytics = get_product_analytics(p['id'], p['stock'])
        if analytics['stock_out_risk'] == 'High':
            high_risk_items += 1

    return {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "total_products": total_products,
        "stock_alerts": high_risk_items,
        "category_distribution": categories,
        "active_vendors": len(vendors)
    }

@router.get("/forecast/{product_id}")
def get_product_forecast(product_id: int):
    """
    Get AI-driven demand forecast and sales history for a specific product.
    """
    product = next((p for p in products if p["id"] == product_id), None)
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    analytics = get_product_analytics(product_id, product["stock"])
    
    return {
        "product_name": product["name"],
        **analytics
    }

@router.get("/vendor-performance")
def get_vendor_performance():
    """
    Returns AI-scored vendor performance metrics.
    """
    performance_data = []
    for v in vendors:
        # Synthetic reliability score based on rating and random factors
        reliability = min(100, (v['rating'] * 20) + random.randint(-5, 5))
        delivery_score = random.randint(80, 98)
        
        performance_data.append({
            "vendor_name": v['name'],
            "reliability_score": reliability,
            "delivery_on_time": delivery_score,
            "fulfillment_rate": random.randint(90, 100)
        })
    
    return performance_data
