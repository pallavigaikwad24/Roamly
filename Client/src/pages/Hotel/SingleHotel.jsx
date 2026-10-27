import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../../assets/style/singleHotel.css';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setHotelInfo } from '../../redux/features/hotel/hotelSlice';
import { useEffect, useState } from 'react';
import Payment from '../Payment_gateway/Payment';

import { useFormik } from "formik";
import * as Yup from "yup";
import Header from '../../component/HomeComponent/Header';

const validationSchema = Yup.object({
  check_in_date: Yup.date()
    .required("Select Check-in Date")
    .nullable()
    .min(
      new Date(new Date().setDate(new Date().getDate())),
      "Select date after today"
    ),
  check_out_date: Yup.date()
    .required("Select Check-out Date")
    .nullable()
    .min(Yup.ref('check_in_date'), "Select valid Date"),
  number_of_rooms: Yup.number().required("Select number of rooms").min(1, "Select valid value")
});

const SingleHotel = () => {
  const { id } = useParams();
  const hotelInfo = useSelector((state) => state.hotel.hotelInfo);
  const dispatch = useDispatch();
  const url = useSelector((state) => state.backendUrl.url);
  const location = useLocation();
  const { info } = location.state || {};
  axios.defaults.withCredentials = true;
  const today = new Date().toISOString().split('T')[0];

  const [isPayment, setIsPayment] = useState(false);

  const formik = useFormik({
    initialValues: {
      check_in_date: info?.startDate || '',
      check_out_date: info?.endDate || '',
      number_of_rooms: info?.travelers || ''
    },
    validationSchema,
    onSubmit: (values) => {

      console.log("Values:", values);
      setIsPayment(true);

      axios.post(`${url}/hotel/hotel-booking`, {
        check_in_date: values?.check_in_date,
        check_out_date: values?.check_out_date,
        hotel_id: hotelInfo?.id,
        number_of_rooms: values?.number_of_rooms
      })
        .then((response) => { console.log("37:", response.data); setIsPayment(true); })
        .catch((err) => {
          console.log(err);
          if (err.status == 403) {
            formik.setFieldError(err.response.data[0]?.path, err.response.data[0]?.msg);
          }
          if (err.status == 401) localStorage.removeItem("user_login");
        });
    },
  })


  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${url}/hotel/${id}`)
      .then((response) => {
        dispatch(setHotelInfo(response.data));
      })
      .catch((err) => {
        console.log(err);
        if (err.status == 401) {
          navigate("/login");
          localStorage.removeItem("user_login");
        }
      });
  }, [dispatch, id, url, navigate]);

  return (
    <>
      <Header />
      <div id='singleHotel-body'>
        {
          hotelInfo &&
          <div className="hotel-container">
            <div className="hotel-header">
              <h1 className="hotel-name">{hotelInfo.name}</h1>
              <div className="hotel-meta">
                <div className="rating">
                  <span className="star">★</span>
                  <span>{hotelInfo?.ReviewHotelModel?.rating}</span>
                </div>
                <div className="location">📍 {hotelInfo.location}</div>
              </div>
            </div>

            <div className="gallery">
              {
                hotelInfo.images && JSON.parse(hotelInfo.images).map((image, index) => (
                  <div key={index}>
                    <img src={`${url}/hotelPictures/upload/${hotelInfo?.owner_id}/${hotelInfo.id}/${image}`} alt="Hotel main view" className="main-image" onError={(e) => e.target.src = `${url}/hotelPictures/defaultImg/default_location.png`} />
                  </div>
                ))
              }
            </div>

            <div className="content-grid">
              <div className="main-content">
                <div className="info-card">
                  <h2 className="card-title">About This Hotel</h2>
                  {/* <p className="description">{hotelInfo.description}</p> */}
                  <p className="description">Situated in Sonīpat, 35 km from Red Fort, NAAD WELLNESS features
                    accommodation with an outdoor swimming pool, free private parking, a fitness centre and a garden.
                    Among the facilities of this property are a restaurant, room service and a 24-hour front desk,
                    along with free WiFi. Jantar Mantar is 37 km from the resort and Feroz Shah Kotla Cricket
                    Stadium is 37 km away.
                  </p>
                </div>

                <div className="info-card">
                  <h2 className="card-title">Amenities</h2>
                  <div className="amenities-grid">
                    {JSON.parse(hotelInfo.services).map((service, index) => (
                      <div key={index} className="amenity-item">
                        ✓ {service}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="booking-sidebar">
                <div className="booking-card">
                  <div className="price">
                    ₹{hotelInfo.price_per_night} <span className="per-night">per night</span>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Check-in</label>
                      <input type="date" className="form-input" name='check_in_date'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        min={today}
                        value={formik?.values?.check_in_date}
                      />

                      {formik?.touched?.check_in_date && formik?.errors?.check_in_date ? (
                        <div className='formik-error' >{formik?.errors?.check_in_date}</div>
                      ) : null}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Check-out</label>
                      <input type="date" className="form-input" name='check_out_date'
                        min={today}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik?.values?.check_out_date} />

                      {formik?.touched?.check_out_date && formik?.errors?.check_out_date ? (
                        <div className='formik-error'>{formik?.errors?.check_out_date}</div>
                      ) : null}
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">Rooms</label>
                    <input type="number" name="number_of_rooms" min={1}
                      value={formik?.values?.number_of_rooms}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}

                      id="form-select" />

                    {formik?.touched?.number_of_rooms && formik?.errors?.number_of_rooms ? (
                      <div className='formik-error'>{formik?.errors?.number_of_rooms}</div>
                    ) : null}
                  </div>

                  <button type='submit' className='payment-btn' onClick={formik?.handleSubmit}>Confirm Booking</button>

                  {isPayment && <Payment setIsPayment={setIsPayment} isPayment={isPayment} amount={hotelInfo?.price_per_night * formik?.values?.number_of_rooms} hotel_id={hotelInfo?.id} check_in_date={formik?.values?.check_in_date}
                    check_out_date={formik?.values?.check_out_date} number_of_rooms={formik?.values?.number_of_rooms}
                    btnName={"Book Hotel"}
                  />}
                  <p className="disclaimer">You won't be charged yet</p>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </>
  );
};

export default SingleHotel;