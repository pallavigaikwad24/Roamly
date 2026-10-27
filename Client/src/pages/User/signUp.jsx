import axios from "axios";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ImageDisplay from "../../component/LoginSignupCommon/ImageDisplay.jsx";
import FrontText from "../../component/LoginSignupCommon/FrontText.jsx";
import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from "@mui/material";
import RediectOption from "../../component/LoginSignupCommon/RediectOption.jsx";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    axios.defaults.withCredentials = true;
    const url = useSelector((state) => state.backendUrl.url);
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((showConfirmPassword) => !showConfirmPassword);

    const validationSchema = Yup.object({
        first_name: Yup.string().required("First name is required"),
        last_name: Yup.string().required("Last name is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string().min(8, "Password must be at least 8 characters")
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/, "Password must have upper, lower, num, and special char.")
            .required("Password is required"),
        confirm_password: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm password is required"),
        country: Yup.string().required("Country is required"),
        phone_number: Yup.number().typeError("Phone number must be a valid number")
            .positive("Phone number must be a positive number")
            .integer("Phone number must be an integer")
            .test("len", "Phone number must be exactly 10 digits", (value) => value && value.toString().length === 10)
            .required("Phone number is required"),
        user_type: Yup.string().required("User type is required"),
    });

    const handleSignUp = (values, { setSubmitting, setErrors }) => {
        axios.post(`${url}/user/registration`, values)
            .then((response) => { console.log("Response:", response); navigate("/login") })
            .catch((err) => {
                console.log("Error", err.response.data);
                if (err.status == 403) {
                    setErrors({ [err.response.data[0].path]: err.response.data[0].msg });
                }
            }).finally(() => {
                setSubmitting(false);
            });
    };

    return (
        <>
            <div id="login-component">
                <ImageDisplay />
                <div id="login-input">
                    <FrontText isLogin={false} />
                    <Formik
                        initialValues={{
                            first_name: "",
                            last_name: "",
                            email: "",
                            password: "",
                            confirm_password: "",
                            country: "",
                            phone_number: "",
                            user_type: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSignUp}
                    >
                        {({ values, handleChange, handleBlur, touched, errors, isSubmitting, handleSubmit }) => (
                            <Form>
                                <div className="pair">
                                    <div className="with-err">
                                        <Field
                                            as={TextField}
                                            className="text-field"
                                            sx={{ marginLeft: '30px' }}
                                            label="First name"
                                            size="small"
                                            name="first_name"
                                            variant="outlined"
                                            margin="normal"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.first_name}
                                            error={touched.first_name && Boolean(errors.first_name)}
                                        />
                                        <ErrorMessage name="first_name" component="div" className="error-msg" />
                                    </div>
                                    <div className="with-err">

                                        <Field
                                            as={TextField}
                                            className="text-field"
                                            sx={{ marginLeft: '30px' }}
                                            label="Last name"
                                            size="small"
                                            name="last_name"
                                            variant="outlined"
                                            margin="normal"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.last_name}
                                            error={touched.last_name && Boolean(errors.last_name)}
                                        />
                                        <ErrorMessage name="last_name" component="div" className="error-msg" />
                                    </div>
                                </div>
                                <div className="pair">
                                    <div className="with-err">
                                        <Field
                                            as={TextField}
                                            className="text-field"
                                            sx={{ marginLeft: '30px' }}
                                            label="Email"
                                            size="small"
                                            name="email"
                                            variant="outlined"
                                            margin="normal"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.email}
                                            error={touched.email && Boolean(errors.email)}
                                        />
                                        <ErrorMessage name="email" component="div" className="error-msg" />
                                    </div>
                                    <div className="with-err">
                                        <FormControl className="text-field" sx={{ marginLeft: '30px' }} variant="outlined" size="small" margin="normal">
                                            <InputLabel htmlFor="outlined-adornment-password" error={touched.password && Boolean(errors.password)}>Password</InputLabel>
                                            <Field
                                                as={OutlinedInput}
                                                id="outlined-adornment-password"
                                                type={showPassword ? 'text' : 'password'}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label={showPassword ? 'hide the password' : 'display the password'}
                                                            onClick={handleClickShowPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff className="IconButton" /> : <Visibility className="IconButton" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Password"
                                                name="password"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.password}
                                                error={touched.password && Boolean(errors.password)}
                                            />
                                        </FormControl>
                                        <ErrorMessage name="password" component="div" className="error-msg" />
                                    </div>
                                </div>
                                <div className="pair">
                                    <div className="with-err">
                                        <FormControl className="text-field" sx={{ marginLeft: '30px' }} variant="outlined" size="small" margin="normal">
                                            <InputLabel htmlFor="outlined-adornment-password" error={touched.confirm_password && Boolean(errors.confirm_password)}>Confirm Password</InputLabel>
                                            <Field
                                                as={OutlinedInput}
                                                id="outlined-adornment-confirm-password"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            className="IconButton"
                                                            aria-label={showConfirmPassword ? 'hide the password' : 'display the password'}
                                                            onClick={handleClickShowConfirmPassword}
                                                            edge="end"
                                                        >
                                                            {showConfirmPassword ? <VisibilityOff className="IconButton" /> : <Visibility className="IconButton" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Confirm Password"
                                                name="confirm_password"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.confirm_password}
                                                error={touched.confirm_password && Boolean(errors.confirm_password)}
                                            />
                                        </FormControl>
                                        <ErrorMessage name="confirm_password" component="div" className="error-msg" />
                                    </div>
                                    <div className="with-err">
                                        <Field
                                            as={TextField}
                                            className="text-field"
                                            sx={{ marginLeft: '30px' }}
                                            label="Country"
                                            size="small"
                                            name="country"
                                            variant="outlined"
                                            margin="normal"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.country}
                                            error={touched.country && Boolean(errors.country)}
                                        />
                                        <ErrorMessage name="country" component="div" className="error-msg" />
                                    </div>
                                </div>
                                <div className="pair">
                                    <div className="with-err">

                                        <Field
                                            as={TextField}
                                            className="text-field"
                                            sx={{ marginLeft: '30px' }}
                                            label="Phone number"
                                            size="small"
                                            name="phone_number"
                                            variant="outlined"
                                            margin="normal"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.phone_number}
                                            error={touched.phone_number && Boolean(errors.phone_number)}
                                        />
                                        <ErrorMessage name="phone_number" component="div" className="error-msg" />
                                    </div>
                                    <div className="with-err">
                                        <FormControl className="text-field" sx={{ marginLeft: '30px', minWidth: 200, marginTop: '10px' }} size="small">
                                            <InputLabel id="demo-select-small-label" onBlur={handleBlur} error={touched.user_type && Boolean(errors.user_type)}>User Type</InputLabel>
                                            <Field
                                                as={Select}
                                                className="text-field"
                                                name="user_type"
                                                id="demo-select-small"
                                                label="User type"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.user_type}
                                                error={touched.user_type && Boolean(errors.user_type)}
                                            >
                                                <MenuItem value="">
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value={"user"}>User</MenuItem>
                                                <MenuItem value={"admin"}>Property Owner</MenuItem>
                                            </Field>
                                        </FormControl>
                                        <ErrorMessage name="user_type" component="div" className="error-msg" />
                                    </div>
                                </div>
                                <RediectOption isLogin={false} handleFun={handleSubmit} isSubmitting={isSubmitting} />
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    );
}

export default Signup;
