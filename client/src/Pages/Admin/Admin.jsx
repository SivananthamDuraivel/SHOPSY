import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Products/Products.css';
import { useNavigate } from 'react-router-dom';


const Admin = () => {

    const [products, setProducts] = useState([]);

    const [price, setPrice] = useState('');
    const [rating, setRating] = useState('');
    const [category, setCategory] = useState('');

    const [filter, setFilter] = useState(false);
    const [add, setAdd] = useState(false);

    const [img, setImg] = useState();
    const [name, setName] = useState();
    const [pprice, setPPrice] = useState();
    const [status, setStatus] = useState();
    const [quantity, setQuantity] = useState();
    const [rrating, setRRating] = useState();
    const [ccategory, setCCategory] = useState();

    const [toggleEdit, setToggleEdit] = useState(false);
    const [showSaveCancel, setshowSaveCancel] = useState(false);
    const [editableId, setEditableId] = useState();

    const [editableImg, setEditableImg] = useState();
    const [editableName, setEditableName] = useState();
    const [editablePrice, setEditablePrice] = useState();
    const [editableStatus, setEditableStatus] = useState();
    const [editableQuantity, setEditableQuantity] = useState();
    const [editableRating, setEditableRating] = useState();
    const [editableCategory, setEditableCategory] = useState();

    const handleToggleEdit = (product) => {
        console.log("ID : ", product._id);
        setEditableId(product._id);
        setEditableImg(product.picture);
        setEditableName(product.name);
        setEditablePrice(product.price);
        setEditableStatus(product.available);
        setEditableQuantity(product.availableUnit);
        setEditableRating(product.rating);
        setEditableCategory(product.category);
    }

    const loadProducts = async () => {
        await axios.post('http://localhost:4090/products/', { price: price, rating: rating, category: category })
            .then(res => {
                console.log("LOADING : ", res);
                if (res) setProducts(res.data);
            })
            .catch(err => console.log('load catch : ', err));
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleSave = async () => {
        try {
            await axios.put('http://localhost:4090/products/editProduct', {
                id: editableId,
                picture: editableImg,
                name: editableName,
                price: editablePrice,
                available: editableStatus,
                availableUnit: editableQuantity,
                rating: editableRating,
                category: editableCategory
            }, { new: true })
                .then(res => {
                    if (res.data === "edited")
                        window.alert("product edited successfully");
                    else
                        window.alert("can't edit right now :( ");
                })
                .catch(err => console.log("edit catch res : ", err));
            setEditableId(null);
            setshowSaveCancel(false);
            loadProducts();
        }
        catch (err) {
            console.log("save catch : ", err);
        }
    }

    const handleApplyFilters = (e) => {
        e.preventDefault();
        loadProducts();
    }

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4090/products/addProduct',
                { picture: img, name: name, price: pprice, available: status, availableUnit: quantity, rating: rrating, category: ccategory })
                .then(res => {
                    if (res.data === "added") {
                        window.alert("product added successfully");
                        loadProducts();
                    }
                })
                .catch(err => console.log(err));
        }
        catch (err) {
            console.log(err);
        }
    }

   

    return (
        <div>
            <div className='titleBar'>
                <h2>WELCOME ADMIN</h2>
            </div>
            <button onClick={() => setFilter(!filter)}>Filter</button>
            <button onClick={() => setAdd(!add)} style={{ 'float': 'right' }}>Add product</button>
            {add ? (
                <center>
                    <form onSubmit={handleAdd}>
                        <h3>Enter the new Product details</h3>
                        <label>Choose Image : </label><input type="file" onChange={(e) => setImg(e.target.files[0])} /><br /><br />
                        <label>Product Name : </label><input type="text" onChange={(e) => setName(e.target.value)} required /><br /><br />
                        <label>Price : </label><input type="number" onChange={(e) => setPPrice(e.target.value)} required /><br /><br />
                        <label>Status : </label><input type="text" onChange={(e) => setStatus(e.target.value)} required /><br /><br />
                        <label>Available Units : </label><input type="number"  onChange={(e) => setQuantity(e.target.value)} required /><br /><br />
                        <label>Rating : </label><input type="number" step="0.1" onChange={(e) => setRRating(e.target.value)} required /><br /><br />
                        <label>Category : </label><input type="text" onChange={(e) => setCCategory(e.target.value)} required /><br /><br /><br />
                        <button type='button' onClick={() => setAdd(false)}>CANCEL</button>
                        <button type='submit'>ADD PRODUCT</button>
                    </form>
                </center>
            ) : null}

            {filter ? (
                <div className='filters'>
                    <form onSubmit={(e) => handleApplyFilters(e)}>
                        <div>
                            <label>Max Price: </label>
                            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        <div>
                            <label>Min Rating: </label>
                            <input type="number" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} />
                        </div>
                        <div>
                            <label>Category: </label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Select a category</option>
                                <option value="household">Household</option>
                                <option value="electronics">Electronics</option>
                                <option value="clothing">Clothing</option>
                                {/* Add more categories as needed */}
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
                            {(product._id === editableId) ? (
                                <div>
                                    <img src={product.picture} alt={product.name} /><br />
                                    <label>Choose new Image : </label><input type="file" onChange={(e) => setEditableImg(e.target.files[0])} /><br /><br />
                                    <div className='card-detials'>
                                        <label>Product Name : </label><input type="text" value={editableName} onChange={(e) => setEditableName(e.target.value)} /><br />
                                        <label>Price : </label><input type="number" value={editablePrice} onChange={(e) => setEditablePrice(e.target.value)} /><br />
                                        <label>Status : </label><input type="text" value={editableStatus} onChange={(e) => setEditableStatus(e.target.value)} /><br />
                                        <label>Available Units : </label><input type="number" value={editableQuantity} onChange={(e) => setEditableQuantity(e.target.value)} /><br />
                                        <label>Rating : </label><input type="number" value={editableRating} onChange={(e) => setEditableRating(e.target.value)} /><br />
                                        <label>Category : </label><input type="text" value={editableCategory} onChange={(e) => setEditableCategory(e.target.value)} /><br /><br />
                                    </div>
                                    {(showSaveCancel) ? (
                                        <div style={{ 'display': 'inline' }}>
                                            <button onClick={() => { handleSave() }}>save</button>
                                            <button onClick={() => { setshowSaveCancel(false); setEditableId(null) }}>cancel</button>
                                        </div>
                                    ) : null}
                                </div>
                            ) : (
                                <div>
                                    <img src={product.picture} alt={product.name} />
                                    <div className="card-details">
                                        <p>{product.name}</p>
                                        <p>Price: ${product.price}</p>
                                        <p>Status: {product.available}</p>
                                        <p>Available Units: {product.availableUnit}</p>
                                        <p>Rating: {product.rating}</p>
                                        <p>Category: {product.category}</p>
                                        <br />
                                        <button onClick={() => { handleToggleEdit(product); setshowSaveCancel(true) }}>edit</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </div>
        </div>
    );
};

export default Admin;
