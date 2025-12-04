"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { animate } from "animejs";
import "./IntegrationAnimation.css";

interface Node {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface Connection {
  from: number;
  to: number;
  delay: number;
}

export default function IntegrationAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animationRef = useRef<any[]>([]);
  const hasAnimatedRef = useRef(false);

  // Define nodes for the network - positioned to create an "integration" visual
  const nodes: Node[] = [
    { id: 0, x: 50, y: 50, size: 12, delay: 0 },      // Center-left hub
    { id: 1, x: 150, y: 50, size: 12, delay: 100 },   // Center-right hub
    { id: 2, x: 100, y: 25, size: 8, delay: 200 },    // Top center
    { id: 3, x: 100, y: 75, size: 8, delay: 300 },    // Bottom center
    { id: 4, x: 25, y: 25, size: 6, delay: 400 },     // Top-left
    { id: 5, x: 25, y: 75, size: 6, delay: 500 },     // Bottom-left
    { id: 6, x: 175, y: 25, size: 6, delay: 600 },    // Top-right
    { id: 7, x: 175, y: 75, size: 6, delay: 700 },    // Bottom-right
  ];

  // Define connections between nodes
  const connections: Connection[] = [
    { from: 0, to: 1, delay: 800 },   // Main hub connection
    { from: 0, to: 2, delay: 900 },
    { from: 1, to: 2, delay: 1000 },
    { from: 0, to: 3, delay: 1100 },
    { from: 1, to: 3, delay: 1200 },
    { from: 0, to: 4, delay: 1300 },
    { from: 0, to: 5, delay: 1400 },
    { from: 1, to: 6, delay: 1500 },
    { from: 1, to: 7, delay: 1600 },
    { from: 2, to: 3, delay: 1700 },  // Vertical center connection
  ];

  const runAnimation = useCallback(() => {
    if (!svgRef.current || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    // Clear any existing animations
    animationRef.current.forEach(anim => {
      if (anim && typeof anim.pause === 'function') anim.pause();
    });
    animationRef.current = [];

    const svg = svgRef.current;

    // Animate nodes appearing
    nodes.forEach((node) => {
      const circle = svg.querySelector(`#node-${node.id}`) as SVGCircleElement;
      const glow = svg.querySelector(`#glow-${node.id}`) as SVGCircleElement;
      
      if (circle && glow) {
        // Initial state
        circle.style.transform = 'scale(0)';
        circle.style.opacity = '0';
        glow.style.transform = 'scale(0)';
        glow.style.opacity = '0';

        // Animate node appearance
        const nodeAnim = animate(circle, {
          scale: [0, 1],
          opacity: [0, 1],
          duration: 600,
          delay: node.delay,
          ease: "outElastic(1, 0.5)",
        });

        // Animate glow
        const glowAnim = animate(glow, {
          scale: [0, 1.5],
          opacity: [0, 0.6, 0],
          duration: 1200,
          delay: node.delay,
          ease: "outQuad",
        });

        animationRef.current.push(nodeAnim as any, glowAnim as any);
      }
    });

    // Animate connections drawing
    connections.forEach((conn) => {
      const line = svg.querySelector(`#connection-${conn.from}-${conn.to}`) as SVGLineElement;
      const dataParticle = svg.querySelector(`#particle-${conn.from}-${conn.to}`) as SVGCircleElement;
      
      if (line) {
        const length = line.getTotalLength();
        
        // Initial state
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = `${length}`;
        line.style.opacity = '0';

        // Animate line drawing
        const lineAnim = animate(line, {
          strokeDashoffset: [length, 0],
          opacity: [0, 1],
          duration: 800,
          delay: conn.delay,
          ease: "inOutQuad",
        });

        animationRef.current.push(lineAnim as any);
      }

      if (dataParticle) {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);
        
        if (fromNode && toNode) {
          // Animate data particle traveling along connection
          const particleAnim = animate(dataParticle, {
            cx: [fromNode.x, toNode.x],
            cy: [fromNode.y, toNode.y],
            opacity: [0, 1, 1, 0],
            duration: 1000,
            delay: conn.delay + 400,
            ease: "inOutQuad",
          });

          animationRef.current.push(particleAnim as any);
        }
      }
    });

    // Continuous pulse animation for hub nodes after initial animation
    setTimeout(() => {
      const hubNodes = [0, 1];
      hubNodes.forEach((id) => {
        const circle = svg.querySelector(`#node-${id}`) as SVGCircleElement;
        if (circle) {
          const pulseAnim = animate(circle, {
            scale: [1, 1.2, 1],
            duration: 2000,
            loop: true,
            ease: "inOutSine",
          });
          animationRef.current.push(pulseAnim as any);
        }
      });
    }, 2500);

  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            runAnimation();
          }
        });
      },
      { threshold: 0.3 }
    );

    const container = containerRef.current;
    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
      animationRef.current.forEach(anim => anim.pause());
    };
  }, [runAnimation]);

  return (
    <div 
      ref={containerRef}
      className="integration-animation"
      style={{
        width: "100%",
        maxWidth: "400px",
        aspectRatio: "2/1",
        position: "relative",
        margin: "0 auto",
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 200 100"
        style={{
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        <defs>
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradient for connections */}
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#99FF33" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#99FF33" stopOpacity="1" />
            <stop offset="100%" stopColor="#99FF33" stopOpacity="0.8" />
          </linearGradient>

          {/* Radial gradient for nodes */}
          <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#99FF33" />
            <stop offset="70%" stopColor="#7ACC29" />
            <stop offset="100%" stopColor="#5A991F" />
          </radialGradient>
        </defs>

        {/* Connection lines */}
        <g className="connections">
          {connections.map((conn) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            
            return (
              <line
                key={`connection-${conn.from}-${conn.to}`}
                id={`connection-${conn.from}-${conn.to}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="url(#connectionGradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
                filter="url(#glow)"
              />
            );
          })}
        </g>

        {/* Data particles */}
        <g className="particles">
          {connections.map((conn) => (
            <circle
              key={`particle-${conn.from}-${conn.to}`}
              id={`particle-${conn.from}-${conn.to}`}
              r="2"
              fill="#99FF33"
              opacity="0"
              filter="url(#glow)"
            />
          ))}
        </g>

        {/* Glow rings */}
        <g className="glows">
          {nodes.map((node) => (
            <circle
              key={`glow-${node.id}`}
              id={`glow-${node.id}`}
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="none"
              stroke="#99FF33"
              strokeWidth="2"
              opacity="0"
            />
          ))}
        </g>

        {/* Network nodes */}
        <g className="nodes">
          {nodes.map((node) => (
            <circle
              key={`node-${node.id}`}
              id={`node-${node.id}`}
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="url(#nodeGradient)"
              filter="url(#glow)"
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            />
          ))}
        </g>

        {/* Center integration symbol */}
        <g className="integration-symbol" opacity="0.9">
          <path
            d="M95 45 L100 40 L105 45 L100 50 Z"
            fill="#99FF33"
            filter="url(#glow)"
            style={{ transformOrigin: "100px 45px" }}
          />
        </g>
      </svg>
    </div>
  );
}