import { Button, Typography } from "@mui/material"
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function RediectOption({ isLogin, handleFun }) {
    return (
        <div className="redirectOption">
            <Button variant="contained" color="primary" sx={{ margin: '1rem' }} onClick={handleFun}> {isLogin ? 'Login' : 'SignUp'}</Button>
            <Typography color='black' variant='p' sx={{
                fontFamily: "PT Sans Narrow, serif",
            }}>Don't have account, <Link to={isLogin ? "/signup" : "/login"}><u>{isLogin ? "Sign Up here" : "Login here"}</u></Link></Typography>
        </div>
    )
}

RediectOption.propTypes = {
    isLogin: PropTypes.bool.isRequired,
    handleFun: PropTypes.func.isRequired,
}

export default RediectOption
