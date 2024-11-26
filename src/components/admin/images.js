import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Spin, Input } from "antd";

const ImagePage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch image data
  const fetchImages = () => {
    setLoading(true);
    fetch("http://localhost:5000/AllImages")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Data:", data); // Debugging: Log data to verify structure
        if (data.status === "ok") {
          setImages(data.data);
        } else {
          console.error("Error fetching image data:", data.error);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching image data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleImageClick = (record) => {
    setSelectedImage(record); // Set the full record
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleDownload = () => {
  if (selectedImage?.image) {
    const link = document.createElement("a");
    link.href = selectedImage.image; // Ensure `selectedImage.image` contains the Base64 data
    link.download = "downloaded_image.png"; // Default filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter images based on search term
  const filteredImages = images.filter(
    (image) =>
      image.fname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.lname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Define image source for base64 encoding
  const getImageSrc = (imageString) => {
    if (!imageString) {
      // Return a placeholder image if the image field is missing or undefined
      return "https://via.placeholder.com/100";
    }
    if (imageString.startsWith("data:image")) {
      return imageString; // Return base64 image directly
    }
    // Otherwise, create the URL for the image
    return `http://localhost:5000/AllImages/${imageString}`;
  };

  // Define table columns
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (text, record) => (
        <img
          src={getImageSrc(record.image || "")} // Safely get the image source
          alt="Image"
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
          onClick={() => handleImageClick(record)} // Pass the full record
        />
      ),
    },
    {
      title: "First Name",
      dataIndex: "fname",
      key: "fname",
    },
    {
      title: "Last Name",
      dataIndex: "lname",
      key: "lname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>Image Management</h1>

      {/* Search Bar */}
      <Input
        placeholder="Search images by name or email"
        value={searchTerm}
        onChange={handleSearch}
        style={{ width: 300, marginBottom: 20 }}
      />

      {loading ? (
        <Spin tip="Loading..." spinning={loading} />
      ) : (
        <Table
          dataSource={filteredImages}
          columns={columns}
          rowKey="_id"
          bordered
        />
      )}

      {/* Modal for viewing and downloading image */}
      <Modal
        title="View Image"
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <div style={{ textAlign: "center" }}>
          {selectedImage?.image ? (
            <img
              src={getImageSrc(selectedImage.image)} // Use the base64 or URL logic
              alt="Selected"
              style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
            />
          ) : (
            <p>No image selected</p>
          )}
          <div style={{ marginTop: "10px" }}>
            <Button
              onClick={handleDownload}
              type="primary"
              disabled={!selectedImage?.image}
            >
              Download
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ImagePage;
