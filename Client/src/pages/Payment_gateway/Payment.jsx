import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';


const Payment = ({ amount, check_in_date, check_out_date, hotel_id,
    number_of_rooms, btnName, flight_id, number_of_seats, setIsPayment, isPayment }) => {
    // const [response.data, setresponse.data] = useState(null);
    axios.defaults.withCredentials = true;
    const url = useSelector((state) => state.backendUrl.url);

    // useEffect(() => {
    //     const createOrder = async () => {
    //         try {
    //             axios.post(`${url}/payment/createOrder`, { amount: amount * Number(number_of_rooms ? number_of_rooms : number_of_seats) })
    //                 .then((response) => setresponse.data(response.data))
    //                 .catch((error) => {
    //                     console.error('Error creating order:', error);
    //                     if (error.status == 401) localStorage.removeItem("user_login");
    //                 })

    //         } catch (error) {
    //             console.error('Error creating order:', error);
    //             if (error.status == 401) localStorage.removeItem("user_login");
    //         }
    //     };
    //     console.log(isPayment);
    //     if (isPayment)
    //         createOrder();
    // }, [url, amount, number_of_rooms, number_of_seats, isPayment]);

    const handlePayment = () => {

        axios.post(`${url}/payment/createOrder`, { amount: amount * Number(number_of_rooms ? number_of_rooms : number_of_seats) })
            .then((response) => {
                // setresponse.data(response.data);
                const options = {
                    key: response.data,
                    amount: response.data?.amount, // amount in paise
                    currency: 'INR',
                    name: 'Your Company Name',
                    description: 'Test Transaction',
                    image: 'https://www.logologo.com/logos/abstract-isometric-logo-design-free-logo.jpg',
                    order_id: response.data?.order_id,
                    handler: function (response) {
                        alert("Your payment has been successfully processed. A confirmation receipt has been sent to your registered email. If you require any assistance or have any inquiries, please don’t hesitate to contact our support team. ");
                        if (btnName == "Book Hotel") {
                            setIsPayment(false)
                        } else {
                            axios.post(`${url}/flight/flight-booking`, { flight_id, number_of_seats, })
                                .then((response) => { console.log("43:", response.data); })
                                .catch((err) => {
                                    console.log(err);
                                    if (err.status == 401) localStorage.removeItem("user_login");
                                });

                        }
                    },
                    prefill: {
                        name: response.data.name,
                        email: response.data.email,
                        contact: response.data.contact,
                    },
                    notes: {
                        address: 'Razorpay Corporate Office',
                    },
                    theme: {
                        color: '#3399cc',
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();

            })
            .catch((error) => {
                console.error('Error creating order:', error);
                if (error.status == 401) localStorage.removeItem("user_login");
            })













        // const options = {
        //     key: response.data,
        //     amount: response.data?.amount, // amount in paise
        //     currency: 'INR',
        //     name: 'Your Company Name',
        //     description: 'Test Transaction',
        //     image: 'https://www.logologo.com/logos/abstract-isometric-logo-design-free-logo.jpg',
        //     order_id: response.data?.order_id,
        //     handler: function (response) {
        //         alert("Your payment has been successfully processed. A confirmation receipt has been sent to your registered email. If you require any assistance or have any inquiries, please don’t hesitate to contact our support team. ");
        //         if (btnName == "Book Hotel") {
        //             axios.post(`${url}/hotel/hotel-booking`, {
        //                 check_in_date,
        //                 check_out_date,
        //                 hotel_id,
        //                 number_of_rooms
        //             })
        //                 .then((response) => { console.log("37:", response.data); setIsPayment(false); })
        //                 .catch((err) => {
        //                     console.log(err);
        //                     if (err.status == 401) localStorage.removeItem("user_login");
        //                 });
        //         } else {
        //             axios.post(`${url}/flight/flight-booking`, { flight_id, number_of_seats, })
        //                 .then((response) => { console.log("43:", response.data); })
        //                 .catch((err) => {
        //                     console.log(err);
        //                     if (err.status == 401) localStorage.removeItem("user_login");
        //                 });

        //         }
        //     },
        //     prefill: {
        //         name: response.data.name,
        //         email: response.data.email,
        //         contact: response.data.contact,
        //     },
        //     notes: {
        //         address: 'Razorpay Corporate Office',
        //     },
        //     theme: {
        //         color: '#3399cc',
        //     },
        // };

        // const rzp = new window.Razorpay(options);
        // rzp.open();
    };

    return (
        <div>

            {
                <button onClick={handlePayment} className='payment-btn'>{btnName}</button>
            }
        </div>
    );
};

export default Payment;