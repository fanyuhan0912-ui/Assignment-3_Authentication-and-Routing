import { useNavigate } from "react-router-dom";
import dogPic from "../assets/dog-pic.png";

function RegistrationSuccess() {
  const navigate = useNavigate();

  return (
    <section className="registration-success-page">
      <div className="registration-success-card">
        <div className="registration-success-copy">
          <p className="registration-success-kicker">
            <span className="registration-success-check">✓</span>
            Your Form has been received and is safe with us
          </p>

          <h1>Thank You for Signing The Form</h1>

          <p className="registration-success-text">
            Thank you for respecting our procedure. We will contact you shortly.
            Please notice that we will get back to you 5 business day at maximum.
          </p>

          <p className="registration-success-note">
            We hope you have a wonderful day
          </p>

          <button className="hero-action" type="button" onClick={() => navigate("/")}>
            Return to Main Page
          </button>
        </div>

        <div className="registration-success-art" aria-hidden="true">
          <img className="registration-success-dog-image" src={dogPic} alt="" />
          <div className="registration-success-dots" />
        </div>
      </div>
    </section>
  );
}

export default RegistrationSuccess;
