import { Typography } from '@mui/material';
import PropTypes from 'prop-types';

function FrontText({ isLogin }) {
    return (
        <div className='redirectOption'>
            <Typography variant='h3' color='primary' sx={{
                fontFamily: "PT Sans Narrow, serif",
                fontWeight: 'bold',
                fontStyle: 'italic',
            }}>Welcome</Typography>
            <Typography color='grey' variant='p' sx={{
                fontFamily: "PT Sans Narrow, serif",
            }}>{isLogin ? "Login with Email" : "SignUp"}</Typography>
        </div>
    )
}

FrontText.propTypes = {
    isLogin: PropTypes.bool.isRequired
}

export default FrontText;
