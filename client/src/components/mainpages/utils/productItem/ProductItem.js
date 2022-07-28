import React from 'react'
import BtnRender from './BtnRender'

function ProductItem({product, isAdmin, deleteProduct, handleCheck}) {

    return (
        <div className="product_card">
            {
                isAdmin && <div><input type="checkbox" checked={product.checked}
                onChange={() => handleCheck(product._id)} />
                </div>
            }
            {console.log(product)}
            <img src={product.images.url} alt="" />

            <div className="product_box">
                <center>
                <h3 title={product.title}>{product.title}</h3>
                <span>${product.price} {product.content}</span>
                <p>{product.description}</p></center>
                
            </div>
            {product.stock<5 && <p style={{color:"red"}}>Add stock</p>}
            
            <BtnRender product={product} deleteProduct={deleteProduct} />
        </div>
    )
}

export default ProductItem
