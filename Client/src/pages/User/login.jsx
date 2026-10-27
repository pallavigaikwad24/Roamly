import { useState } from 'react';
import '../../assets/style/login.css';
import { Typography, TextField, Divider, Chip, Box, Alert, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton, circularProgressClasses } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from "axios";
import RediectOption from '../../component/LoginSignupCommon/RediectOption';
import ImageDisplay from '../../component/LoginSignupCommon/ImageDisplay';
import FrontText from '../../component/LoginSignupCommon/FrontText';
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { hideAlert, showAlert, showError } from '../../redux/features/auth/loginSlice';
import { login } from '../../redux/features/protectedRoute/protectedRouteSlice';
import EmailInput from '../../component/LoginComponent/EmailInput';
import OTP from '../../component/LoginComponent/OTP';

// Validation Schema using Yup
const validationSchema = Yup.object({
    username: Yup.string()
        .test("is-email-or-phone", "Enter a valid email or phone number", (value) => {
            if (!value) return false; // Ensure value exists
            const emailRegex = /\S+@\S+\.\S+/; // Basic email regex
            const phoneRegex = /^[0-9]{10}$/; // Allows only 10-digit numbers for phone numbers
            return emailRegex.test(value) || phoneRegex.test(value); // Valid if it matches either
        })
        .required("Email or phone number is required"),

    password: Yup.string().min(8, "Password must be at least 8 characters")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/, "Password must have upper, lower, num, and special char.")
        .required("Password is required"),
});

function Login() {
    const error = useSelector((state) => state.login.error);
    const alertView = useSelector((state) => state.login.alertView);
    const url = useSelector((state) => state.backendUrl.url);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    axios.defaults.withCredentials = true;
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const showOtp = useSelector((state) => state.login.showOtp);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleLogin = (values, { setSubmitting, setErrors }) => {
        axios.post(`${url}/user/login`, values)
            .then((response) => {
                dispatch(login(JSON.stringify({
                    user_id: response?.data?.id,
                    first_name: response?.data?.first_name,
                    email: response?.data?.email,
                    user_type: response?.data?.user_type,
                    last_name: response?.data?.last_name,
                    joinAt: response?.data?.createdAt
                })));
                navigate("/home");
            })
            .catch((err) => {
                if (err.status === 403) {
                    if (err.response.data[0]) {
                        setErrors({ [err.response.data[0].path]: err.response.data[0].msg });
                    } else {
                        dispatch(showAlert());
                        dispatch(showError({ path: "account-lock", msg: err.response.data?.msg }));
                    }
                    console.log(err.response.data);
                }
                console.log("Error:", err);
            }).finally(() => {
                setSubmitting(false);
            });
    };

    const handleOTPLogin = () => {
        setIsOpen(true);
    }

    return (
        <>
            {
                error && error.path === "account-lock" && alertView &&
                <Alert id='alert' severity="warning" onClose={() => { dispatch(hideAlert()) }}>
                    {error.msg.split(".")[0]} <br />
                    {error.msg.split(".")[1]}
                </Alert>
            }
            <div id="login-component">
                <ImageDisplay />
                <div id="login-input">
                    <FrontText isLogin={true} />

                    <Formik
                        initialValues={{ username: "", password: "" }}
                        validationSchema={validationSchema}
                        onSubmit={handleLogin}
                    >
                        {({ values, handleChange, handleBlur, touched, errors, handleSubmit }) => (
                            <Form>
                                {/* Username Field (Email or Phone Number) */}
                                <Field
                                    as={TextField}
                                    label="Email or Phone number"
                                    name="username"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={values.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.username && Boolean(errors.username)}
                                    helperText={touched.username && errors.username} // Display error message directly in TextField
                                />
                                <ErrorMessage name="username" component="div" className="error-msg" />

                                {/* Password Field */}
                                <Field
                                    as={FormControl}
                                    sx={{ m: 1, ml: 0.3 }}
                                    variant="outlined"
                                    fullWidth
                                    error={touched.password && Boolean(errors.password)}
                                >
                                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.password && Boolean(errors.password)}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label={showPassword ? 'hide the password' : 'display the password'}
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Password"
                                    />
                                    <ErrorMessage name="password" component="div" className="error-msg password" />
                                </Field>

                                <Typography color='grey' variant='p' sx={{ fontFamily: "PT Sans Narrow, serif" }}>
                                    Forgot your password?
                                </Typography>

                                <RediectOption isLogin={true} handleFun={handleSubmit} />
                            </Form>
                        )}
                    </Formik>

                    <Divider sx={{ width: '60%', height: '1px', backgroundColor: 'grey', alignItems: 'center', marginTop: '1rem' }}>
                        <Typography backgroundColor="white" padding={"6px"}>OR</Typography>
                    </Divider>

                    <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                        <Chip
                            label="Login with OTP"
                            size="medium"
                            sx={{ marginTop: '1rem', color: '#019ee3', marginRight: '1rem', cursor: 'pointer' }}
                            onClick={() => handleOTPLogin()}
                        />
                        {/* <Google sx={{ marginTop: '.5rem', color: '#019ee3' }} /> */}
                    </Box>

                </div>
                {
                    isOpen &&
                    <EmailInput isOpen={isOpen} setIsOpen={setIsOpen} />
                }
                {
                    showOtp && <OTP />

                }
            </div>
        </>
    );
}

export default Login;

