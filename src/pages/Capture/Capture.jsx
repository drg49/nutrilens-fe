import React, { useEffect, useRef, useState } from "react";
import { uploadPersonalRecipeImage } from "../../api/personal-recipes";
import "./Capture.scss";

const Capture = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [photoCaptured, setPhotoCaptured] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // ensure playback
        try {
          await videoRef.current.play();
        } catch (e) {
          // ignore autoplay/play promise errors
        }
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      setError(
        "Unable to access the camera. Please allow camera permission and try again.",
      );
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current) {
      return;
    }

    const video = videoRef.current;
    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
      setError("Unable to capture a photo right now. Please try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    if (!context) {
      setError("Unable to capture a photo right now.");
      return;
    }

    context.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Unable to capture a photo. Please try again.");
          return;
        }

        if (photoUrl) {
          URL.revokeObjectURL(photoUrl);
        }

        const url = URL.createObjectURL(blob);
        setPhotoUrl(url);
        setPhotoBlob(blob);
        setSuccessMessage("Photo captured. Ready to upload.");
        setPhotoCaptured(true);

        // stop camera to freeze and free device
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          try {
            videoRef.current.pause();
            videoRef.current.srcObject = null;
          } catch (e) {
            // ignore
          }
        }
      },
      "image/jpeg",
      0.95,
    );
  };

  const handleRetake = async () => {
    // clear the captured photo and restart camera
    if (photoUrl) {
      URL.revokeObjectURL(photoUrl);
    }
    setPhotoUrl(null);
    setPhotoBlob(null);
    setPhotoCaptured(false);
    setSuccessMessage("");
    setError("");

    await startCamera();
  };

  // removed clear action — Retake restarts camera and clears photo

  const handleFileInput = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (photoUrl) {
      URL.revokeObjectURL(photoUrl);
    }

    setPhotoBlob(file);
    setPhotoUrl(URL.createObjectURL(file));
    setSuccessMessage("Photo selected. Ready to upload.");
  };

  const uploadImage = async () => {
    if (!photoBlob) {
      setError("Please capture or choose a photo first.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccessMessage("");

    try {
      await uploadPersonalRecipeImage(photoBlob);

      setSuccessMessage("Photo uploaded successfully.");
      setPhotoBlob(null);
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
        setPhotoUrl(null);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Unable to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  console.log(photoCaptured, photoUrl, photoBlob);

  return (
    <div className="capture-page">
      {error && <div className="capture-error">{error}</div>}
      {successMessage && (
        <div className="capture-success">{successMessage}</div>
      )}
      <div className="capture-camera-section">
        <div className="capture-video-wrapper">
          <video
            ref={videoRef}
            className="capture-video"
            autoPlay
            playsInline
            muted
            style={{ display: photoCaptured ? "none" : "block" }}
          />

          {photoCaptured && photoUrl && (
            <div className="photo-overlay">
              <img src={photoUrl} alt="captured" />
            </div>
          )}
        </div>
      </div>

      <div className="capture-details-section">
        {!photoCaptured && (
          <button
            type="button"
            className="capture-button"
            onClick={capturePhoto}
          >
            Capture Photo
          </button>
        )}

        <label className="capture-file-label">
          Choose Image
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileInput}
          />
        </label>

        <button
          type="button"
          className="upload-button"
          onClick={uploadImage}
          disabled={uploading || !photoBlob}
        >
          {uploading ? "Uploading..." : "Upload Photo"}
        </button>

        {photoCaptured && (
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              type="button"
              className="retake-button"
              onClick={handleRetake}
            >
              Retake
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Capture;
