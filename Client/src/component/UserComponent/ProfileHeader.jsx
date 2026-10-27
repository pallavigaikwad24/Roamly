
const ProfileHeader = ({ profile }) => {
    return (
        <div className="card-profile margin-bottom">
            <div className="card-content-profile">
                <div className="profile-header">
                    {/* <div className="profile-avatar">
                        <i className="fa-solid fa-user"></i>
                    </div> */}
                    <div className="profile-info">
                        <h1 className="profile-name-profile">{`${profile?.first_name} ${profile?.last_name}`}</h1>
                        <div className="profile-details">
                            <div className="profile-detail-item">
                                <i className="fa-solid fa-envelope"></i>
                                <span>{profile?.email}</span>
                            </div>
                            <div className="profile-detail-item">
                                <i className="fa-regular fa-calendar"></i>
                                <span>Joined {new Date(profile?.joinAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
