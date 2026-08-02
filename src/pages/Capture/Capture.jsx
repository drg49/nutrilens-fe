import React, { useEffect, useRef, useState } from 'react';
import './Capture.scss';

const Capture = () => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let stream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera access failed:', err);
        setError(
          'Unable to access the camera. Please allow camera permission and try again.',
        );
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="capture-page">
      {error ? (
        <div className="capture-error">{error}</div>
      ) : (
        <>
          <div className="capture-camera-section">
            <div className="capture-video-wrapper">
              <video
                ref={videoRef}
                className="capture-video"
                autoPlay
                playsInline
                muted
              />
            </div>
          </div>
          <div className="capture-details-section">
            {/* Details panel placeholder: buttons/text will be added later */}
          </div>
        </>
      )}
    </div>
  );
};

export default Capture;
