import React, { useState, useEffect, useRef } from "react";
import "./PhotoFrame.css";
import axios from "axios";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";


const PhotoFrame = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [savedImage, setSavedImage] = useState(null);
  const [showSavedPreview, setShowSavedPreview] = useState(false);
  const [isPhotoFrameVisible, setIsPhotoFrameVisible] = useState(true);
  const [isUIVisible, setIsUIVisible] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const location = useLocation();
  const slug = new URLSearchParams(location.search).get("slug");
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsUIVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const baseUrl = 'http://localhost:3001/api';

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}events/get-eventbyslug?slug=${slug}`
        );
        const eventData = response.data;
        setImageSrc(eventData.frameUrl);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };
    fetchEventData();
  }, [slug]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setShowModal(true);
    }
  };

  const handleSaveImage = async () => {
    if (selectedImage) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const uploadedImg = new Image();
      uploadedImg.src = selectedImage;

      uploadedImg.onload = () => {
        canvas.width = 1000;
        canvas.height = 1080;

        ctx.filter = "blur(7px)";
        ctx.drawImage(uploadedImg, 0, 0, canvas.width, canvas.height);
        ctx.filter = "none";

        const aspectRatio = uploadedImg.width / uploadedImg.height;
        let drawWidth, drawHeight, offsetX, offsetY;
        if (aspectRatio > canvas.width / canvas.height) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / aspectRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * aspectRatio;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        }
        ctx.drawImage(uploadedImg, offsetX, offsetY, drawWidth, drawHeight);

        const frameImg = new Image();
        frameImg.src = imageSrc;

        frameImg.onload = () => {
          ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

          const combinedImage = canvas.toDataURL("image/png");

          setSavedImage(combinedImage);

          setShowModal(false);

          setShowSavedPreview(true);
        };
      };
    }
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
    setShowModal(false);
  };

  const handleExitPreview = () => {
    setIsPhotoFrameVisible(false);
  };

  if (!isPhotoFrameVisible) return null;
  if (!isUIVisible) return null;

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  const getShareLink = (platform) => {
    const urlEncodedImage = encodeURIComponent(savedImage);
    const shareLinks = {
      whatsapp: `https://api.whatsapp.com/send?text=Check%20out%20my%20photo%20frame!%20${urlEncodedImage}`,
      instagram: "https://www.instagram.com/",
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${urlEncodedImage}`,
      twitter: `https://twitter.com/intent/tweet?url=${urlEncodedImage}&text=Check%20out%20my%20photo%20frame!`,
    };
    return shareLinks[platform];
  };

  return (
    <div className="d-flex vh-100 bg-light justify-content-center">
      {showSavedPreview ? (
        <div
          className="card-container fixed-bottom"
          style={{ marginTop: "20px" }}
        >
          <div className="card">
            <div className="card__hero">
              <img
                src={savedImage}
                alt="Saved with frame"
                className="saved-image"
              />
              <div className="buttonContainer-prew">
                <button className="declineButton" onClick={handleExitPreview}>
                  Exit
                </button>
                <button
                  className="acceptButton"
                  onClick={() => saveAs(savedImage, "downloaded-image.png")}
                >
                  Download
                </button>
                <button className="shareButton" onClick={handleShare}>
                  Share
                </button>
              </div>
              {showShareOptions && (
                <div
                  className="share-options d-flex justify-content-center"
                  style={{ marginTop: "30px" }}
                >
                  <a
                    href={getShareLink("whatsapp")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsappIcon size={32} round="true" />
                  </a>
                  <a
                    href={getShareLink("facebook")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ms-2"
                  >
                    <FacebookIcon size={32} round="true" />
                  </a>
                  <a
                    href={getShareLink("twitter")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ms-2"
                  >
                    <TwitterIcon size={32} round="true" />
                  </a>
                  <a
                    href={getShareLink("instagram")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ms-2"
                  >
                    <img
                      src="/img/general/instagram.png"
                      alt="Instagram"
                      style={{ width: "33px", height: "33px" }}
                    />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : !showUpload ? (
        <div className="card-container fixed-bottom">
          <div className="card">
            <div className="card__hero">
              <div className="card__hero-header">
                <div className="card__icon">
                  <img src="/img/photoframe/ImageFrame1.png" alt="frame" />
                </div>
              </div>
            </div>
            <div className="card__footer">
              <div className="card__job-summary">
                <div className="card__job-icon">
                  <button className="card__btn" onClick={handleExitPreview}>
                    Close
                  </button>
                </div>
                <div className="card__job">
                  <p className="card__job-title-p">
                    Click to get your Photo frame
                  </p>
                </div>
              </div>
              <button className="card__btn" onClick={() => setShowUpload(true)}>
                Get
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center upload-cont">
          <label className="custum-file-upload" htmlFor="file">
            <div className="icon">
              <svg
                viewBox="0 0 24 24"
                width="60px"
                height="60px"
                fill=""
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                    fill=""
                  ></path>{" "}
                </g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier"> </g>
              </svg>
            </div>
            <div className="text fs-5">
              <span>CLick to uplaod image</span>
            </div>
            <input type="file" id="file" onChange={handleImageUpload} />
          </label>
          {showModal && (
            <div className="card-prew">
              <div className="row d-flex justify-content-between align-items-center">
                <div className="col-12 text-black fs-3">Image Preview</div>
              </div>
              <div className="content" id="div-to-capture" ref={containerRef}>
                {/* <div className="frame-container">
                  <img
                    src={selectedImage}
                    alt="Uploaded"
                    className="uploaded-image"
                  />
                  <img
                    src="/img/photoframe/RmkvPhotoFrame.png"
                    alt="Frame"
                        className="frame-image"
                        style={{zIndex:"6"}}
                  />
                </div> */}
                {/* <div className="frame-bg"></div> */}
                {/* <img
                  src={selectedImage}
                  alt="Uploaded"
                  className="uploaded-image"
                /> */}
                <div className="frame-container" ref={containerRef}>
                  <img
                    src={selectedImage}
                    alt="Uploaded"
                    className="uploaded-image-bg"
                  />
                  <img
                    src={imageSrc}
                    alt="Frame"
                    className="frame-image"
                    style={{ zIndex: "6" }}
                  />
                  <img
                    src={selectedImage}
                    alt="Uploaded"
                    className="uploaded-image"
                  />
                </div>
              </div>
              <div className="buttonContainer">
                <button className="declineButton" onClick={handleCloseModal}>
                  Decline
                </button>
                <button className="acceptButton" onClick={handleSaveImage}>
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PhotoFrame;
