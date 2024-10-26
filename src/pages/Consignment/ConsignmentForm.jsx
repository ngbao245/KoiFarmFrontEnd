import React, { useState } from "react";
import { createConsignment } from "../../services/ConsignmentService";
import { toast } from "react-toastify";
import { uploadImageCloudinary } from "../../services/CloudinaryService"; // Import the image upload service
import "./ConsignmentForm.css";
import FishSpinner from "../../components/FishSpinner";

const folder = import.meta.env.VITE_FOLDER_CONSIGNMENT;

const ConsignmentForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    origin: "",
    sex: "",
    age: 0,
    size: "",
    species: "",
    imageUrl: null,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value || "",
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const uploadImage = async () => {
    try {
      if (imageFile) {
        const response = await uploadImageCloudinary(imageFile, folder);
        return response.secure_url;
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed. Please try again.");
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const uploadedImageUrl = await uploadImage();
      if (uploadedImageUrl) {
        const newConsignmentData = { ...formData, imageUrl: uploadedImageUrl };
        const response = await createConsignment(newConsignmentData);

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
            imageUrl: null,
          });
          setImageFile(null);
          setImagePreview(null);
          setCurrentStep(1);
          toast.success("Successfully created a consignment");
          setError(null);
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      }
    } catch (err) {
      toast.error("Failed to create consignment item. Please try again.");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setImagePreview(null);
    setCurrentStep(currentStep - 1);
  };

  const isFormValid = () => {
    // return Object.values(formData).every(
    //   (value) => value !== "" && value !== 0
    // );
    const requiredFieldsFilled =
      formData.name &&
      formData.category &&
      formData.origin &&
      formData.sex &&
      formData.size &&
      formData.species &&
      imageFile;
    const ageIsValid = formData.age > 0;

    return requiredFieldsFilled && ageIsValid;
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
                value={formData.name || ""}
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
                value={formData.category || ""}
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
                value={formData.origin || ""}
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
                value={formData.age || 0}
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
                value={formData.size || ""}
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
                value={formData.species || ""}
                onChange={handleChange}
                required
              />
            </div>
          </>
        );
      case 4:
        return (
          <>
            <div className="form-group">
              <label htmlFor="imageUrl">Choose file:</label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                onChange={handleImageChange}
                className="text-dark"
                required
              />
            </div>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" className="w-100" />
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  const handleClose = () => {
    setImagePreview(null)
    setCurrentStep(1);  
    onClose();  
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={handleClose}>
          &times;
        </button>
        <div className="consignment-form-container">
          <h1>Create Consignment Item</h1>

          {isLoading ? (
            <FishSpinner />
          ) : (
            <>
              <div className="progress-indicator">
                {[1, 2, 3, 4].map((step) => (
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
                    <button
                      type="button"
                      onClick={prevStep}
                      className="btn-prev"
                    >
                      Previous
                    </button>
                  )}
                  {currentStep < 4 && (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="btn-next"
                    >
                      Next
                    </button>
                  )}
                  {currentStep === 4 && (
                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={!isFormValid()}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsignmentForm;
