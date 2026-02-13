# 🚀 NexusMarket-AI

<div align="center">
  <h3><b>Transforming Marketplaces with Predictive Intelligence</b></h3>
  <p><b>A high-fidelity multi-vendor operational simulation platform powered by predictive AI. Features real-time WMA demand forecasting, interactive market event injection (Flash Sales & Supply Shocks), and a persona-driven vendor ecosystem for strategic market intelligence.</b></p>
  
  ---
  
  **Project Lead**: Mahesh | **Core Team**: Gourav | Rahul Rathod
</div>

---

## 🏢 **Core Execution Matrix**

The platform development was divided into three strategic sectors, each led by a core team member. 

````carousel
### 🏗️ **Mahesh: Intelligence & Logistics**

**Focus**: Market Stability & Simulation Logic
- **Logistics Core**: Designed the "Mahesh Logistics AI" vendor network.
- **Volatility Engine**: Implemented the "Supply Chain Shock" logic to test system resilience.
- **Reporting Layer**: Developed the functional CSV export system for enterprise audits.
- **Leadership**: Orchestrated the full-stack synchronization between ML outputs and UI reflows.

<!-- slide -->

### 📊 **Rahul: Data Science & Tech Catalog**

**Focus**: Predictive Modeling & Hardware Optimization
- **The Forecaster**: Built the custom Weighted Moving Average (WMA) engine in Python.
- **Velocity Tracking**: Implemented the real-time simulation logic for "RahulCorp AI".
- **Hardware Stack**: Curated the Computing & Tech catalog, ensuring high-frequency data for the AI.
- **API Architecture**: Optimized the FastAPI routing for sub-100ms analytics retrieval.

<!-- slide -->

### 🎨 **Gourav: UI Architect & Wellness**

**Focus**: User Experience & Interaction Design
- **Visual Identity**: Crafted the premium Glassmorphic UI and vibrant dark-mode palette.
- **Interaction Loop**: Designed the "Market Control Center" and onboarding experience.
- **Wellness Sector**: Curated the "GouravTech AI" Wellness & Ergonomics portfolio.
- **Intelligence Guide**: Wrote the interactive system documentation for new operators.
````

---

## 🔬 **Technical Deep-Dive**

### **1. The Interaction Loop**
The system uses a **State-Sync Architecture**. When a user triggers a "Flash Sale":
1.  **Frontend** emits an event to the `/orders/` endpoint.
2.  **Backend** updates the `orders` and `products` state in memory.
3.  **Analytics Layer** re-calculates the WMA Forecast.
4.  **Dashboard** re-fetches the stats, causing the charts to "animate" to their new positions.

### **2. Weighted Moving Average (WMA)**
Unlike simple averages, our engine applies a **3x Recency Bias**.
$$ Forecast = \frac{(W_1 \times V_{t}) + (W_2 \times V_{t-1}) + (W_3 \times V_{t-2})}{\sum W} $$
*Where $V_t$ is the velocity of the latest simulated orders.*

---

## 🚀 **Quick Start Guide**

### **1. Backend Engine**
```bash
cd backend
python -m venv venv
# Activate: venv\Scripts\activate (Win) or source venv/bin/activate (Mac)
pip install -r requirements.txt
uvicorn app.main:app --reload
```
🔗 **Interactive Docs**: `http://localhost:8000/docs`

### **2. Frontend Dashboard**
```bash
cd frontend
npm install
npm run dev
```
🔗 **Live App**: `http://localhost:5173`

---

## 🚀 **What's New in v2.3?**
-   ✅ **Personalized Personas**: Custom vendor networks for Rahul, Mahesh, and Gourav.
-   ✅ **Full Simulation Persistence**: Orders now process and save to history in one click.
-   ✅ **Functional CSV Reporting**: Downloadable market analytics for business review.
-   ✅ **Animated README**: Advanced carousel-based team division.
-   ✅ **Interactive Onboarding**: Guided walkthrough built directly into the dashboard.

---

<div align="center">
  <p>Built with ❤️ by the High-Performance Market Intelligence Team</p>
  <p><b>Rahul Rathod | Mahesh | Gourav</b></p>
</div>
