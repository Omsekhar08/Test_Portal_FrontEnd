import React, { useEffect, useRef, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { useNavigate } from 'react-router-dom';

const Proctoring = ({ onSetupComplete = () => {}, onEndTest = () => {} }) => {
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
  const maxWarnings = 5;
  const navigate = useNavigate();

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
        }

        // Mobile device detection code
        const mobileDevices = objectPredictions.filter(pred => 
          ['cell phone', 'laptop', 'tablet'].includes(pred.class) && pred.score > 0.3
        );

        console.log('Detected objects:', objectPredictions); // Debug log

        if (mobileDevices.length > 0) {
          mobileDetectionHistory.current.push(true);
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
    console.warn('Proctoring warning:', message);
    toast.error(message, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    lastNotificationTime.current = Date.now();
    
    warningCountRef.current += 1;
    if (warningCountRef.current >= maxWarnings) {
      console.log('Maximum warnings reached. Ending test.');
      onEndTest();
      navigate('/');
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

  return (
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
  );
};

export default Proctoring;
