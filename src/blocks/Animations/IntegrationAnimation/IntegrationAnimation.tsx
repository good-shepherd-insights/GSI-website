"use client";

import React, { useRef, useEffect, useCallback, useState } from "react";
import { animate, createTimeline, stagger, utils } from "animejs";
import "./IntegrationAnimation.css";

interface Node {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  type: 'hub' | 'secondary' | 'tertiary';
}

interface Connection {
  from: number;
  to: number;
  delay: number;
}

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface ScrollState {
  progress: number;
  direction: 'up' | 'down';
  isInView: boolean;
}

export default function IntegrationAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animationsRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timelineRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const continuousAnimationsRef = useRef<any[]>([]);
  const hasInitializedRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  
  const [scrollState, setScrollState] = useState<ScrollState>({
    progress: 0,
    direction: 'down',
    isInView: false,
  });

  // Define nodes for the network - positioned to create an "integration" visual
  const nodes: Node[] = [
    { id: 0, x: 50, y: 50, size: 14, delay: 0, type: 'hub' },      // Center-left hub
    { id: 1, x: 150, y: 50, size: 14, delay: 100, type: 'hub' },   // Center-right hub
    { id: 2, x: 100, y: 20, size: 10, delay: 200, type: 'secondary' },    // Top center
    { id: 3, x: 100, y: 80, size: 10, delay: 300, type: 'secondary' },    // Bottom center
    { id: 4, x: 20, y: 20, size: 7, delay: 400, type: 'tertiary' },     // Top-left
    { id: 5, x: 20, y: 80, size: 7, delay: 500, type: 'tertiary' },     // Bottom-left
    { id: 6, x: 180, y: 20, size: 7, delay: 600, type: 'tertiary' },    // Top-right
    { id: 7, x: 180, y: 80, size: 7, delay: 700, type: 'tertiary' },    // Bottom-right
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

  // Floating ambient particles
  const floatingParticles: FloatingParticle[] = [
    { id: 0, x: 30, y: 35, size: 2, duration: 4000, delay: 0 },
    { id: 1, x: 70, y: 65, size: 1.5, duration: 5000, delay: 500 },
    { id: 2, x: 130, y: 30, size: 2, duration: 4500, delay: 1000 },
    { id: 3, x: 170, y: 60, size: 1.5, duration: 5500, delay: 1500 },
    { id: 4, x: 100, y: 50, size: 2.5, duration: 3500, delay: 2000 },
    { id: 5, x: 60, y: 15, size: 1.5, duration: 6000, delay: 800 },
    { id: 6, x: 140, y: 85, size: 2, duration: 4800, delay: 1200 },
  ];

  // Calculate scroll progress relative to component position
  const calculateScrollProgress = useCallback(() => {
    if (!containerRef.current) return { progress: 0, direction: 'down' as const };
    
    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = rect.height;
    
    // Calculate how far through the viewport the element has scrolled
    const scrollStart = windowHeight; // Element starts entering from bottom
    const scrollEnd = -elementHeight; // Element fully exits at top
    const scrollRange = scrollStart - scrollEnd;
    const currentPosition = rect.top;
    
    // Progress from 0 (just entering) to 1 (just exiting)
    const progress = Math.max(0, Math.min(1, (scrollStart - currentPosition) / scrollRange));
    
    // Determine scroll direction
    const currentScrollY = window.scrollY;
    const direction = currentScrollY > lastScrollYRef.current ? 'down' : 'up';
    lastScrollYRef.current = currentScrollY;
    
    return { progress, direction };
  }, []);

  // Start continuous ambient animations
  const startContinuousAnimations = useCallback(() => {
    if (!svgRef.current) return;
    const svg = svgRef.current;

    // Stop any existing continuous animations
    continuousAnimationsRef.current.forEach(anim => {
      if (anim && typeof anim.pause === 'function') anim.pause();
    });
    continuousAnimationsRef.current = [];

    // Hub nodes pulsing
    nodes.filter(n => n.type === 'hub').forEach((node) => {
      const circle = svg.querySelector(`#node-${node.id}`) as SVGCircleElement;
      const pulseRing = svg.querySelector(`#pulse-ring-${node.id}`) as SVGCircleElement;
      
      if (circle) {
        const pulseAnim = animate(circle, {
          scale: [1, 1.15, 1],
          duration: 2500,
          loop: true,
          ease: 'inOutSine',
        });
        continuousAnimationsRef.current.push(pulseAnim);
      }
      
      if (pulseRing) {
        const ringAnim = animate(pulseRing, {
          scale: [1, 2],
          opacity: [0.6, 0],
          duration: 2000,
          loop: true,
          ease: 'outQuad',
        });
        continuousAnimationsRef.current.push(ringAnim);
      }
    });

    // Secondary nodes subtle breathing
    nodes.filter(n => n.type === 'secondary').forEach((node, index) => {
      const circle = svg.querySelector(`#node-${node.id}`) as SVGCircleElement;
      if (circle) {
        const breatheAnim = animate(circle, {
          scale: [1, 1.1, 1],
          duration: 3000,
          delay: index * 500,
          loop: true,
          ease: 'inOutSine',
        });
        continuousAnimationsRef.current.push(breatheAnim);
      }
    });

    // Connection glow animation
    connections.forEach((conn, index) => {
      const line = svg.querySelector(`#connection-${conn.from}-${conn.to}`) as SVGLineElement;
      if (line) {
        const glowAnim = animate(line, {
          strokeOpacity: [0.7, 1, 0.7],
          strokeWidth: [1.5, 2.5, 1.5],
          duration: 3000,
          delay: index * 200,
          loop: true,
          ease: 'inOutSine',
        });
        continuousAnimationsRef.current.push(glowAnim);
      }
    });

    // Floating particles animation
    floatingParticles.forEach((particle) => {
      const elem = svg.querySelector(`#floating-particle-${particle.id}`) as SVGCircleElement;
      if (elem) {
        const floatAnim = animate(elem, {
          translateY: [0, -15, 0, 10, 0],
          translateX: [0, 8, -5, 3, 0],
          opacity: [0.3, 0.8, 0.5, 0.7, 0.3],
          duration: particle.duration,
          delay: particle.delay,
          loop: true,
          ease: 'inOutQuad',
        });
        continuousAnimationsRef.current.push(floatAnim);
      }
    });

    // Data flow particles along connections
    connections.forEach((conn, index) => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      const particle = svg.querySelector(`#flow-particle-${conn.from}-${conn.to}`) as SVGCircleElement;
      
      if (fromNode && toNode && particle) {
        const flowAnim = animate(particle, {
          cx: [fromNode.x, toNode.x, fromNode.x],
          cy: [fromNode.y, toNode.y, fromNode.y],
          opacity: [0, 1, 1, 0, 0, 1, 1, 0],
          duration: 4000,
          delay: index * 400,
          loop: true,
          ease: 'inOutQuad',
        });
        continuousAnimationsRef.current.push(flowAnim);
      }
    });

    // Integration symbol rotation and pulse
    const symbol = svg.querySelector('.integration-symbol path') as SVGPathElement;
    if (symbol) {
      const symbolAnim = animate(symbol, {
        rotate: [0, 360],
        scale: [1, 1.3, 1],
        duration: 8000,
        loop: true,
        ease: 'linear',
      });
      continuousAnimationsRef.current.push(symbolAnim);
    }

    // Outer ring rotation
    const outerRing = svg.querySelector('#outer-ring') as SVGCircleElement;
    if (outerRing) {
      const ringRotateAnim = animate(outerRing, {
        rotate: [0, 360],
        duration: 20000,
        loop: true,
        ease: 'linear',
      });
      continuousAnimationsRef.current.push(ringRotateAnim);
    }
  }, []);

  // Run entrance animation sequence
  const runEntranceAnimation = useCallback(() => {
    if (!svgRef.current || hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const svg = svgRef.current;

    // Clear any existing animations
    animationsRef.current.forEach(anim => {
      if (anim && typeof anim.pause === 'function') anim.pause();
    });
    animationsRef.current = [];

    // Create main timeline for coordinated entrance
    const timeline = createTimeline({
      defaults: {
        ease: 'outExpo',
      },
    });

    // Initial reset of all elements
    nodes.forEach((node) => {
      const circle = svg.querySelector(`#node-${node.id}`) as SVGCircleElement;
      const glow = svg.querySelector(`#glow-${node.id}`) as SVGCircleElement;
      if (circle) {
        circle.style.opacity = '0';
        circle.setAttribute('transform', `translate(${node.x}, ${node.y}) scale(0)`);
      }
      if (glow) {
        glow.style.opacity = '0';
      }
    });

    connections.forEach((conn) => {
      const line = svg.querySelector(`#connection-${conn.from}-${conn.to}`) as SVGLineElement;
      if (line) {
        const length = line.getTotalLength();
        line.style.strokeDasharray = `${length}`;
        line.style.strokeDashoffset = `${length}`;
        line.style.opacity = '0';
      }
    });

    // Phase 1: Hub nodes appear with elastic spring
    timeline.add(
      svg.querySelectorAll('.nodes circle[data-type="hub"]'),
      {
        opacity: [0, 1],
        scale: [0, 1],
        duration: 800,
        ease: 'outElastic(1, 0.6)',
      },
      0
    );

    // Phase 2: Secondary nodes with stagger
    timeline.add(
      svg.querySelectorAll('.nodes circle[data-type="secondary"]'),
      {
        opacity: [0, 1],
        scale: [0, 1],
        duration: 600,
        ease: 'outBack(1.7)',
        delay: stagger(150),
      },
      200
    );

    // Phase 3: Tertiary nodes with stagger
    timeline.add(
      svg.querySelectorAll('.nodes circle[data-type="tertiary"]'),
      {
        opacity: [0, 1],
        scale: [0, 1],
        duration: 500,
        ease: 'outBack(2)',
        delay: stagger(100),
      },
      400
    );

    // Phase 4: Main hub connection draws
    const mainConnection = svg.querySelector('#connection-0-1') as SVGLineElement;
    if (mainConnection) {
      const length = mainConnection.getTotalLength();
      timeline.add(
        mainConnection,
        {
          strokeDashoffset: [length, 0],
          opacity: [0, 1],
          duration: 600,
          ease: 'inOutQuad',
        },
        600
      );
    }

    // Phase 5: Other connections draw with stagger
    const otherConnections = Array.from(svg.querySelectorAll('.connections line:not(#connection-0-1)'));
    otherConnections.forEach((line, index) => {
      const lineElement = line as SVGLineElement;
      const length = lineElement.getTotalLength();
      timeline.add(
        lineElement,
        {
          strokeDashoffset: [length, 0],
          opacity: [0, 1],
          duration: 400,
          ease: 'inOutQuad',
        },
        700 + index * 80
      );
    });

    // Phase 6: Glow effects burst
    timeline.add(
      svg.querySelectorAll('.glows circle'),
      {
        opacity: [0, 0.8, 0],
        scale: [1, 2],
        duration: 800,
        ease: 'outQuad',
        delay: stagger(50),
      },
      800
    );

    // Phase 7: Integration symbol appears
    timeline.add(
      '.integration-symbol',
      {
        opacity: [0, 1],
        scale: [0, 1],
        rotate: [180, 0],
        duration: 600,
        ease: 'outBack(2)',
      },
      1200
    );

    // Phase 8: Floating particles fade in
    timeline.add(
      svg.querySelectorAll('.floating-particles circle'),
      {
        opacity: [0, 0.5],
        duration: 400,
        delay: stagger(100),
      },
      1400
    );

    timelineRef.current = timeline;
    animationsRef.current.push(timeline);

    // Start continuous animations after entrance completes
    setTimeout(() => {
      startContinuousAnimations();
    }, 2000);

  }, [startContinuousAnimations]);

  // Handle scroll-based animation progress
  const handleScroll = useCallback(() => {
    if (!scrollState.isInView) return;

    const { progress, direction } = calculateScrollProgress();
    
    setScrollState(prev => ({
      ...prev,
      progress,
      direction: direction as 'up' | 'down',
    }));

    // Apply scroll-based transformations
    if (svgRef.current) {
      const svg = svgRef.current;
      
      // Parallax effect on different node layers
      nodes.forEach((node) => {
        const circle = svg.querySelector(`#node-${node.id}`) as SVGCircleElement;
        if (circle) {
          const parallaxFactor = node.type === 'hub' ? 0.1 : node.type === 'secondary' ? 0.2 : 0.3;
          const offsetY = (progress - 0.5) * 20 * parallaxFactor;
          const currentScale = circle.getAttribute('data-scale') || '1';
          circle.style.transform = `translate(${node.x}px, ${node.y + offsetY}px) scale(${currentScale})`;
        }
      });

      // Rotate integration symbol based on scroll
      const symbol = svg.querySelector('.integration-symbol') as SVGGElement;
      if (symbol) {
        const rotation = progress * 180;
        symbol.style.transform = `rotate(${rotation}deg)`;
      }

      // Adjust connection opacity based on scroll progress
      connections.forEach((conn, index) => {
        const line = svg.querySelector(`#connection-${conn.from}-${conn.to}`) as SVGLineElement;
        if (line) {
          const connectionProgress = Math.max(0, Math.min(1, (progress * 1.5) - (index * 0.05)));
          line.style.opacity = String(0.5 + connectionProgress * 0.5);
        }
      });
    }
  }, [scrollState.isInView, calculateScrollProgress]);

  // Throttled scroll handler using RAF
  const onScroll = useCallback(() => {
    if (rafIdRef.current) return;
    
    rafIdRef.current = requestAnimationFrame(() => {
      handleScroll();
      rafIdRef.current = null;
    });
  }, [handleScroll]);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isInView = entry.isIntersecting;
          
          setScrollState(prev => ({
            ...prev,
            isInView,
          }));

          if (isInView && !hasInitializedRef.current) {
            runEntranceAnimation();
          }

          // Pause/resume continuous animations based on visibility
          if (!isInView) {
            continuousAnimationsRef.current.forEach(anim => {
              if (anim && typeof anim.pause === 'function') anim.pause();
            });
          } else if (hasInitializedRef.current) {
            continuousAnimationsRef.current.forEach(anim => {
              if (anim && typeof anim.play === 'function') anim.play();
            });
          }
        });
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    const container = containerRef.current;
    if (container) {
      observer.observe(container);
    }

    // Add scroll listener
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      if (container) {
        observer.unobserve(container);
      }
      window.removeEventListener('scroll', onScroll);
      
      // Cancel any pending RAF
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      
      // Cleanup all animations
      animationsRef.current.forEach(anim => {
        if (anim && typeof anim.pause === 'function') anim.pause();
      });
      continuousAnimationsRef.current.forEach(anim => {
        if (anim && typeof anim.pause === 'function') anim.pause();
      });
    };
  }, [runEntranceAnimation, onScroll]);

  return (
    <div 
      ref={containerRef}
      className="integration-animation"
      data-scroll-progress={scrollState.progress.toFixed(2)}
      data-scroll-direction={scrollState.direction}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 200 100"
        className="integration-svg"
      >
        <defs>
          {/* Enhanced glow filter */}
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Intense glow for hubs */}
          <filter id="hubGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="2" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Particle glow */}
          <filter id="particleGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Animated gradient for connections */}
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#99FF33" stopOpacity="0.6">
              <animate attributeName="stop-opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor="#CCFF99" stopOpacity="1">
              <animate attributeName="stop-opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#99FF33" stopOpacity="0.6">
              <animate attributeName="stop-opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          {/* Hub gradient */}
          <radialGradient id="hubGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#CCFF99" />
            <stop offset="50%" stopColor="#99FF33" />
            <stop offset="100%" stopColor="#66CC00" />
          </radialGradient>

          {/* Secondary node gradient */}
          <radialGradient id="secondaryGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#BBFF77" />
            <stop offset="70%" stopColor="#88DD22" />
            <stop offset="100%" stopColor="#66AA11" />
          </radialGradient>

          {/* Tertiary node gradient */}
          <radialGradient id="tertiaryGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#AAEE55" />
            <stop offset="100%" stopColor="#77BB22" />
          </radialGradient>

          {/* Pulse ring gradient */}
          <radialGradient id="pulseGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#99FF33" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#99FF33" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background ambient ring */}
        <circle
          id="outer-ring"
          cx="100"
          cy="50"
          r="45"
          fill="none"
          stroke="#99FF33"
          strokeWidth="0.5"
          strokeDasharray="4 8"
          opacity="0.3"
          style={{ transformOrigin: '100px 50px' }}
        />

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
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#glow)"
                className="connection-line"
              />
            );
          })}
        </g>

        {/* Flow particles along connections */}
        <g className="flow-particles">
          {connections.map((conn) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            if (!fromNode) return null;
            return (
              <circle
                key={`flow-particle-${conn.from}-${conn.to}`}
                id={`flow-particle-${conn.from}-${conn.to}`}
                cx={fromNode.x}
                cy={fromNode.y}
                r="2.5"
                fill="#CCFF99"
                opacity="0"
                filter="url(#particleGlow)"
                className="flow-particle"
              />
            );
          })}
        </g>

        {/* Floating ambient particles */}
        <g className="floating-particles">
          {floatingParticles.map((particle) => (
            <circle
              key={`floating-particle-${particle.id}`}
              id={`floating-particle-${particle.id}`}
              cx={particle.x}
              cy={particle.y}
              r={particle.size}
              fill="#99FF33"
              opacity="0"
              filter="url(#particleGlow)"
              className="floating-particle"
            />
          ))}
        </g>

        {/* Pulse rings for hub nodes */}
        <g className="pulse-rings">
          {nodes.filter(n => n.type === 'hub').map((node) => (
            <circle
              key={`pulse-ring-${node.id}`}
              id={`pulse-ring-${node.id}`}
              cx={node.x}
              cy={node.y}
              r={node.size}
              fill="url(#pulseGradient)"
              opacity="0"
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
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
              r={node.size + 4}
              fill="none"
              stroke="#99FF33"
              strokeWidth="2"
              opacity="0"
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
            />
          ))}
        </g>

        {/* Network nodes */}
        <g className="nodes">
          {nodes.map((node) => {
            const gradient = node.type === 'hub' 
              ? 'url(#hubGradient)' 
              : node.type === 'secondary' 
                ? 'url(#secondaryGradient)' 
                : 'url(#tertiaryGradient)';
            const filter = node.type === 'hub' ? 'url(#hubGlow)' : 'url(#glow)';
            
            return (
              <circle
                key={`node-${node.id}`}
                id={`node-${node.id}`}
                cx={node.x}
                cy={node.y}
                r={node.size}
                fill={gradient}
                filter={filter}
                data-type={node.type}
                data-scale="1"
                className={`node node-${node.type}`}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              />
            );
          })}
        </g>

        {/* Center integration symbol - diamond with inner detail */}
        <g className="integration-symbol" style={{ transformOrigin: '100px 50px' }}>
          <path
            d="M100 35 L115 50 L100 65 L85 50 Z"
            fill="none"
            stroke="#99FF33"
            strokeWidth="1.5"
            filter="url(#glow)"
            className="symbol-outer"
          />
          <path
            d="M100 42 L108 50 L100 58 L92 50 Z"
            fill="#99FF33"
            filter="url(#hubGlow)"
            className="symbol-inner"
            style={{ transformOrigin: '100px 50px' }}
          />
          {/* Radiating lines */}
          <line x1="100" y1="32" x2="100" y2="28" stroke="#99FF33" strokeWidth="1" opacity="0.6" />
          <line x1="100" y1="68" x2="100" y2="72" stroke="#99FF33" strokeWidth="1" opacity="0.6" />
          <line x1="82" y1="50" x2="78" y2="50" stroke="#99FF33" strokeWidth="1" opacity="0.6" />
          <line x1="118" y1="50" x2="122" y2="50" stroke="#99FF33" strokeWidth="1" opacity="0.6" />
        </g>
      </svg>
    </div>
  );
}