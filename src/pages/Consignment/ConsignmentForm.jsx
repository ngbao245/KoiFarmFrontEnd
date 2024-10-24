import React, { useState } from "react";
import { createConsignment } from "../../services/ConsignmentService";
import { toast } from "react-toastify";
import "./ConsignmentForm.css";

const ConsignmentForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    origin: "",
    sex: "",
    age: 0,
    size: "",
    species: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createConsignment(formData);

      if (response.statusCode === 201) {
        setSuccess(true);
        setFormData({
          name: "",
          category: "",
          origin: "",
          sex: "",
          age: 0,
          size: "",
          species: "",
        });
        toast.success("Successfully created a consignment");
        setError(null);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (err) {
      toast.error("Failed to create consignment item. Please try again.");
      setSuccess(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="form-group">
              <label htmlFor="origin">Origin</label>
              <input
                type="text"
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Sex</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="sex"
                    value="male"
                    checked={formData.sex === "male"}
                    onChange={handleChange}
                    required
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="sex"
                    value="female"
                    checked={formData.sex === "female"}
                    onChange={handleChange}
                    required
                  />
                  Female
                </label>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="size">Size</label>
              <input
                type="text"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="species">Species</label>
              <input
                type="text"
                id="species"
                name="species"
                value={formData.species}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <div className="consignment-form-container">
          <h1>Create Consignment Item</h1>

          {error && <p className="error-message">{error}</p>}
          {success && (
            <p className="success-message">
              Consignment Item created successfully!
            </p>
          )}

          <div className="progress-indicator">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`step ${currentStep >= step ? "active" : ""}`}
              >
                {step}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="consignment-form">
            {renderFormStep()}

            <div className="button-group">
              {currentStep > 1 && (
                <button type="button" onClick={prevStep} className="btn-prev">
                  Previous
                </button>
              )}
              {currentStep < 3 && (
                <button type="button" onClick={nextStep} className="btn-next">
                  Next
                </button>
              )}
              {currentStep === 3 && (
                <button type="submit" className="btn-submit">
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConsignmentForm;
