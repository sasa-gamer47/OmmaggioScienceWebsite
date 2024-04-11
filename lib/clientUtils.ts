"use client";

import React, { useState, useEffect } from 'react'

export default // Custom Hook
function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: 1024,
        height: 960,
    });

    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            if (window) {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            }
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount

    return windowSize;
}