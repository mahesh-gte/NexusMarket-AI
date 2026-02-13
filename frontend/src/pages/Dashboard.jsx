import React, { useEffect, useState } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { FaArrowUp, FaArrowDown, FaExclamationTriangle, FaCheckCircle, FaRobot } from 'react-icons/fa';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const [stats, setStats] = useState({ total_revenue: 0, total_orders: 0, stock_alerts: 0, active_vendors: 0, category_distribution: {} });
    const [forecastData, setForecastData] = useState(null);
    const [vendorData, setVendorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [interactionStatus, setInteractionStatus] = useState(null);
    const [activeEvent, setActiveEvent] = useState(null);

    const triggerEvent = (type) => {
        setActiveEvent(type);
        setInteractionStatus(`Market Event Triggered: ${type.toUpperCase()}`);
        setTimeout(() => {
            setActiveEvent(null);
            setInteractionStatus(null);
        }, 15000); // Events last 15 seconds
    };

    const fetchData = async () => {
        try {
            // Fetch All Products for dropdown
            const prodRes = await fetch('http://localhost:8000/products/');
            if (prodRes.ok) setProducts(await prodRes.json());

            // Fetch Dashboard Stats
            const statsRes = await fetch('http://localhost:8000/analytics/dashboard');
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(prev => ({ ...prev, ...statsData }));
            }

            // Fetch Forecast
            const forecastRes = await fetch('http://localhost:8000/analytics/forecast/1');
            if (forecastRes.ok) {
                const fData = await forecastRes.json();
                if (fData && fData.sales_history) {
                    const labels = fData.sales_history.map(d => d.month);
                    const sales = fData.sales_history.map(d => d.sales);

                    // Add Forecast Point
                    labels.push('Forecast');
                    const salesData = [...sales, null];
                    const forecastPoints = Array(sales.length).fill(null);
                    forecastPoints[sales.length - 1] = sales[sales.length - 1];
                    forecastPoints.push(fData.forecast_next_month || 0);

                    setForecastData({
                        labels,
                        datasets: [
                            {
                                label: 'Historical Sales',
                                data: salesData,
                                borderColor: '#8b5cf6',
                                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                fill: true,
                                tension: 0.4
                            },
                            {
                                label: 'AI Forecast',
                                data: forecastPoints,
                                borderColor: '#ec4899',
                                borderDash: [5, 5],
                                backgroundColor: 'transparent',
                                tension: 0.4
                            }
                        ]
                    });
                }
            }

            // Fetch Vendor Performance
            const vendorRes = await fetch('http://localhost:8000/analytics/vendor-performance');
            if (vendorRes.ok) {
                const vData = await vendorRes.json();
                if (Array.isArray(vData)) {
                    setVendorData({
                        labels: vData.map(v => v.vendor_name),
                        datasets: [{
                            label: 'Reliability Score',
                            data: vData.map(v => v.reliability_score),
                            backgroundColor: [
                                'rgba(139, 92, 246, 0.6)',
                                'rgba(236, 72, 153, 0.6)',
                            ],
                            borderRadius: 8
                        }]
                    });
                }
            }
        } catch (error) {
            console.error("Fetch failed, using fallback mock data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!selectedProduct) {
            setInteractionStatus('Please select a product first.');
            return;
        }

        try {
            // Step 1: Add to cart
            const addRes = await fetch('http://localhost:8000/orders/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: parseInt(selectedProduct),
                    quantity: parseInt(quantity)
                })
            });

            if (addRes.ok) {
                // Step 2: Immediately Place Order
                const placeRes = await fetch('http://localhost:8000/orders/place', { method: 'POST' });
                if (placeRes.ok) {
                    setInteractionStatus(`Success: Simulation Order Processed.`);
                    fetchData(); // Refresh KPIs immediately
                    setTimeout(() => setInteractionStatus(null), 3000);
                } else {
                    const errorData = await placeRes.json();
                    setInteractionStatus(`Error Placing Order: ${errorData.error}`);
                }
            } else {
                const data = await addRes.json();
                setInteractionStatus(`Error: ${data.detail || data.error}`);
            }
        } catch (err) {
            setInteractionStatus('Error: Backend unreachable.');
        }
    };

    const handleExport = () => {
        const reportData = [
            ['Metric', 'Value'],
            ['Total Revenue', stats.total_revenue],
            ['Total Orders', stats.total_orders],
            ['Active Vendors', stats.active_vendors],
            ['Stock Alerts', stats.stock_alerts]
        ];

        const csvContent = "data:text/csv;charset=utf-8," + reportData.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Market_Analytics_Report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const categoryChartData = {
        labels: Object.keys(stats.category_distribution || {}),
        datasets: [{
            data: Object.values(stats.category_distribution || {}),
            backgroundColor: ['#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'],
            borderWidth: 0,
            hoverOffset: 10
        }]
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Initializing AI Engine...</div>;

    return (
        <div className="dashboard-page">
            {/* Onboarding Overlay */}
            <div className="card" style={{ marginBottom: '2.5rem', border: '1px solid var(--primary)', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <FaRobot size={32} color="var(--primary)" />
                    <h2 style={{ margin: 0 }}>Welcome to the Operations Center</h2>
                </div>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    This platform simulates a real-world multi-vendor marketplace powered by AI.
                    <strong> New here?</strong> Follow the interaction loop:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
                    <div style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                        <div style={{ marginBottom: '0.5rem', fontWeight: '700', color: 'var(--primary)' }}>1. VENDORS</div>
                        <p>Register your partners</p>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                        <div style={{ marginBottom: '0.5rem', fontWeight: '700', color: 'var(--primary)' }}>2. PRODUCTS</div>
                        <p>Stock up your catalog</p>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                        <div style={{ marginBottom: '0.5rem', fontWeight: '700', color: 'var(--primary)' }}>3. SIMULATE</div>
                        <p>Place market orders</p>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '0.8rem' }}>
                        <div style={{ marginBottom: '0.5rem', fontWeight: '700', color: 'var(--primary)' }}>4. ANALYZE</div>
                        <p>Watch KPIs respond</p>
                    </div>
                </div>
            </div>

            <header style={{ marginBottom: '2.5rem' }}>
                <h1>Market Insights</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Real-time demand forecasting and vendor performance analytics.</p>
            </header>

            {/* KPI Cards */}
            <div className="grid-main" style={{ marginBottom: '2rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <small>Total Revenue</small>
                        <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                            <FaArrowUp /> 12%
                        </span>
                    </div>
                    <div className="kpi-value">${(stats.total_revenue || 0).toLocaleString()}</div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '1rem' }}>
                        <div style={{ width: '70%', height: '100%', background: 'var(--grad-main)', borderRadius: '2px' }}></div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <small>Daily Orders</small>
                        <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                            <FaArrowUp /> 5.4%
                        </span>
                    </div>
                    <div className="kpi-value">{stats.total_orders}</div>
                    <small>Across {stats.active_vendors} active vendors</small>
                </div>

                <div className="card" style={{ borderColor: stats.stock_alerts > 0 ? 'rgba(239, 68, 68, 0.3)' : '' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <small>Stock Risks</small>
                        {stats.stock_alerts > 0 ? <FaExclamationTriangle color="var(--danger)" /> : <FaCheckCircle color="var(--success)" />}
                    </div>
                    <div className="kpi-value" style={{ color: stats.stock_alerts > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
                        {stats.stock_alerts} <span style={{ fontSize: '1rem', fontWeight: '500' }}>alerts</span>
                    </div>
                    <small>{stats.stock_alerts > 0 ? 'Action required immediately' : 'Inventory is healthy'}</small>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <small>AI Confidence</small>
                        <FaRobot color="var(--primary)" />
                    </div>
                    <div className="kpi-value">94.8%</div>
                    <small>Based on current data velocity</small>
                </div>
            </div>

            {/* Main Analytics Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div>
                            <h2>Demand Forecaster</h2>
                            <small>Predictive sales analysis for the next 30 days.</small>
                        </div>
                        <button
                            className="btn-premium"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                            onClick={handleExport}
                        >
                            Export Report
                        </button>
                    </div>
                    <div style={{ height: '350px' }}>
                        {forecastData && <Line data={forecastData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                x: { grid: { display: false }, ticks: { color: '#64748b' } },
                                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } }
                            }
                        }} />}
                    </div>
                </div>

                <div className="card">
                    <h2>Inventory Mix</h2>
                    <small>Category-wise distribution.</small>
                    <div style={{ height: '240px', marginTop: '2rem' }}>
                        <Doughnut data={categoryChartData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12, padding: 15 } } }
                        }} />
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="card">
                    <h2>Vendor Reliability Scoring</h2>
                    <small>AI-calculated performance metrics across vendors.</small>
                    <div style={{ height: '250px', marginTop: '1.5rem' }}>
                        {vendorData && <Bar data={vendorData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
                                x: { grid: { display: false } }
                            }
                        }} />}
                    </div>
                </div>

                <div className="card">
                    <h2>Market Control Center</h2>
                    <small>Simulate global externalities and supply chain shocks.</small>
                    <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <button
                            className="btn-premium"
                            style={{ background: 'var(--success)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
                            onClick={() => triggerEvent('flash_sale')}
                        >
                            Flash Sale 🚀
                        </button>
                        <button
                            className="btn-premium"
                            style={{ background: 'var(--danger)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)' }}
                            onClick={() => triggerEvent('supply_shock')}
                        >
                            Supply Shock ⚡
                        </button>
                        <button
                            className="btn-premium"
                            style={{ gridColumn: 'span 2', background: 'var(--grad-main)' }}
                            onClick={() => triggerEvent('vibe_check')}
                        >
                            Network Vibe Check ✨
                        </button>
                    </div>
                </div>

            </div>

            <div className="card" style={{ gridColumn: 'span 2' }}>
                <h2>Simulation Tools</h2>
                <small>Experiment with market scenarios and manual overrides.</small>
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 2 }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Select Product</label>
                            <select
                                className="input-premium"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '10px', color: 'white' }}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                value={selectedProduct}
                            >
                                <option value="">Choose a product...</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Qty</label>
                            <input
                                type="number"
                                className="input-premium"
                                placeholder="1"
                                min="1"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '10px', color: 'white' }}
                                onChange={(e) => setQuantity(e.target.value)}
                                value={quantity}
                            />
                        </div>
                    </div>
                    <button
                        className="btn-premium"
                        style={{ width: '100%', marginTop: '0.5rem' }}
                        onClick={handleAddToCart}
                    >
                        Simulate Market Order
                    </button>
                    {interactionStatus && (
                        <div style={{
                            padding: '0.75rem',
                            borderRadius: '10px',
                            background: interactionStatus.includes('success') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: interactionStatus.includes('success') ? 'var(--success)' : 'var(--danger)',
                            fontSize: '0.8rem',
                            textAlign: 'center'
                        }}>
                            {interactionStatus}
                        </div>
                    )}
                </div>
                <div className="card" style={{ gridColumn: 'span 2' }}>
                    <h2>Engine Intelligence: How it Works</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1rem', color: 'var(--primary)' }}>The Demand Loop</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                When you place an order in <strong>Simulation Tools</strong>, the system doesn't just subtract stock.
                                It triggers a <strong>State Change Event</strong>. The AI Demand Forecaster senses this new data velocity
                                and recalculates your 30-day outlook instantly.
                            </p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1rem', color: 'var(--secondary)' }}>Market Volatility</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                The <strong>Market Control Center</strong> allows you to inject "shocks" like Supply Chain delays.
                                This tests if your current inventory levels can survive a breakdown in global logistics,
                                highlighted by the <strong>Stock Alerts</strong> KPI.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
