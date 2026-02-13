import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaChartLine, FaStore, FaBox, FaShoppingBag, FaRobot } from 'react-icons/fa';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--grad-main)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem'
                }}>
                    <FaRobot color="white" />
                </div>
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>Core AI</h2>
                    <small style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Enterprise v2.0
                    </small>
                </div>
            </div>

            <nav style={{ flex: 1 }}>
                <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <FaChartLine /> Dashboard
                </NavLink>
                <NavLink to="/vendors" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <FaStore /> Vendors
                </NavLink>
                <NavLink to="/products" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <FaBox /> Products
                </NavLink>
                <NavLink to="/orders" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <FaShoppingBag /> Orders
                </NavLink>
            </nav>

            <div style={{ marginTop: 'auto', padding: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <small style={{ fontWeight: '600' }}>AI Core Status</small>
                    <span style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%', boxShadow: '0 0 10px var(--success)' }}></span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    All systems operational
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
