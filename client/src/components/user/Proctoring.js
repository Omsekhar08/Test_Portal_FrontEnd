import React, { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Proctoring = ({ 
  isActive, 
  isSetupMode, 
  onAlert, 
  onSetupComplete, 
  onViolation, 
  onEndTest 
}) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const faceModelRef = useRef(null);
  const objectModelRef = useRef(null);
  const canvasRef = useRef(null);
  const [isSetup, setIsSetup] = useState(false);
  const lastNotificationTime = useRef(0);
  const notificationCooldown = 1000; 
  const mobileDetectionHistory = useRef([]);
  const historyLength = 3;
  const warningCountRef = useRef(0);
  const maxWarnings = 9;
  const navigate = useNavigate();
  const lastWarningMessage = useRef('');

  const setupCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = resolve;
        });
        videoRef.current.play();
        setIsSetup(true);
        onSetupComplete(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      onSetupComplete(false);
    }
  }, [onSetupComplete]);

  const loadModels = async () => {
    try {
      await tf.setBackend('webgl');
      await tf.ready();
      faceModelRef.current = await blazeface.load();
      objectModelRef.current = await cocoSsd.load();
      console.log('Models loaded successfully');
    } catch (error) {
      console.error('Error loading models:', error);
    }
  };

  const detectFaceAndMobile = async () => {
    if (!videoRef.current || !faceModelRef.current || !objectModelRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const facePredictions = await faceModelRef.current.estimateFaces(video, false);
      const objectPredictions = await objectModelRef.current.detect(video);

      const currentTime = Date.now();

      console.log('Face predictions:', facePredictions); // Debug log

      if (currentTime - lastNotificationTime.current > notificationCooldown) {
        if (facePredictions.length === 0) {
          handleWarning('No face detected');
        } else if (facePredictions.length > 1) {
          console.log('Multiple faces detected:', facePredictions.length); // Debug log
          handleWarning(`Multiple people detected: ${facePredictions.length}`);
        } else if (facePredictions.length === 1) {
          const face = facePredictions[0];
          
          // Check face visibility (based on confidence score)
          if (face.probability < 0.8) {
            handleWarning('Face not clearly visible');
          }

          // Check face orientation/gaze
          const rightEye = face.landmarks[0];
          const leftEye = face.landmarks[1];
          const nose = face.landmarks[2];
          
          // Calculate face angle based on eye positions
          const eyeDistance = Math.sqrt(
            Math.pow(rightEye[0] - leftEye[0], 2) + 
            Math.pow(rightEye[1] - leftEye[1], 2)
          );
          
          // If eyes are too close together, person is likely not facing camera
          if (eyeDistance < 20) {
            handleWarning('Please face the camera directly');
          }

          // Check lighting conditions using canvas
          const imageData = ctx.getImageData(
            face.topLeft[0], 
            face.topLeft[1], 
            face.bottomRight[0] - face.topLeft[0], 
            face.bottomRight[1] - face.topLeft[1]
          );
          
          const brightness = calculateBrightness(imageData.data);
          if (brightness < 50) {
            handleWarning('Poor lighting conditions - please improve lighting');
          } else if (brightness > 200) {
            handleWarning('Too much light - please reduce glare');
          }
        }

        // Mobile device detection code
        const mobileDevices = objectPredictions.filter(pred => 
          ['cell phone', 'laptop', 'tablet'].includes(pred.class) && pred.score > 0.3
        );

        console.log('Detected objects:', objectPredictions); // Debug log

        if (mobileDevices.length > 0) {
          mobileDetectionHistory.current.push(true);
          console.log('Suspicious device detected:', suspiciousDevices); // Debug log for specific devices
        } else {
          mobileDetectionHistory.current.push(false);
        }

        if (mobileDetectionHistory.current.length > historyLength) {
          mobileDetectionHistory.current.shift();
        }

        const mobileDetectionCount = mobileDetectionHistory.current.filter(Boolean).length;
        const detectionThreshold = Math.floor(historyLength * 0.6); 

        if (mobileDetectionCount >= detectionThreshold) {
          console.log('Mobile device consistently detected:', mobileDevices);
          handleWarning('Mobile device detected');
        }
      }
    } catch (error) {
      console.error('Error in detection:', error);
    }
  };

  const handleWarning = (message) => {
    const currentTime = Date.now();
    
    // Only show warning if it's a new message or enough time has passed since last warning
    if (message !== lastWarningMessage.current || 
        currentTime - lastNotificationTime.current > notificationCooldown) {
      
      console.warn('Proctoring warning:', message);
      toast.warning(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      onAlert(message);
      lastNotificationTime.current = currentTime;
      lastWarningMessage.current = message;
      
      warningCountRef.current += 1;
      console.log('Warning count:', warningCountRef.current); // Debug log
      
      if (warningCountRef.current >= maxWarnings) {
        console.log('Maximum warnings reached. Ending test.');
        toast.error('Too many warnings. Test ended.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        onEndTest();
      }
    }
  };

  useEffect(() => {
    setupCamera();
    loadModels();

    const intervalId = setInterval(detectFaceAndMobile, 500);  

    return () => {
      clearInterval(intervalId);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [setupCamera]);

  // Helper function to calculate average brightness
  const calculateBrightness = (pixels) => {
    let sum = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      sum += (r + g + b) / 3;
    }
    return sum / (pixels.length / 4);
  };

  return (
    <>
      <div style={{ position: 'relative', width: '240px', height: '150px' }}>
        <video
          ref={videoRef}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          playsInline
        />
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
        {!isSetup && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
          }}>
            Setting up camera...
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

Proctoring.defaultProps = {
  isActive: false,
  isSetupMode: false,
  onAlert: () => {},
  onSetupComplete: () => {},
  onViolation: () => {},
  onEndTest: () => {}
};

export default Proctoring;
