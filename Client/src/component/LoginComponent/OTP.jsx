import { useState, useRef, useEffect } from 'react';
import '../../assets/style/OTP.css';
import { useDispatch, useSelector } from 'react-redux';
import { setShowOtpFalse } from '../../redux/features/auth/loginSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/features/protectedRoute/protectedRouteSlice';

const OTP = () => {
    const [otp, setOtp] = useState(new Array(4).fill(''));
    const inputRefs = useRef([]);

    // const showOtp = useSelector((state) => state.login.showOtp);
    const dispatch = useDispatch();
    const url = useSelector((state) => state.backendUrl.url);
    const email = useSelector((state) => state.login.email);
    const [error, setError] = useState(null);
    console.log("Error:", error)

    const navigate = useNavigate();

    const handleClose = () => {
        dispatch(setShowOtpFalse());
        setOtp(new Array(4).fill(''));
    };

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Move to next input if current field is filled
        if (element.value && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // Move to previous input on backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = () => {
        const otpValue = otp.join('');

        if (email) {
            axios.post(`${url}/user/otp-login/${email}`, { otp: otpValue })
                .then((response) => {
                    handleClose();
                    dispatch(login(JSON.stringify({
                        user_id: response?.data?.id,
                        first_name: response?.data?.first_name,
                        email: response?.data?.email,
                        user_type: response?.data?.user_type,
                        last_name: response?.data?.last_name,
                        joinAt: response?.data?.createdAt
                    })));
                    console.log("res 51:", response);
                    navigate("/home");
                })
                .catch((err) => {
                    if (err.status === 403) {
                        if (err.response.data[0]) {
                            setError({ [err.response.data[0].path]: err.response.data[0].msg });
                        }
                        console.log(err.response.data);
                    }
                    console.log("Error:", err);
                });
        }
    };

    return (
        <div className="otp-container">
            <div className="modal-wrapper">
                <div className="modal-overlay"></div>
                <div className="modal-content">
                    <div className="modal-box">
                        <button onClick={handleClose} className="close-button">
                            <i className="fa-solid fa-xmark"></i>
                        </button>

                        <div className="modal-header">
                            <h2 className="modal-title">Enter Verification Code</h2>
                            <p className="modal-subtitle">
                                We've sent a code to your Email Address
                            </p>
                        </div>

                        <div className="otp-input-group">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(ref) => (inputRefs.current[index] = ref)}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="otp-input"
                                />
                            ))}
                        </div>
                        {
                            error && <p style={{ "color": "red" }}>{error?.otp}</p>
                        }
                        <button
                            onClick={handleSubmit}
                            disabled={otp.some((digit) => !digit)}
                            className="submit-button"
                        >
                            Verify Code
                        </button>

                        <p className="resend-text">
                            Didn't receive the code?{' '}
                            <button className="resend-button">Resend</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTP;