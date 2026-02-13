import React, { useState, useEffect } from 'react';
import { FaHistory, FaCheckCircle, FaClock } from 'react-icons/fa';

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('http://localhost:8000/orders/');
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (err) {
                console.error("Failed to fetch orders");
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="orders-page">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1>Simulation History</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Track and analyze all marketplace transactions.</p>
            </header>

            <div className="card">
                <h2>Transaction Log</h2>
                <div style={{ marginTop: '1.5rem' }}>
                    {orders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            <FaClock size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>No orders recorded yet. Start a simulation from the Dashboard!</p>
                        </div>
                    ) : (
                        orders.map(o => (
                            <div key={o.order_id} style={{
                                padding: '1.5rem',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '16px',
                                marginBottom: '1rem',
                                border: '1px solid var(--glass-border)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div>
                                        <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>Order #{o.order_id}</span>
                                        <div style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            marginLeft: '1rem',
                                            padding: '2px 8px',
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            color: 'var(--success)',
                                            borderRadius: '6px',
                                            fontSize: '0.7rem',
                                            fontWeight: '700'
                                        }}>
                                            <FaCheckCircle /> {o.status}
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '700', color: 'var(--primary)' }}>
                                        Total: ${o.items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
                                    </div>
                                </div>
                                <div className="order-items">
                                    {o.items.map((item, idx) => (
                                        <div key={idx} style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                                            <span>{item.name} x {item.quantity}</span>
                                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;
