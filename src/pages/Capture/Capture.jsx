import React, { useCallback, useEffect, useRef, useState } from "react";
import { uploadPersonalRecipeImage } from "../../api/personal-recipes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faTimes,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@mui/material";
import { useCamera } from "../../context/CameraContext";
import "./Capture.scss";

const Capture = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const fileInputRef = useRef(null);

  const [error, setError] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);

  const camera = useCamera();

  /**
   * Stop the current camera stream.
   */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      } catch (err) {
        console.error("Unable to stop video:", err);
      }
    }
  }, []);

  /**
   * Start the device camera.
   */
  const startCamera = useCallback(async () => {
    try {
      setError(null);

      // Make sure an existing stream is stopped first.
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        try {
          await videoRef.current.play();
        } catch (err) {
          // Browser may reject autoplay. The video element
          // has autoPlay/playsInline/muted set, so we can safely ignore this.
        }
      }
    } catch (err) {
      console.error("Camera access failed:", err);

      setError(
        "Unable to access the camera. Please allow camera permission and try again.",
      );
    }
  }, [stopCamera]);

  /**
   * Start the camera when the component mounts.
   * Stop it when the component unmounts.
   */
  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  /**
   * Revoke the object URL whenever photoUrl changes
   * or when the component unmounts.
   *
   * This prevents browser memory leaks caused by
   * URL.createObjectURL().
   */
  useEffect(() => {
    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [photoUrl]);

  /**
   * Capture the current camera frame as a JPEG.
   */
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || photoCaptured) {
      return;
    }

    const video = videoRef.current;

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
      setError("Camera is not ready yet. Please try again.");
      return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      setError("Unable to capture a photo. Please try again.");
      return;
    }

    context.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Unable to capture a photo. Please try again.");
          return;
        }

        const url = URL.createObjectURL(blob);

        setPhotoUrl(url);
        setPhotoBlob(blob);
        setPhotoCaptured(true);

        // Freeze the camera after capturing the photo.
        stopCamera();
      },
      "image/jpeg",
      0.95,
    );
  }, [photoCaptured, stopCamera]);

  /**
   * Register the capture handler with CameraContext
   * so BottomNav can trigger the camera shutter.
   */
  useEffect(() => {
    camera.registerSnapHandler(capturePhoto);
  }, [camera, capturePhoto]);

  /**
   * Retake the photo.
   */
  const handleRetake = useCallback(async () => {
    setPhotoUrl(null);
    setPhotoBlob(null);
    setPhotoCaptured(false);
    setError(null);

    await startCamera();
  }, [startCamera]);

  /**
   * Handle selecting an image from a file input.
   */
  const handleFileInput = useCallback(
    (event) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please choose an image file.");
        return;
      }

      setError(null);

      const url = URL.createObjectURL(file);

      setPhotoBlob(file);
      setPhotoUrl(url);
      setPhotoCaptured(true);

      // Stop camera if the user chooses a file instead.
      stopCamera();

      // Allow selecting the same file again later.
      event.target.value = "";
    },
    [stopCamera],
  );

  /**
   * Upload the captured/selected image.
   */
  const uploadImage = async () => {
    if (!photoBlob) {
      setError("Please capture or choose a photo first.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await uploadPersonalRecipeImage(photoBlob);

      setPhotoBlob(null);
      setPhotoUrl(null);
      setPhotoCaptured(false);
    } catch (err) {
      console.error("Upload failed:", err);

      setError("Unable to upload photo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="capture-page">
      {error && <div className="capture-error">{error}</div>}

      <div className="capture-camera-section">
        <div className="capture-video-wrapper">
          <video
            ref={videoRef}
            className="capture-video"
            autoPlay
            playsInline
            muted
            style={{
              display: photoCaptured ? "none" : "block",
            }}
          />

          {photoCaptured && photoUrl && (
            <div className="photo-overlay">
              <IconButton
                onClick={handleRetake}
                aria-label="Retake photo"
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  zIndex: 10,
                  backgroundColor: "#d32f2f",
                  color: "white",
                  width: 40,
                  "&:hover": {
                    backgroundColor: "#b71c1c",
                  },
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </IconButton>

              <img src={photoUrl} alt="Captured" />
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input for selecting images from user's computer */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        style={{ display: "none" }}
        aria-label="Select image from device"
      />

      {/* Button to select from computer or generate recipe */}
      {photoCaptured && photoBlob ? (
        <IconButton
          onClick={uploadImage}
          disabled={uploading}
          aria-label="Generate recipe from photo"
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 10,
            backgroundColor: "#1976d2",
            color: "white",
            width: 56,
            height: 56,
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            "&:hover": {
              backgroundColor: "#1565c0",
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
            },
            "&:disabled": {
              backgroundColor: "#90caf9",
              color: "rgba(255, 255, 255, 0.7)",
            },
          }}
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} />
        </IconButton>
      ) : (
        <IconButton
          onClick={() => fileInputRef.current?.click()}
          aria-label="Select image from device"
          sx={{
            position: "absolute",
            bottom: 16,
            right: 16,
            zIndex: 10,
            backgroundColor: "#1976d2",
            color: "white",
            width: 56,
            height: 56,
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            "&:hover": {
              backgroundColor: "#1565c0",
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <FontAwesomeIcon icon={faUpload} />
        </IconButton>
      )}
    </div>
  );
};

export default Capture;
