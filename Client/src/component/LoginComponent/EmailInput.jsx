import { useState } from "react";
import '../../assets/style/emailInput.css'
import { setEmail, setShowOtpTrue } from "../../redux/features/auth/loginSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const EmailInput = ({ isOpen, setIsOpen }) => {
    const email = useSelector((state) => state.login.email);
    const dispatch = useDispatch();
    const url = useSelector((state) => state.backendUrl.url);
    const [error, setError] = useState(null);

    const [tempEmail, setTempEmail] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) =>{
        dispatch(setEmail(e.target.value));
        setTempEmail(e.target.value);
    }

    const handleEmail = () => {

        axios.post(`${url}/user/send-otp`, { email })
            .then((response) => {
                console.log("Response 19:", response);
                setIsOpen(false);
                dispatch(setShowOtpTrue());
                setTempEmail(null);
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

    return (
        <div className="overlay">
            <div className="email-modal">
                <h2>Enter Your Email</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={tempEmail}
                    onChange={(e) => handleChange(e)}
                    className="email-input"
                />
                {
                    error && <p style={{ "color": "red" }}>{error.email}</p>
                }
                <div className="modal-actions">
                    <button className="submit-btn" onClick={() => handleEmail()}>
                        Submit
                    </button>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailInput;
