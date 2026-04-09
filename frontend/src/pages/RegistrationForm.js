import { useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/meetmypet-logo.png";
import adoptionIcon from "../assets/adoption-icon.png";
import postingIcon from "../assets/posting-icon.png";

const MAX_FILE_SIZE = 2 * 1024 * 1024;

function createAdoptionForm(defaultName, defaultPetName) {
  return {
    fullName: defaultName,
    email: "",
    phoneNumber: "",
    homeAddress: "",
    petName: defaultPetName,
    note: "",
    idDocument: null,
    proofOfFunds: null,
  };
}

function createPostingForm(defaultName) {
  return {
    fullName: defaultName,
    email: "",
    phoneNumber: "",
    homeAddress: "",
    petName: "",
    petType: "",
    petBreed: "",
    petAge: "",
    petWeight: "",
    vaccinated: "",
    petHealthCondition: "",
    note: "",
    idDocument: null,
    petImage: null,
  };
}

async function fileToPayload(file) {
  if (!file) {
    return null;
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Please use files smaller than 2MB.");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        dataUrl: typeof reader.result === "string" ? reader.result : "",
      });
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

function RegistrationForm() {
  const { user, profile, registrations, submitRegistration } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialType = searchParams.get("type") === "posting" ? "posting" : "adoption";
  const petId = searchParams.get("petId") || "";
  const petName = searchParams.get("petName") || "";
  const displayName = profile?.displayName || user?.username || "";

  const [activeType, setActiveType] = useState(initialType);
  const [adoptionForm, setAdoptionForm] = useState(
    createAdoptionForm(displayName, petName)
  );
  const [postingForm, setPostingForm] = useState(createPostingForm(displayName));
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setIsSubmitting(true);

    try {
      if (activeType === "adoption") {
        const payload = {
          formType: "adoption",
          fullName: adoptionForm.fullName,
          email: adoptionForm.email,
          phoneNumber: adoptionForm.phoneNumber,
          homeAddress: adoptionForm.homeAddress,
          petId: petId || null,
          petName: adoptionForm.petName,
          note: adoptionForm.note,
          idDocument: await fileToPayload(adoptionForm.idDocument),
          proofOfFunds: await fileToPayload(adoptionForm.proofOfFunds),
        };

        const result = await submitRegistration(payload);
        if (!result.success) {
          throw new Error(result.message || "Unable to submit adoption form.");
        }

        setAdoptionForm(createAdoptionForm(displayName, petName));
      } else {
        const payload = {
          formType: "posting",
          fullName: postingForm.fullName,
          email: postingForm.email,
          phoneNumber: postingForm.phoneNumber,
          homeAddress: postingForm.homeAddress,
          petName: postingForm.petName,
          note: postingForm.note,
          idDocument: await fileToPayload(postingForm.idDocument),
          petImage: await fileToPayload(postingForm.petImage),
          petType: postingForm.petType,
          petBreed: postingForm.petBreed,
          petAge: postingForm.petAge,
          petWeight: postingForm.petWeight,
          vaccinated: postingForm.vaccinated,
          petHealthCondition: postingForm.petHealthCondition,
        };

        const result = await submitRegistration(payload);
        if (!result.success) {
          throw new Error(result.message || "Unable to submit posting form.");
        }

        setPostingForm(createPostingForm(displayName));
      }

      setSubmitSuccess("Registration form submitted successfully.");
      navigate("/registration-success");
    } catch (error) {
      setSubmitError(error.message || "Unable to submit form.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const recentRegistrations = registrations.slice(0, 3);

  return (
    <section className="registration-page content-page">
      <div className="section-heading profile-heading">
        <h1>Registration Form</h1>
        <p className="registration-subtitle">
          Please choose one of these two form based on your purpose
        </p>
      </div>

      <div className="registration-switch">
        <button
          className={`registration-tab ${activeType === "adoption" ? "is-active" : ""}`}
          type="button"
          onClick={() => setActiveType("adoption")}
        >
          <img src={adoptionIcon} alt="" aria-hidden="true" />
          Pet Adoption
        </button>
        <button
          className={`registration-tab ${activeType === "posting" ? "is-active" : ""}`}
          type="button"
          onClick={() => setActiveType("posting")}
        >
          <img src={postingIcon} alt="" aria-hidden="true" />
          Pet Posting
        </button>
      </div>

      <div className="registration-card">
        <div className="registration-card-header">
          <h2>
            {activeType === "adoption"
              ? "Pet Adoption Registration Form"
              : "Pet Posting Registration Form"}
          </h2>
          <p>Please fill all of the required information</p>
        </div>

        <form className="registration-form-grid" onSubmit={handleSubmit}>
          {activeType === "posting" ? (
            <>
              <label className="registration-field">
                <span>Name of the pet you wish to post *</span>
                <input
                  type="text"
                  value={postingForm.petName}
                  onChange={(event) =>
                    setPostingForm((current) => ({ ...current, petName: event.target.value }))
                  }
                  required
                />
              </label>

              <label className="registration-field">
                <span>Picture of your pet *</span>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={(event) =>
                    setPostingForm((current) => ({
                      ...current,
                      petImage: event.target.files?.[0] || null,
                    }))
                  }
                  required
                />
              </label>

              <label className="registration-field registration-field-half">
                <span>Pet Type *</span>
                <input
                  type="text"
                  value={postingForm.petType}
                  onChange={(event) =>
                    setPostingForm((current) => ({ ...current, petType: event.target.value }))
                  }
                  required
                />
              </label>

              <label className="registration-field registration-field-half">
                <span>Pet Breed *</span>
                <input
                  type="text"
                  value={postingForm.petBreed}
                  onChange={(event) =>
                    setPostingForm((current) => ({ ...current, petBreed: event.target.value }))
                  }
                  required
                />
              </label>

              <label className="registration-field registration-field-half">
                <span>Pet Age *</span>
                <input
                  type="text"
                  value={postingForm.petAge}
                  onChange={(event) =>
                    setPostingForm((current) => ({ ...current, petAge: event.target.value }))
                  }
                  required
                />
              </label>

              <label className="registration-field registration-field-half">
                <span>Pet Weight *</span>
                <input
                  type="text"
                  value={postingForm.petWeight}
                  onChange={(event) =>
                    setPostingForm((current) => ({ ...current, petWeight: event.target.value }))
                  }
                  required
                />
              </label>

              <label className="registration-field registration-field-half">
                <span>Vaccinated *</span>
                <input
                  type="text"
                  value={postingForm.vaccinated}
                  onChange={(event) =>
                    setPostingForm((current) => ({
                      ...current,
                      vaccinated: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label className="registration-field registration-field-half">
                <span>Pet Health Condition *</span>
                <input
                  type="text"
                  value={postingForm.petHealthCondition}
                  onChange={(event) =>
                    setPostingForm((current) => ({
                      ...current,
                      petHealthCondition: event.target.value,
                    }))
                  }
                  required
                />
              </label>

              <label className="registration-field registration-field-full">
                <span>Note from the owner</span>
                <textarea
                  rows="4"
                  value={postingForm.note}
                  onChange={(event) =>
                    setPostingForm((current) => ({ ...current, note: event.target.value }))
                  }
                />
              </label>
            </>
          ) : null}

          <label className="registration-field">
            <span>Full Name *</span>
            <input
              type="text"
              value={activeType === "adoption" ? adoptionForm.fullName : postingForm.fullName}
              onChange={(event) =>
                activeType === "adoption"
                  ? setAdoptionForm((current) => ({ ...current, fullName: event.target.value }))
                  : setPostingForm((current) => ({ ...current, fullName: event.target.value }))
              }
              required
            />
          </label>

          <label className="registration-field">
            <span>Email *</span>
            <input
              type="email"
              value={activeType === "adoption" ? adoptionForm.email : postingForm.email}
              onChange={(event) =>
                activeType === "adoption"
                  ? setAdoptionForm((current) => ({ ...current, email: event.target.value }))
                  : setPostingForm((current) => ({ ...current, email: event.target.value }))
              }
              required
            />
          </label>

          <label className="registration-field">
            <span>Phone Number *</span>
            <input
              type="text"
              value={
                activeType === "adoption"
                  ? adoptionForm.phoneNumber
                  : postingForm.phoneNumber
              }
              onChange={(event) =>
                activeType === "adoption"
                  ? setAdoptionForm((current) => ({
                      ...current,
                      phoneNumber: event.target.value,
                    }))
                  : setPostingForm((current) => ({
                      ...current,
                      phoneNumber: event.target.value,
                    }))
              }
              required
            />
          </label>

          <label className="registration-field">
            <span>Home Address *</span>
            <input
              type="text"
              value={
                activeType === "adoption"
                  ? adoptionForm.homeAddress
                  : postingForm.homeAddress
              }
              onChange={(event) =>
                activeType === "adoption"
                  ? setAdoptionForm((current) => ({
                      ...current,
                      homeAddress: event.target.value,
                    }))
                  : setPostingForm((current) => ({
                      ...current,
                      homeAddress: event.target.value,
                    }))
              }
              required
            />
          </label>

          <label className="registration-field">
            <span>Your ID *</span>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(event) =>
                activeType === "adoption"
                  ? setAdoptionForm((current) => ({
                      ...current,
                      idDocument: event.target.files?.[0] || null,
                    }))
                  : setPostingForm((current) => ({
                      ...current,
                      idDocument: event.target.files?.[0] || null,
                    }))
              }
              required
            />
          </label>

          {activeType === "adoption" ? (
            <>
              <label className="registration-field">
                <span>Name of the pet you wish to adopt *</span>
                <input
                  type="text"
                  value={adoptionForm.petName}
                  onChange={(event) =>
                    setAdoptionForm((current) => ({ ...current, petName: event.target.value }))
                  }
                  required
                />
              </label>

              <label className="registration-field">
                <span>Your Proof of Funds? *</span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(event) =>
                    setAdoptionForm((current) => ({
                      ...current,
                      proofOfFunds: event.target.files?.[0] || null,
                    }))
                  }
                  required
                />
              </label>

              <label className="registration-field registration-field-full">
                <span>Reason for adoption and note from you</span>
                <textarea
                  rows="4"
                  value={adoptionForm.note}
                  onChange={(event) =>
                    setAdoptionForm((current) => ({ ...current, note: event.target.value }))
                  }
                />
              </label>
            </>
          ) : null}

          {submitError ? <p className="registration-feedback is-error">{submitError}</p> : null}
          {submitSuccess ? (
            <p className="registration-feedback is-success">{submitSuccess}</p>
          ) : null}

          <div className="registration-actions">
            <button className="hero-action" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button
              className="pet-outline-button"
              type="button"
              onClick={() =>
                activeType === "adoption"
                  ? setAdoptionForm(createAdoptionForm(displayName, petName))
                  : setPostingForm(createPostingForm(displayName))
              }
            >
              Delete
            </button>
          </div>
        </form>
      </div>

      <div className="registration-history-preview content-card">
        <div className="registration-history-head">
          <img src={logo} alt="Meet My Pet logo" />
          <div>
            <h3>Recent Registration History</h3>
            <p>Your last few adoption or posting forms appear here.</p>
          </div>
        </div>

        {recentRegistrations.length === 0 ? (
          <p>No registration forms submitted yet.</p>
        ) : (
          <div className="registration-history-list">
            {recentRegistrations.map((entry) => (
              <article className="registration-history-item" key={entry._id}>
                <strong>{entry.formType === "adoption" ? "Pet Adoption" : "Pet Posting"}</strong>
                <span>{entry.petName}</span>
                <span>{new Date(entry.createdAt).toLocaleString()}</span>
              </article>
            ))}
          </div>
        )}

        <button
          className="pet-outline-button"
          type="button"
          onClick={() => navigate("/user-profile")}
        >
          Go To User Profile
        </button>
      </div>
    </section>
  );
}

export default RegistrationForm;
