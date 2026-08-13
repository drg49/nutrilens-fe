import React, { useEffect, useRef, useState } from "react";
import { uploadPersonalRecipeImage } from "../../api/personal-recipes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useCamera } from "../../context/CameraContext";
import "./Capture.scss";

const Capture = () => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [uploading, setUploading] = useState(false);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capturePhoto = () => {
    if (!videoRef.current || photoCaptured) {
      return;
    }

    const video = videoRef.current;
    const width = video.videoWidth;
    const height = video.videoHeight;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

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

  const camera = useCamera();

  // register the capture handler with camera context so BottomNav can trigger it
  useEffect(() => {
    camera.registerSnapHandler(capturePhoto);
  }, [camera, capturePhoto]);

  const handleRetake = async () => {
    // clear the captured photo and restart camera
    if (photoUrl) {
      URL.revokeObjectURL(photoUrl);
    }
    setPhotoUrl(null);
    setPhotoBlob(null);
    setPhotoCaptured(false);
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
  };

  const uploadImage = async () => {
    if (!photoBlob) {
      setError("Please capture or choose a photo first.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      await uploadPersonalRecipeImage(photoBlob);

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

      {/* floating upload FAB positioned above bottom nav */}
      <button
        type="button"
        className="upload-fab"
        onClick={uploadImage}
        disabled={uploading || !photoBlob}
        aria-label="Upload photo"
      >
        <FontAwesomeIcon icon={faUpload} />
      </button>
    </div>
  );
};

export default Capture;
