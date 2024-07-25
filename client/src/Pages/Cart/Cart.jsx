import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Cart.css';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({}); // Object to store quantities by product ID
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const loadProducts = async () => {
        try {
            const res = await axios.post('http://localhost:4090/products/myCart');
            if (res) {
                setProducts(res.data.cart);
                setTotal(res.data.cartValue);
                // Initialize quantities state
                const initialQuantities = res.data.cart.reduce((acc, product) => {
                    acc[product._id] = ''; // Initialize with empty string
                    return acc;
                }, {});
                setQuantities(initialQuantities);
            }
        } catch (err) {
            console.log('load catch @cart : ', err);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleQuantityChange = (id, value) => {
        setQuantities(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const removeFromCart = async (e, id, quantity, pId) => {
        e.preventDefault();
        const qtyToRemove = parseInt(quantities[id], 10);
        if (isNaN(qtyToRemove) || qtyToRemove < 0 || qtyToRemove > quantity) {
            window.alert("Please choose an appropriate quantity");
            return;
        }
        try {
            const res = await axios.post("http://localhost:4090/products/removeFromCart", { productId: id, removeQuantity: qtyToRemove, pId: pId });
            if (res.data === "updated") {
                window.alert("Item removed from cart");
                setQuantities(prev => ({
                    ...prev,
                    [id]: '' // Clear the quantity input for this product
                }));
                loadProducts(); // Reload products after removal
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleBack = () => {
        navigate("/allProducts");
    };

    return (
        <div>
            <div className='titleBar'>
                <h2>WELCOME</h2>
                <button className='cart' onClick={handleBack}>Back</button>
                <strong className='cartValue'>Total Price : ${total}</strong>
            </div>

            <div className="container">
                {products && products.length > 0 ? (
                    products.map((product, index) => (
                        <div key={index} className="card">
                            <img src={product.picture} alt={product.name} />
                            <div className="card-details">
                                <p>{product.name}</p>
                                <p>Price: ${product.price}</p>
                                <p>Added Units: {product.quantity}</p>
                                <p>Rating: {product.rating}</p>
                                <p>Category: {product.category}</p>
                                <form className='removeForm' onSubmit={(e) => removeFromCart(e, product._id, product.quantity, product.pId)} >
                                    <input
                                        type="number"
                                        placeholder='Enter the quantity'
                                        onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                                        value={quantities[product._id] || ''}
                                        required
                                    />
                                    <button type='submit'>Remove</button>
                                </form>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: 'red' }}>Your cart is empty</p>
                )}
            </div>
        </div>
    );
};

export default Cart;
