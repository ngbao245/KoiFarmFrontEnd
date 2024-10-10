import { NavLink } from "react-router-dom";
import "./NotFoundRoute.css"; // Import the CSS file
import koiIcon from "../../public/assets/icon.png"; // Correctly import the image
import DisableZoom from "../components/DisableZoom";

const NotFoundRoute = () => {
  return (
    <>
      <DisableZoom />
      <section className="py-3 py-md-5 min-vh-100 d-flex justify-content-center align-items-center koi-background user-select-none">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <div className="koi-wrapper mb-4 non-clickable">
                  <h2 className="d-flex justify-content-center align-items-center gap-2 koi-title mb-2">
                    <span className="display-1 fw-bold koi-number koi-fish-four">
                      4
                    </span>
                    <img
                      src={koiIcon}
                      alt="Koi fish"
                      className="koi-fish-center"
                    />
                    <span className="display-1 fw-bold koi-number koi-fish-four">
                      4
                    </span>
                  </h2>
                </div>
                <h3 className="display-6 mt-2 mb-2 koi-water-text">
                  Oops! You seem lost in the pond.
                </h3>
                <p className="mb-4 koi-description text-center">
                  The page you're looking for swam away with the koi fish.
                </p>
                <NavLink
                  className="btn text-light koi-btn btn-lg rounded-pill px-5 fs-4 m-0"
                  to="/"
                  role="button"
                >
                  Swim Back to Home
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFoundRoute;
