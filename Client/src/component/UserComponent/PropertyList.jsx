const PropertyList = ({ properties }) => {
  return (
    <div className="card-profile margin-bottom">
      <div className="card-header">
        <h2 className="card-title-profile">
          <i className="fa-solid fa-building"></i>
          Property Listings
        </h2>
      </div>
      <div className="card-content-profile">
        <div className="grid-container">

          {properties && properties?.length != 0 ?
            properties.map(property => (
              <div key={property?.id} className="card-profile">
                <div className="card-content-profile">
                  <h3 className="item-title">{property?.name}</h3>
                  <div className="item-details">
                    <div className="detail-row">
                      <i className="fa-solid fa-map-pin"></i>
                      <span>{property?.location}</span>
                    </div>
                    <div className="item-footer">
                      <span className="price">{property.price}</span>
                      <span className={`status-badge ${property.is_verified === false
                        ? 'not-verified'
                        : 'verified'
                        }`}>
                        {property?.is_verified ? "Verified" : "Not Verified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )) : <div>No Property Listing Yet!</div> }
        </div>
      </div>
    </div>
  );
};

export default PropertyList;