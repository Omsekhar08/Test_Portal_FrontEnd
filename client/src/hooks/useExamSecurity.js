import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

const useExamSecurity = ({ enabled, onViolation }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle violations
  const handleViolation = useCallback((message) => {
    if (onViolation) {
      onViolation(message);
    } else {
      toast.error(message);
    }
  }, [onViolation]);

  // Enter fullscreen
  const enterFullscreen = useCallback(() => {
    const element = document.documentElement;
    try {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } catch (error) {
      console.error('Fullscreen error:', error);
      handleViolation('Failed to enter fullscreen mode');
    }
  }, [handleViolation]);

  // Monitor fullscreen
  useEffect(() => {
    if (!enabled) return;

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (!isCurrentlyFullscreen) {
        handleViolation("Please maintain fullscreen mode during the exam");
        enterFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, [enabled, handleViolation, enterFullscreen]);

  // Prevent tab switching
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation("Tab switching is not allowed during the exam");
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [enabled, handleViolation]);

  // Prevent copy/paste/right-click
  useEffect(() => {
    if (!enabled) return;

    const preventDefault = (e) => {
      e.preventDefault();
      handleViolation("This action is not allowed during the exam");
    };

    document.addEventListener('copy', preventDefault);
    document.addEventListener('paste', preventDefault);
    document.addEventListener('cut', preventDefault);
    document.addEventListener('contextmenu', preventDefault);

    const handleKeyDown = (e) => {
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.altKey && e.key === 'Tab')
      ) {
        e.preventDefault();
        handleViolation("Keyboard shortcuts are not allowed during the exam");
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Prevent text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    return () => {
      document.removeEventListener('copy', preventDefault);
      document.removeEventListener('paste', preventDefault);
      document.removeEventListener('cut', preventDefault);
      document.removeEventListener('contextmenu', preventDefault);
      window.removeEventListener('keydown', handleKeyDown);
      
      document.body.style.userSelect = 'auto';
      document.body.style.webkitUserSelect = 'auto';
    };
  }, [enabled, handleViolation]);

  return {
    isFullscreen,
    enterFullscreen
  };
};

export default useExamSecurity; 