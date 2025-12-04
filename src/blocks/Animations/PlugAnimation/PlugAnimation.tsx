"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface PlugAnimationProps {
  children: React.ReactNode;
  className?: string;
}

export default function PlugAnimation({ children, className = "" }: PlugAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPlugRef = useRef<HTMLDivElement>(null);
  const rightPlugRef = useRef<HTMLDivElement>(null);
  const connectionRef = useRef<HTMLDivElement>(null);
  const leftWireRef = useRef<HTMLDivElement>(null);
  const rightWireRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const leftPlug = leftPlugRef.current;
    const rightPlug = rightPlugRef.current;
    const connection = connectionRef.current;
    const leftWire = leftWireRef.current;
    const rightWire = rightWireRef.current;

    if (!container || !leftPlug || !rightPlug || !connection || !leftWire || !rightWire) return;

    // Initial state - plugs are disconnected
    gsap.set(leftPlug, { 
      x: -60,
      scale: 0.8,
      opacity: 0.7
    });
    
    gsap.set(rightPlug, { 
      x: 60,
      scale: 0.8,
      opacity: 0.7
    });
    
    gsap.set(connection, { 
      scaleX: 0,
      opacity: 0
    });
    
    gsap.set([leftWire, rightWire], { 
      scaleX: 0,
      opacity: 0 
    });

    // Hover animation
    const handleMouseEnter = () => {
      const tl = gsap.timeline();
      
      // Animate plugs connecting
      tl.to(leftPlug, {
        x: -20,
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "back.out(1.7)"
      })
      .to(rightPlug, {
        x: 20,
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "back.out(1.7)"
      }, "-=0.15")
      .to(connection, {
        scaleX: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.2")
      .to([leftWire, rightWire], {
        scaleX: 1,
        opacity: 0.6,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.3");
    };

    const handleMouseLeave = () => {
      const tl = gsap.timeline();
      
      // Animate plugs disconnecting
      tl.to([leftWire, rightWire], {
        scaleX: 0,
        opacity: 0,
        duration: 0.2,
        ease: "power2.in"
      })
      .to(connection, {
        scaleX: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in"
      }, "-=0.1")
      .to([leftPlug, rightPlug], {
        x: (i) => i === 0 ? -60 : 60,
        scale: 0.8,
        opacity: 0.7,
        duration: 0.4,
        ease: "back.in(1.7)"
      }, "-=0.2");
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`plug-animation-container ${className}`}
      style={{
        position: "relative",
        display: "inline-block",
        cursor: "pointer"
      }}
    >
      {/* Left wire */}
      <div
        ref={leftWireRef}
        style={{
          position: "absolute",
          left: "-60px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "40px",
          height: "2px",
          background: "linear-gradient(90deg, #99FF33 0%, #4a9d1f 100%)",
          transformOrigin: "right center",
          borderRadius: "1px",
          zIndex: 1
        }}
      />
      
      {/* Right wire */}
      <div
        ref={rightWireRef}
        style={{
          position: "absolute",
          right: "-60px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "40px",
          height: "2px",
          background: "linear-gradient(90deg, #4a9d1f 0%, #99FF33 100%)",
          transformOrigin: "left center",
          borderRadius: "1px",
          zIndex: 1
        }}
      />

      {/* Left plug */}
      <div
        ref={leftPlugRef}
        style={{
          position: "absolute",
          left: "-80px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "16px",
          height: "20px",
          background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
          border: "2px solid #99FF33",
          borderRadius: "3px",
          zIndex: 2,
          boxShadow: "0 2px 8px rgba(153, 255, 51, 0.3)"
        }}
      >
        {/* Left plug holes */}
        <div style={{
          position: "absolute",
          left: "3px",
          top: "4px",
          width: "8px",
          height: "2px",
          background: "#99FF33",
          borderRadius: "1px"
        }} />
        <div style={{
          position: "absolute",
          left: "3px",
          top: "8px",
          width: "8px",
          height: "2px",
          background: "#99FF33",
          borderRadius: "1px"
        }} />
        <div style={{
          position: "absolute",
          left: "3px",
          top: "12px",
          width: "8px",
          height: "2px",
          background: "#99FF33",
          borderRadius: "1px"
        }} />
      </div>

      {/* Right plug */}
      <div
        ref={rightPlugRef}
        style={{
          position: "absolute",
          right: "-80px",
          top: "50%",
          transform: "translateY(-50%)",
          width: "16px",
          height: "20px",
          background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
          border: "2px solid #99FF33",
          borderRadius: "3px",
          zIndex: 2,
          boxShadow: "0 2px 8px rgba(153, 255, 51, 0.3)"
        }}
      >
        {/* Right plug holes */}
        <div style={{
          position: "absolute",
          right: "3px",
          top: "4px",
          width: "8px",
          height: "2px",
          background: "#99FF33",
          borderRadius: "1px"
        }} />
        <div style={{
          position: "absolute",
          right: "3px",
          top: "8px",
          width: "8px",
          height: "2px",
          background: "#99FF33",
          borderRadius: "1px"
        }} />
        <div style={{
          position: "absolute",
          right: "3px",
          top: "12px",
          width: "8px",
          height: "2px",
          background: "#99FF33",
          borderRadius: "1px"
        }} />
      </div>

      {/* Connection bridge */}
      <div
        ref={connectionRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "40px",
          height: "4px",
          background: "linear-gradient(90deg, #99FF33, #4a9d1f)",
          borderRadius: "2px",
          transformOrigin: "center",
          zIndex: 1
        }}
      />

      {/* Button content */}
      <div style={{ position: "relative", zIndex: 3 }}>
        {children}
      </div>
    </div>
  );
}