import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaEnvelope, FaStar } from 'react-icons/fa';

const Vendors = () => {
    const [vendors, setVendors] = useState([]);
    const [formData, setFormData] = useState({ name: '', email: '', rating: 5.0 });
    const [status, setStatus] = useState(null);

    const fetchVendors = async () => {
        try {
            const res = await fetch('http://localhost:8000/vendors/');
            if (res.ok) {
                const data = await res.json();
                setVendors(data);
            }
        } catch (err) {
            console.error("Failed to fetch vendors");
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8000/vendors/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setStatus({ type: 'success', message: 'Vendor registered successfully!' });
                setFormData({ name: '', email: '', rating: 5.0 });
                fetchVendors();
                setTimeout(() => setStatus(null), 3000);
            } else {
                setStatus({ type: 'error', message: 'Registration failed.' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'API unreachable.' });
        }
    };

    return (
        <div className="vendors-page">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1>Vendor Ecosystem</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Manage your global partner network.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div className="card">
                    <h2>Active Partners</h2>
                    <div className="vendor-list" style={{ marginTop: '1.5rem' }}>
                        {vendors.map(v => (
                            <div key={v.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '12px',
                                marginBottom: '0.75rem',
                                border: '1px solid var(--glass-border)'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '600' }}>{v.name}</div>
                                    <small style={{ color: 'var(--text-muted)' }}>{v.email}</small>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
                                    <FaStar /> {v.rating}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h2>Register Partner</h2>
                    <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                            <input
                                className="input-premium"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.8rem', borderRadius: '10px', color: 'white' }}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                            <input
                                type="email"
                                className="input-premium"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.8rem', borderRadius: '10px', color: 'white' }}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-premium">
                            <FaUserPlus style={{ marginRight: '0.5rem' }} /> Add to Platform
                        </button>
                        {status && (
                            <div style={{
                                padding: '0.75rem',
                                borderRadius: '10px',
                                background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: status.type === 'success' ? 'var(--success)' : 'var(--danger)',
                                fontSize: '0.8rem',
                                textAlign: 'center'
                            }}>
                                {status.message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Vendors;
