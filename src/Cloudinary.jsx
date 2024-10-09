import React, { useState } from "react";
import { Header } from "./layouts/header/header";
import { uploadImageCloudinary } from "./services/CloudinaryService";

const Cloudinary = () => {
  const [profileImage, setProfileImage] = useState("");
  const [imageReview, setImageReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
  const api_key = import.meta.env.VITE_API_KEY;
  const folder = import.meta.env.VITE_FOLDER;

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
    setImageReview(URL.createObjectURL(e.target.files[0]));
  };

  const uploadImage = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl;

      if (
        profileImage &&
        (profileImage.type === "image/png" ||
          profileImage.type === "image/jpg" ||
          profileImage.type === "image/jpeg")
      ) {
        const image = new FormData();
        image.append("file", profileImage);
        image.append("cloud_name", "koi-farm-shop");
        image.append("upload_preset", upload_preset);
        image.append("api_key", api_key);
        image.append("folder", folder);

        // const response = await fetch(
        //   `https://api.cloudinary.com/v1_1/koi-farm-shop/image/upload`,
        //   {
        //     method: "POST",
        //     body: image,
        //   }
        // );

        const response = await uploadImageCloudinary(image);
        imageUrl = response.data.secure_url;  //url image
        console.log(imageUrl);
        setImageReview(null);
        console.log("Uploaded Image URL:", imageUrl);
      }
      alert(imageUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <h1 className="text-center">Product</h1>
      <div className="container">
        <h2>Upload Image to Cloudinary</h2>
        <div className="card">
          <form onSubmit={uploadImage} className="form form-control">
            <p>
              <label>Photo:</label>
              <input
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                name="image"
                onChange={handleImageChange}
              />
            </p>
            <p>
              {isLoading ? (
                "Uploading..."
              ) : (
                <button type="submit" className="btn btn-primary">
                  Upload Image
                </button>
              )}
            </p>
          </form>
          <div className="profile-photo">
            <div>
              {imageReview && (
                <img src={imageReview && imageReview} alt="profileImg" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cloudinary;
