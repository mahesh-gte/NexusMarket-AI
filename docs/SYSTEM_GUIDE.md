# 🧠 AI Marketplace: System Intelligence Guide

Welcome to the **Market Interaction Platform**. This guide explains the hidden logic that powers your dashboard.

## 1. The Decision Loop
The platform operates on a **Closed-Loop Intelligence** model:
1.  **Interaction**: You place a simulated order or trigger a market event.
2.  **State Change**: The backend updates inventory levels and transaction logs.
3.  **Analytics Pulse**: The Frontend's `fetchData` cycle detects the change and pulls fresh data.
4.  **UI Reflow**: Interactive charts, KPI cards, and risk alerts update to reflect the new market state.

## 2. Market Events Logic
When you trigger an event in the **Control Center**, the system simulates real-world volatility:

| Event | Logic | Business Impact |
| :--- | :--- | :--- |
| **Flash Sale** | Multiplies simulated demand frequency. | Rapid revenue growth but high stock-out risk. |
| **Supply Shock** | Simulates logistics delays or factory shutdowns. | Forces AI to flag items for immediate replenishment. |
| **Vibe Check** | Randomly regenerates vendor reliability scores. | Identifies which partners are resilient under pressure. |

## 3. The AI Demand Forecaster
Our **Weighted Moving Average (WMA)** model doesn't just look at history; it looks at *frequency* and *recency*. 
- **Recency Bias**: Newer orders have a 3x higher impact on the forecast than old data.
- **Stock Sensitivity**: The "Alert" system triggers when `Stock < Forecasted Demand`.

## 4. How to "Break" the System (For Testing)
Try registering a vendor with a **Low Rating**, adding a product with **Low Stock**, and then triggering a **Flash Sale**. You will see the AI Dashboard turn "Red" as it identifies the inevitable inventory failure!
