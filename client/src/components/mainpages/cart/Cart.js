import React, {useContext, useState, useEffect} from 'react'
import {GlobalState} from '../../../GlobalState'
import axios from 'axios'

function Cart() {
    const state = useContext(GlobalState)
    const [cart, setCart] = state.userAPI.cart
    const [token] = state.token
    const [total, setTotal] = useState(0)
    const [id,setid]=useState(""); 
    const [address ,setaddress]=useState({name:"",city:"",pincode:"",state:""});
    const [isaddress,setisaddress]=useState(true)
    const [Limitfororder,setLimit]=useState(false);

    const [quantity,setquantity]=useState(1);


    useEffect(() =>{
        const getTotal = () =>{
            const total = cart.reduce((prev, item) => {
                return prev + (item.price * item.quantity)
            },0)

            setTotal(total)
        }

        getTotal()

    },[cart])

    const addToCart = async (cart) =>{
        await axios.patch('/user/addcart', {cart}, {
            headers: {Authorization: token}
        })
    }


    const increment = (id) =>{
        cart.forEach(item => {
            if(item._id === id){
                if(item.quantity>=3)
                {
                    setLimit(true);
                }
                else{
                    setLimit(false);
                    item.quantity += 1
                    setquantity(item.quantity);
                }

                
            }
        })

        setCart([...cart])
        addToCart(cart)
    }

    const decrement = (id) =>{
        cart.forEach(item => {
            if(item._id === id){
                setLimit(false);
                item.quantity === 1 ? item.quantity = 1 : item.quantity -= 1
                setquantity(item.quantity);
            }
        })

        setCart([...cart])
        addToCart(cart)
    }

    const removeProduct = id =>{
        if(window.confirm("Do you want to delete this product?")){
            cart.forEach((item, index) => {
                if(item._id === id){
                    cart.splice(index, 1)
                }
            })

            setCart([...cart])
            addToCart(cart)
        }
    }

    const updateStock=async()=>{
        try {
            await axios.patch('/api/products',{cart}, {
                headers: {Authorization: token}
            })
        } catch (error) {
            console.log(error)
        }
    }

    const tranSuccess = async(payment) => {
        // const address = payment;
        //update stock
        
        const paymentID=payment.razorpay_payment_id;
        console.log("data 3",paymentID)
        await axios.post('/api/payment', {cart, paymentID, address}, {
            headers: {Authorization: token}
        })     
    
        updateStock();
        setCart([])
        addToCart([])
        alert("You have successfully placed an order.")
    }


    if(cart.length === 0) 
        return <h2 style={{textAlign: "center", fontSize: "5rem"}}>Cart Empty</h2> 

        const initPayment = (data) => {
            const options = {
                key: "rzp_test_0jZm5UHEVMgNlQ",
                key_secret:"6GrfCy2DZ9B7QYM6J3IYcSYu",
                amount: data.amount,
                currency: data.currency,
                description: "Test Transaction",
                order_id: data.id,
                handler: async (response) => {
                    try {
                        const verifyUrl = "http://localhost:5000/api/verify";
                         await axios.post(verifyUrl, response);
                        console.log("data 2")
                        console.log(response);
                        tranSuccess(response);
                    } catch (error) {
                        console.log(error);
                    }
                },
                theme: {
                    color: "#3399cc",
                },
            };
            const rzp1 = new window.Razorpay(options);
            rzp1.open();
        };
    
        const handlePayment = async () => {
            try {
                const orderUrl = "http://localhost:5000/api/orders";
                const { data } = await axios.post(orderUrl, { amount: total });
                console.log("data 1")
                console.log(data);
                setid(data.id);
                initPayment(data.data);
            } catch (error) {
                console.log(error);
            }
        };  
        const addAddress=()=>{
           setisaddress(true)
        } 
        
        const handleaddress=(e)=>{
         
                const {name, value} = e.target;
                setaddress({...address, [name]:value})
            
        }

        const handleAddAddress=()=>{
            console.log(address);
            console.log(cart)
            setisaddress(false)
        }

    return (
        <div>
            {
                cart.map(product => (
                    <div className="detail cart" key={product._id}>
                        <img src={product.images.url} alt="" />

                        <div className="box-detail">
                            <h2>{product.title}</h2>

                            <h3>$ {product.price * product.quantity}</h3>
                            <p>{product.description}</p>
                            <p>{product.content}</p>

                            <div className="amount">
                                <button onClick={() => decrement(product._id)}> - </button>
                                <span>{product.quantity}</span>
                                <button onClick={() => increment(product._id)}> + </button>
                                {Limitfororder && <p>Max 3 per order</p>}
                            </div>
                            
                            <div className="delete" 
                            onClick={() => removeProduct(product._id)}>
                                X
                            </div>
                        </div>
                    </div>
                ))
            }

            <div className="total">
                <h3>Total: $ {total}</h3>
                    {isaddress && 
                    <form onSubmit={handleAddAddress}>
                    <div className='address'>
                    <div className='addressinputs'>
                    name
                    <input type='text' name='name' required value={address.name} onChange={handleaddress}></input>
                    mobile
                    <input type='text' name='mobile'required value={address.mobile} onChange={handleaddress}></input>
                     city
                    <input type='text' name='city' required value={address.city} onChange={handleaddress}></input>
                   
                     pincode
                    <input type='text' name='pincode' required value={address.pincode} onChange={handleaddress}></input>
                      
                    </div>
                    <div className='button'>
                      <input type="submit" value={"Add"}></input>
                    </div>
                    </div>
                    </form>
                    }
                {isaddress===false && <button onClick={addAddress}>Addresss</button>}
                {isaddress===false && <button onClick={handlePayment}>Pay</button>}
            </div>
        </div>
    )
}

export default Cart
