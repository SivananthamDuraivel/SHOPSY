import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Products.css';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  const [price, setPrice] = useState();
  const [rating, setRating] = useState();
  const [category, setCategory] = useState();

  const [filter, setFilter] = useState(false);
  const [cartId, setCartId] = useState(null);

  const loadProducts = async () => {
    
    await axios.post('http://localhost:4090/products/', { price, rating, category })
      .then(res => {
        console.log("LOADING : ", res);
        if (res) setProducts(res.data);
      })
      .catch(err => console.log('load catch : ', err));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addToCart = async (e, id, availableUnit) => {
    e.preventDefault();
    const quantity = quantities[id] || 0;

    if (quantity > availableUnit) {
      window.alert("Enter a lesser quantity");
      return;
    }

    try {
      axios.post("http://localhost:4090/products/addToCart", { productId: id, quantity: quantity, availableUnit: availableUnit })
        .then(res => {
          if (res.data === "updated") {
            window.alert("Item added to cart");
            setQuantities({ ...quantities, [id]: 0 });
            loadProducts();
          }
        })
        .catch(err => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  const handleCart = () => {
    navigate("/myCart");
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    loadProducts();
  };

  return (
    <div>
      <div className='titleBar'>
        <h2>WELCOME TO AMAZON KAADUGAL</h2>
        <button className='cart' onClick={handleCart}>My cart</button>
      </div>
      <button onClick={() => setFilter(!filter)}>Filter</button>

      {filter ? (
        <div className='filters'>
          <form onSubmit={(e) => handleApplyFilters(e)}>
            <div>
              <label>Max Price: </label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
              <label>Min Rating: </label>
              <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} />
            </div>
            <div>
              <label>Category: </label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category</option>
                <option value="HouseHold">Household</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Food">Food</option>
              </select>
            </div>

            <button type="submit">Apply Filters</button>
          </form>
        </div>
      ) : null}

      <div className="container">
        {products && products.length > 0 ? (
          products.map((product, index) => (
            <div key={index} className="card">
              <img src={product.picture} alt={product.name} />
              <div className="card-details">
                <p>{product.name}</p>
                <p>Price: ${product.price}</p>
                <p>Status: {product.available}</p>
                <p>Available Units: {product.availableUnit}</p>
                <p>Rating: {product.rating}</p>
                <p>Category: {product.category}</p>
                <form onSubmit={(e) => { addToCart(e, product._id, product.availableUnit) }}>
                  
                    <input
                      type="number"
                      placeholder='enter the quantity'
                      
                      
                      onChange={(e) => setQuantities({ ...quantities, [product._id]: e.target.value })}
                      value={quantities[product._id] || ''}
                      required
                    />
                  
                  <button type='submit'>Add to cart</button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default Products;
