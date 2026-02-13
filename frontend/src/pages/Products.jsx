import React, { useState, useEffect } from 'react';
import { FaPlus, FaTag, FaBoxOpen } from 'react-icons/fa';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [formData, setFormData] = useState({ name: '', price: 0, stock: 10, category: 'Computing & Tech', vendor_id: '' });
    const [status, setStatus] = useState(null);

    const fetchData = async () => {
        try {
            const [pRes, vRes] = await Promise.all([
                fetch('http://localhost:8000/products/'),
                fetch('http://localhost:8000/vendors/')
            ]);
            if (pRes.ok) setProducts(await pRes.json());
            if (vRes.ok) setVendors(await vRes.json());
        } catch (err) {
            console.error("Failed to fetch product data");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8000/products/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock),
                    vendor_id: parseInt(formData.vendor_id)
                })
            });
            if (res.ok) {
                setStatus({ type: 'success', message: 'Product added successfully!' });
                setFormData({ name: '', price: 0, stock: 10, category: 'Electronics', vendor_id: '' });
                fetchData();
                setTimeout(() => setStatus(null), 3000);
            } else {
                setStatus({ type: 'error', message: 'Failed to add product.' });
            }
        } catch (err) {
            setStatus({ type: 'error', message: 'API unreachable.' });
        }
    };

    return (
        <div className="products-page">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1>Inventory Catalog</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Manage products and stock levels.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div className="card">
                    <h2>Live Catalog</h2>
                    <div style={{ marginTop: '1.5rem' }}>
                        {products.map(p => (
                            <div key={p.id} style={{
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
                                    <div style={{ fontWeight: '600' }}>{p.name}</div>
                                    <small style={{ color: 'var(--primary)' }}>${p.price} | {p.category}</small>
                                </div>
                                <div style={{
                                    padding: '0.25rem 0.75rem',
                                    background: p.stock < 10 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                    color: p.stock < 10 ? 'var(--danger)' : 'var(--success)',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: '700'
                                }}>
                                    {p.stock} units
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card">
                    <h2>Add New Product</h2>
                    <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Product Name</label>
                            <input
                                className="input-premium"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.8rem', borderRadius: '10px', color: 'white' }}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Price ($)</label>
                                <input
                                    type="number" step="0.01"
                                    className="input-premium"
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.8rem', borderRadius: '10px', color: 'white' }}
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Stock</label>
                                <input
                                    type="number"
                                    className="input-premium"
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.8rem', borderRadius: '10px', color: 'white' }}
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Assign Vendor</label>
                            <select
                                className="input-premium"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.8rem', borderRadius: '10px', color: 'white' }}
                                value={formData.vendor_id}
                                onChange={(e) => setFormData({ ...formData, vendor_id: e.target.value })}
                                required
                            >
                                <option value="">Select a vendor...</option>
                                {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Category</label>
                            <select
                                className="input-premium"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '0.8rem', borderRadius: '10px', color: 'white' }}
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                <option value="Office & Workspace">Office & Workspace</option>
                                <option value="Computing & Tech">Computing & Tech</option>
                                <option value="Wellness & Ergonomics">Wellness & Ergonomics</option>
                                <option value="Smart Home">Smart Home</option>
                                <option value="Lifestyle">Lifestyle</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-premium">
                            <FaPlus style={{ marginRight: '0.5rem' }} /> Add to Catalog
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

export default Products;
