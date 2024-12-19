import React, { useState, useEffect } from "react";
import "./home.css";

const HomePage = () => {
  const [images, setImages] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageId, setSelectedImageId] = useState("");

  // Fetch images when the component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  // Fetch images from the backend
  const fetchImages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token provided.");

      const response = await fetch("http://localhost:5000/getImage", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        throw new Error("Unauthorized access. Please log in.");
      }

      const result = await response.json();
      if (result.status === "ok") {
        setImages(result.data);
      } else {
        setUploadStatus("Failed to load images.");
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setUploadStatus(error.message || "An error occurred while fetching images.");
    } finally {
      setLoading(false);
    }
  };

  // Handle image uploads
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    const token = localStorage.getItem("token");
    if (!token) {
      setUploadStatus("Unauthorized. Please log in.");
      return;
    }

    try {
      const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async () => {
            const base64Image = reader.result.split(",")[1];
            try {
              const response = await fetch("http://localhost:5000/upload-image", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ base64: base64Image }),
              });

              const result = await response.json();
              if (result.status === "ok") {
                resolve("Image uploaded successfully.");
              } else {
                reject("Failed to upload image.");
              }
            } catch (error) {
              reject("Error uploading image.");
            }
          };
          reader.readAsDataURL(file);
        });
      });

      await Promise.all(uploadPromises);
      setUploadStatus("All images uploaded successfully!");
      fetchImages(); // Refresh images
    } catch (error) {
      console.error("Error during upload:", error);
      setUploadStatus(error.message || "An error occurred during image upload.");
    }
  };

  // Handle modal logic
  const handleImageClick = (imageSrc, imageId) => {
    setSelectedImage(imageSrc);
    setSelectedImageId(imageId);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  // Handle image download
  const handleImageDownload = () => {
    const link = document.createElement("a");
    link.href = selectedImage;
    link.download = "image.jpg"; // Use file-specific names if available
    link.click();
  };

  // Handle image deletion
  const handleDeleteImage = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUploadStatus("Unauthorized. Please log in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/delete-image/${selectedImageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.status === "ok") {
        setUploadStatus("Image deleted successfully!");
        fetchImages(); // Refresh the image list after deletion
        closeModal(); // Close the modal after deletion
      } else {
        setUploadStatus("Failed to delete image.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      setUploadStatus(error.message || "An error occurred while deleting image.");
    }
  };

  return (
    <div className="homepage">
      <header className="header">
        <h1 className="title">Welcome to the Image Upload Page</h1>
        <p className="subtitle">Upload and view your favorite images!</p>
      </header>

      <section className="upload-section">
        <div className="upload-container">
          <h2>Upload Images</h2>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
          <div className="status-message">{uploadStatus}</div>
        </div>

        <div className="images-container">
          <h2>Images</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="image-grid">
              {images.length > 0 ? (
                images.map((image, index) => (
                  <div
                    key={index}
                    className="image-card"
                    onClick={() => handleImageClick(`data:image/jpeg;base64,${image.image}`, image._id)}
                  >
                    <img
                      src={`data:image/jpeg;base64,${image.image}`}
                      alt={`Image ${index}`}
                      className="image-thumbnail"
                      onError={(e) => {
                        e.target.src = "/placeholder.jpg";
                      }}
                    />
                  </div>
                ))
              ) : (
                <p>No images available.</p>
              )}
            </div>
          )}
        </div>
      </section>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <img src={selectedImage} alt="Full View" className="full-image" />
            <button onClick={closeModal}>Close</button>
            <button onClick={handleImageDownload}>Download</button>
            <button onClick={handleDeleteImage}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
