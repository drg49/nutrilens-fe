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
          video: { facingMode: 'user' },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera access failed:', err);
        setError(
          'Unable to access the front camera. Please allow camera permission and try again.',
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
      <h1>Capture</h1>
      {error ? (
        <div className="capture-error">{error}</div>
      ) : (
        <div className="capture-video-wrapper">
          <video
            ref={videoRef}
            className="capture-video"
            autoPlay
            playsInline
            muted
          />
        </div>
      )}
    </div>
  );
};

export default Capture;
