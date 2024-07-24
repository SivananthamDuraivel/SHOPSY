import React, { useState } from 'react';

const Filter = () => {
    const [parameter, setParameter] = useState('');
    const [value, setValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Filtering by ${parameter}: ${value}`);
        
    };

    return (
        <div className='filter' style={{ position: 'fixed' }}>
            <br />
            <form onSubmit={(e) => { setParameter("price"); handleSubmit(e); }}>
                <input
                    type="number"
                    placeholder="Enter the min price"
                    value={parameter === "price" ? value : ''}
                    onChange={(e) => setValue(e.target.value)}
                    required
                />
                <button type='submit'>Price Filter</button>
            </form>
            <form onSubmit={(e) => { setParameter("rating"); handleSubmit(e); }}>
                <input
                    type="number"
                    placeholder="Enter the min rating"
                    value={parameter === "rating" ? value : ''}
                    onChange={(e) => setValue(e.target.value)}
                    required
                />
                <button type='submit'>Rating Filter</button>
            </form>
            <form onSubmit={(e) => { setParameter("units"); handleSubmit(e); }}>
                <input
                    type="number"
                    placeholder="Enter the min units"
                    value={parameter === "units" ? value : ''}
                    onChange={(e) => setValue(e.target.value)}
                    required
                />
                <button type='submit'>Nos Filter</button>
            </form>
        </div>
    );
}

export default Filter;
