import random
from datetime import datetime, timedelta

def generate_sales_history(months=12):
    """
    Generates synthetic sales history for the past 'months'.
    Includes trend volatility and clearer seasonality.
    """
    history = []
    current_date = datetime.now()
    
    # Base level for the product
    base_sales = random.randint(100, 500)
    # Dynamic trend (growth/decline)
    growth_rate = random.uniform(0.98, 1.05)
    
    for i in range(months, 0, -1):
        date = current_date - timedelta(days=30*i)
        month_str = date.strftime("%Y-%m")
        
        # Seasonality factors
        seasonality = 1.0
        if date.month in [11, 12]: # Holiday peak
            seasonality = 1.4
        elif date.month in [1, 2]: # Post-holiday dip
            seasonality = 0.8
        elif date.month in [6, 7]: # Summer boost
            seasonality = 1.1

        # Calculate sales with trend, seasonality and some volatility
        expected_sales = base_sales * (growth_rate ** (months - i)) * seasonality
        noise = random.uniform(0.85, 1.15) # 15% random variation
        sales = int(expected_sales * noise)
        sales = max(0, sales)
        
        history.append({
            "month": month_str,
            "sales": sales
        })
        
    return history

def predict_next_month_demand(history):
    """
    Weighted Moving Average (WMA) forecast.
    Gives more weight to recent months: (M1*0.5 + M2*0.3 + M3*0.2)
    """
    if not history or len(history) < 3:
        return 0
        
    m1 = history[-1]['sales'] # Most recent
    m2 = history[-2]['sales']
    m3 = history[-3]['sales']
    
    # WMA calculation
    wma = (m1 * 0.5) + (m2 * 0.3) + (m3 * 0.2)
    
    # Add a buffer for safety (15%)
    forecast = int(wma * 1.15) 
    return forecast

def calculate_stock_out_risk(current_stock, predicted_monthly_demand):
    """
    Enhanced Risk Score based on daily velocity coverage.
    - Critical (High): < 7 days
    - Warning (Medium): < 15 days
    - Healthy (Low): >= 15 days
    """
    if predicted_monthly_demand <= 0:
        return "Low"
        
    daily_demand = predicted_monthly_demand / 30
    days_coverage = current_stock / daily_demand if daily_demand > 0 else 999
    
    if days_coverage < 7:
        return "High"
    elif days_coverage < 15:
        return "Medium"
    else:
        return "Low"

def get_product_analytics(product_id, current_stock):
    """
    Orchestrates the analytics generation for a single product.
    """
    history = generate_sales_history()
    forecast = predict_next_month_demand(history)
    risk = calculate_stock_out_risk(current_stock, forecast)
    
    return {
        "product_id": product_id,
        "sales_history": history,
        "forecast_next_month": forecast,
        "stock_out_risk": risk,
        "last_updated": datetime.now().isoformat()
    }
