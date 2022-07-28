import React, {useState, useEffect, useContext} from 'react'
import {useParams} from 'react-router-dom'
import {GlobalState} from '../../../GlobalState'
import axios from 'axios'



function OrderDetails() {
    const state = useContext(GlobalState)
    const [history] = state.userAPI.history
    const [orderDetails, setOrderDetails] = useState([])
    const [isAdmin] = state.userAPI.isAdmin
    const [statusorder,setstatusorder]=useState();
    const [token] = state.token
    const params = useParams()

    useEffect(() => {
        if(params.id){
            console.log(params)
            history.forEach(item =>{
                if(item._id === params.id) setOrderDetails(item)
                console.log(item);
            })
        }
    },[params.id, history])


    if(orderDetails.length === 0) return null;

    const status=async(e)=>{
    e.preventDefault();
   console.log(statusorder)
   window.alert(statusorder)
   try {
     await axios.patch(`/api/payment/${orderDetails._id}`,{status:statusorder}, {
        headers: {Authorization: token}
    })
   } catch (error) {
    
   }

    }

    return (
        <div className="history-page">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Postal Code</th>
                        <th>State</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{orderDetails.address.name}</td>
                        <td>{orderDetails.address.city}</td>
                        <td>{orderDetails.address.pincode}</td>
                        <td>{orderDetails.address.state}</td>
                    </tr>
                </tbody>
            </table>

            <table style={{margin: "30px 0px"}}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Products</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orderDetails.cart.map(item =>(
                        <tr key={item._id}>
                            <td><img src={item.images.url} alt="" /></td>
                            <td>{item.title}</td>
                            <td>{item.quantity}</td>
                            <td>$ {item.price * item.quantity}</td>
                        </tr>
                        ))
                    }
                    
                </tbody>
            </table>

            <div className='container'>
                {console.log(orderDetails)}
                <h3>Status :{orderDetails.status}</h3>
                 {isAdmin && <div>
                <form onSubmit={status}>
                     update:<br></br>
                      <input type='radio' onClick={(e)=>{setstatusorder(e.target.value)}} name='status' value={"Order Placed"} required="required"></input>Order Placed<br></br>
                      <input type='radio' onClick={(e)=>{setstatusorder(e.target.value)}} name='status' value={"Order Dispatched"} required="required"></input>Order Dispatched<br></br>
                      <input type='radio' onClick={(e)=>{setstatusorder(e.target.value)}} name='status' value={"Order Delivered"} required="required"></input>Order Delivered<br></br>
                <input type='submit' value={"Update"} style={{cursor:"pointer"}}></input> 
                </form> 
                </div> }

            </div>
        </div>
    )
}

export default OrderDetails
