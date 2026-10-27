import loginFrontImage from '../../assets/images/login_front.png';

function ImageDisplay() {
    return (
        <div className='redirectOption'>
            <div id="image-component">
                <h1 className='image-title'>Travelista Tours <br />
                    <p className='image-sub-title'> Travel is the only purchase that enriches you in ways <br />
                        beyond material wealth</p></h1>
            </div>
            <img src={loginFrontImage} alt="login front image" id='login-front' />
        </div>
    )
}

export default ImageDisplay
