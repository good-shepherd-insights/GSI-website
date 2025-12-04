"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { createTimeline, stagger } from "animejs";
import "./BuildingGrowthAnimation.css";

export default function BuildingGrowthAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timelineRef = useRef<any>(null);
  const hasInitializedRef = useRef(false);

  // Brand green color
  const GREEN = "#99FF33";
  const STROKE_WIDTH = 1.5;
  const THIN_STROKE = 0.8;

  // Run the line-drawing animation
  const runAnimation = useCallback(() => {
    if (!svgRef.current || hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const svg = svgRef.current;

    // Get all path/line elements and set up stroke-dasharray
    const setupElement = (selector: string) => {
      const el = svg.querySelector(selector) as SVGGeometryElement;
      if (el && el.getTotalLength) {
        const length = el.getTotalLength();
        el.style.strokeDasharray = `${length}`;
        el.style.strokeDashoffset = `${length}`;
      }
    };

    // Setup all elements with class
    const setupElements = (selector: string) => {
      svg.querySelectorAll(selector).forEach((el) => {
        const element = el as SVGGeometryElement;
        if (element.getTotalLength) {
          const length = element.getTotalLength();
          element.style.strokeDasharray = `${length}`;
          element.style.strokeDashoffset = `${length}`;
        }
      });
    };

    // === Setup Small Building Elements ===
    setupElement('#ground-line');
    setupElement('#small-base');
    setupElement('#small-left-wall');
    setupElement('#small-right-wall');
    setupElement('#small-roof');
    setupElement('#small-parapet-left');
    setupElement('#small-parapet-right');
    setupElement('#small-parapet-top');
    setupElement('#small-floor-line');
    setupElement('#small-door');
    setupElement('#small-door-line');
    setupElement('#small-awning');
    setupElement('#small-awning-support-left');
    setupElement('#small-awning-support-right');
    setupElements('.small-window-upper');
    setupElements('.small-window-storefront');

    // === Setup Enterprise Building Elements ===
    setupElement('#enterprise-base');
    setupElement('#enterprise-left-wall');
    setupElement('#enterprise-right-wall');
    setupElement('#enterprise-roof');
    setupElement('#enterprise-roof-cap-left');
    setupElement('#enterprise-roof-cap-right');
    setupElement('#enterprise-roof-cap-top');
    setupElement('#enterprise-door');
    setupElement('#enterprise-door-line');
    setupElement('#enterprise-entrance-overhang');
    setupElements('.enterprise-floor');
    setupElements('.enterprise-window');

    // === Setup Skyscraper Complex Elements ===
    // Main skyscraper
    setupElement('#skyscraper-base');
    setupElement('#skyscraper-left-wall');
    setupElement('#skyscraper-right-wall');
    setupElement('#skyscraper-roof');
    setupElement('#skyscraper-crown-left');
    setupElement('#skyscraper-crown-right');
    setupElement('#skyscraper-crown-top');
    setupElement('#skyscraper-door');
    setupElement('#skyscraper-door-line');
    setupElement('#skyscraper-entrance-overhang');
    setupElements('.skyscraper-floor');
    setupElements('.skyscraper-window');

    // Left sub-building
    setupElement('#sub-left-base');
    setupElement('#sub-left-left-wall');
    setupElement('#sub-left-right-wall');
    setupElement('#sub-left-roof');
    setupElements('.sub-left-floor');
    setupElements('.sub-left-window');

    // Right sub-building
    setupElement('#sub-right-base');
    setupElement('#sub-right-left-wall');
    setupElement('#sub-right-right-wall');
    setupElement('#sub-right-roof');
    setupElements('.sub-right-floor');
    setupElements('.sub-right-window');

    // Create main timeline
    const timeline = createTimeline({
      defaults: {
        ease: 'outQuad',
      },
    });

    // =====================================
    // === PHASE 1: Small Business (0-2200ms) ===
    // =====================================
    
    // Ground line draws first
    timeline.add('#ground-line', {
      strokeDashoffset: 0,
      duration: 400,
      ease: 'linear',
    }, 0);

    // Small building base draws
    timeline.add('#small-base', {
      strokeDashoffset: 0,
      duration: 500,
      ease: 'outQuad',
    }, 200);

    // Small building walls rise up
    timeline.add('#small-left-wall', {
      strokeDashoffset: 0,
      duration: 600,
      ease: 'outQuad',
    }, 500);

    timeline.add('#small-right-wall', {
      strokeDashoffset: 0,
      duration: 600,
      ease: 'outQuad',
    }, 500);

    // Flat roof draws
    timeline.add('#small-roof', {
      strokeDashoffset: 0,
      duration: 400,
      ease: 'outQuad',
    }, 1000);

    // Parapet draws
    timeline.add('#small-parapet-left', {
      strokeDashoffset: 0,
      duration: 200,
      ease: 'outQuad',
    }, 1300);

    timeline.add('#small-parapet-right', {
      strokeDashoffset: 0,
      duration: 200,
      ease: 'outQuad',
    }, 1300);

    timeline.add('#small-parapet-top', {
      strokeDashoffset: 0,
      duration: 200,
      ease: 'outQuad',
    }, 1400);

    // Floor division line
    timeline.add('#small-floor-line', {
      strokeDashoffset: 0,
      duration: 300,
      ease: 'outQuad',
    }, 1100);

    // Upper floor windows
    timeline.add('.small-window-upper', {
      strokeDashoffset: 0,
      duration: 200,
      delay: stagger(80),
      ease: 'outQuad',
    }, 1200);

    // Door
    timeline.add('#small-door', {
      strokeDashoffset: 0,
      duration: 300,
      ease: 'outQuad',
    }, 1500);

    timeline.add('#small-door-line', {
      strokeDashoffset: 0,
      duration: 200,
      ease: 'outQuad',
    }, 1700);

    // Awning
    timeline.add('#small-awning', {
      strokeDashoffset: 0,
      duration: 250,
      ease: 'outQuad',
    }, 1600);

    timeline.add('#small-awning-support-left', {
      strokeDashoffset: 0,
      duration: 150,
      ease: 'outQuad',
    }, 1750);

    timeline.add('#small-awning-support-right', {
      strokeDashoffset: 0,
      duration: 150,
      ease: 'outQuad',
    }, 1750);

    // Storefront windows
    timeline.add('.small-window-storefront', {
      strokeDashoffset: 0,
      duration: 200,
      delay: stagger(100),
      ease: 'outQuad',
    }, 1800);

    // =====================================
    // === PHASE 1→2 Transition (2200-2800ms) ===
    // =====================================
    
    // Small building fades out
    timeline.add('#small-building-group', {
      opacity: [1, 0],
      duration: 600,
      ease: 'inQuad',
    }, 2200);

    // =====================================
    // === PHASE 2: Enterprise Building (2800-5500ms) ===
    // =====================================
    
    // Enterprise base
    timeline.add('#enterprise-base', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 500,
      ease: 'outQuad',
    }, 2800);

    // Walls rise
    timeline.add('#enterprise-left-wall', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 800,
      ease: 'outQuad',
    }, 3100);

    timeline.add('#enterprise-right-wall', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 800,
      ease: 'outQuad',
    }, 3100);

    // Roof
    timeline.add('#enterprise-roof', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 400,
      ease: 'outQuad',
    }, 3700);

    // Roof cap
    timeline.add('#enterprise-roof-cap-left', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 200,
      ease: 'outQuad',
    }, 3900);

    timeline.add('#enterprise-roof-cap-right', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 200,
      ease: 'outQuad',
    }, 3900);

    timeline.add('#enterprise-roof-cap-top', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 300,
      ease: 'outQuad',
    }, 4000);

    // Floor lines
    timeline.add('.enterprise-floor', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 200,
      delay: stagger(80, { from: 'last' }),
      ease: 'outQuad',
    }, 4100);

    // Windows
    timeline.add('.enterprise-window', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 150,
      delay: stagger(30, { from: 'last' }),
      ease: 'outQuad',
    }, 4400);

    // Entrance
    timeline.add('#enterprise-entrance-overhang', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 300,
      ease: 'outQuad',
    }, 4900);

    timeline.add('#enterprise-door', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 400,
      ease: 'outQuad',
    }, 5000);

    timeline.add('#enterprise-door-line', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 200,
      ease: 'outQuad',
    }, 5200);

    // =====================================
    // === PHASE 2→3 Transition (5500-6100ms) ===
    // =====================================
    
    // Enterprise building fades out
    timeline.add('#enterprise-building-group', {
      opacity: [1, 0],
      duration: 600,
      ease: 'inQuad',
    }, 5500);

    // =====================================
    // === PHASE 3: Skyscraper Complex (6100-9500ms) ===
    // =====================================
    
    // --- Left Sub-building draws first ---
    timeline.add('#sub-left-base', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 300,
      ease: 'outQuad',
    }, 6100);

    timeline.add('#sub-left-left-wall', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 500,
      ease: 'outQuad',
    }, 6300);

    timeline.add('#sub-left-right-wall', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 500,
      ease: 'outQuad',
    }, 6300);

    timeline.add('#sub-left-roof', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 300,
      ease: 'outQuad',
    }, 6700);

    timeline.add('.sub-left-floor', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 150,
      delay: stagger(60, { from: 'last' }),
      ease: 'outQuad',
    }, 6800);

    timeline.add('.sub-left-window', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 100,
      delay: stagger(25, { from: 'last' }),
      ease: 'outQuad',
    }, 6900);

    // --- Right Sub-building draws ---
    timeline.add('#sub-right-base', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 300,
      ease: 'outQuad',
    }, 6200);

    timeline.add('#sub-right-left-wall', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 400,
      ease: 'outQuad',
    }, 6400);

    timeline.add('#sub-right-right-wall', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 400,
      ease: 'outQuad',
    }, 6400);

    timeline.add('#sub-right-roof', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 300,
      ease: 'outQuad',
    }, 6700);

    timeline.add('.sub-right-floor', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 150,
      delay: stagger(60, { from: 'last' }),
      ease: 'outQuad',
    }, 6800);

    timeline.add('.sub-right-window', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 100,
      delay: stagger(25, { from: 'last' }),
      ease: 'outQuad',
    }, 6900);

    // --- Main Skyscraper draws (center, tallest) ---
    timeline.add('#skyscraper-base', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 400,
      ease: 'outQuad',
    }, 7000);

    timeline.add('#skyscraper-left-wall', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 1000,
      ease: 'outQuad',
    }, 7200);

    timeline.add('#skyscraper-right-wall', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 1000,
      ease: 'outQuad',
    }, 7200);

    timeline.add('#skyscraper-roof', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 300,
      ease: 'outQuad',
    }, 8000);

    // Crown detail
    timeline.add('#skyscraper-crown-left', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 200,
      ease: 'outQuad',
    }, 8200);

    timeline.add('#skyscraper-crown-right', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 200,
      ease: 'outQuad',
    }, 8200);

    timeline.add('#skyscraper-crown-top', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 250,
      ease: 'outQuad',
    }, 8300);

    // Floor lines
    timeline.add('.skyscraper-floor', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 150,
      delay: stagger(40, { from: 'last' }),
      ease: 'outQuad',
    }, 8400);

    // Windows
    timeline.add('.skyscraper-window', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 80,
      delay: stagger(15, { from: 'last' }),
      ease: 'outQuad',
    }, 8600);

    // Entrance
    timeline.add('#skyscraper-entrance-overhang', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 250,
      ease: 'outQuad',
    }, 9000);

    timeline.add('#skyscraper-door', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 300,
      ease: 'outQuad',
    }, 9100);

    timeline.add('#skyscraper-door-line', {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 200,
      ease: 'outQuad',
    }, 9300);

    timelineRef.current = timeline;

  }, []);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasInitializedRef.current) {
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
    };
  }, [runAnimation]);

  return (
    <div
      ref={containerRef}
      className="building-growth-animation"
      aria-label="Animation showing business growth from small business to enterprise skyscraper"
      role="img"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 200 140"
        className="building-growth-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Ground line */}
        <line
          id="ground-line"
          x1="10"
          y1="120"
          x2="190"
          y2="120"
          stroke={GREEN}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />

        {/* ===== PHASE 1: SMALL BUSINESS BUILDING ===== */}
        <g id="small-building-group">
          {/* Base line */}
          <line
            id="small-base"
            x1="65"
            y1="120"
            x2="135"
            y2="120"
            stroke={GREEN}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />

          {/* Left wall */}
          <line
            id="small-left-wall"
            x1="65"
            y1="120"
            x2="65"
            y2="55"
            stroke={GREEN}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />

          {/* Right wall */}
          <line
            id="small-right-wall"
            x1="135"
            y1="120"
            x2="135"
            y2="55"
            stroke={GREEN}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />

          {/* Flat roof line */}
          <line
            id="small-roof"
            x1="65"
            y1="55"
            x2="135"
            y2="55"
            stroke={GREEN}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />

          {/* Parapet */}
          <line
            id="small-parapet-left"
            x1="65"
            y1="55"
            x2="65"
            y2="50"
            stroke={GREEN}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <line
            id="small-parapet-right"
            x1="135"
            y1="55"
            x2="135"
            y2="50"
            stroke={GREEN}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <line
            id="small-parapet-top"
            x1="65"
            y1="50"
            x2="135"
            y2="50"
            stroke={GREEN}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />

          {/* Floor division */}
          <line
            id="small-floor-line"
            x1="65"
            y1="88"
            x2="135"
            y2="88"
            stroke={GREEN}
            strokeWidth={THIN_STROKE}
            fill="none"
          />

          {/* Upper floor windows */}
          <rect className="small-window-upper" x="70" y="62" width="12" height="18" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" />
          <rect className="small-window-upper" x="87" y="62" width="12" height="18" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" />
          <rect className="small-window-upper" x="104" y="62" width="12" height="18" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" />
          <rect className="small-window-upper" x="121" y="62" width="12" height="18" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" />

          {/* Door */}
          <rect id="small-door" x="90" y="95" width="20" height="25" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" />
          <line id="small-door-line" x1="100" y1="95" x2="100" y2="120" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" />

          {/* Awning */}
          <line id="small-awning" x1="85" y1="93" x2="115" y2="93" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" />
          <line id="small-awning-support-left" x1="85" y1="93" x2="88" y2="88" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" />
          <line id="small-awning-support-right" x1="115" y1="93" x2="112" y2="88" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" />

          {/* Storefront windows */}
          <rect className="small-window-storefront" x="68" y="95" width="18" height="20" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" />
          <rect className="small-window-storefront" x="114" y="95" width="18" height="20" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" />
        </g>

        {/* ===== PHASE 2: ENTERPRISE BUILDING ===== */}
        <g id="enterprise-building-group">
          <line id="enterprise-base" x1="55" y1="120" x2="145" y2="120" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
          <line id="enterprise-left-wall" x1="60" y1="120" x2="60" y2="25" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
          <line id="enterprise-right-wall" x1="140" y1="120" x2="140" y2="25" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
          <line id="enterprise-roof" x1="60" y1="25" x2="140" y2="25" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />

          {/* Roof cap */}
          <line id="enterprise-roof-cap-left" x1="75" y1="25" x2="75" y2="18" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
          <line id="enterprise-roof-cap-right" x1="125" y1="25" x2="125" y2="18" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
          <line id="enterprise-roof-cap-top" x1="75" y1="18" x2="125" y2="18" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />

          {/* Floor lines */}
          <line className="enterprise-floor" x1="60" y1="37" x2="140" y2="37" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <line className="enterprise-floor" x1="60" y1="49" x2="140" y2="49" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <line className="enterprise-floor" x1="60" y1="61" x2="140" y2="61" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <line className="enterprise-floor" x1="60" y1="73" x2="140" y2="73" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <line className="enterprise-floor" x1="60" y1="85" x2="140" y2="85" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

          {/* Windows - 6 rows */}
          <rect className="enterprise-window" x="68" y="28" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="82" y="28" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="96" y="28" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="110" y="28" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="124" y="28" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

          <rect className="enterprise-window" x="68" y="40" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="82" y="40" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="96" y="40" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="110" y="40" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="124" y="40" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

          <rect className="enterprise-window" x="68" y="52" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="82" y="52" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="96" y="52" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="110" y="52" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="124" y="52" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

          <rect className="enterprise-window" x="68" y="64" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="82" y="64" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="96" y="64" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="110" y="64" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="124" y="64" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

          <rect className="enterprise-window" x="68" y="76" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="82" y="76" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="110" y="76" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          <rect className="enterprise-window" x="124" y="76" width="8" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

          {/* Entrance */}
          <line id="enterprise-entrance-overhang" x1="82" y1="90" x2="118" y2="90" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
          <rect id="enterprise-door" x="88" y="92" width="24" height="28" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
          <line id="enterprise-door-line" x1="100" y1="92" x2="100" y2="120" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
        </g>

        {/* ===== PHASE 3: SKYSCRAPER COMPLEX ===== */}
        <g id="skyscraper-complex-group">
          
          {/* --- Left Sub-building (5 floors) --- */}
          <g id="sub-left-group">
            <line id="sub-left-base" x1="18" y1="120" x2="58" y2="120" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
            <line id="sub-left-left-wall" x1="20" y1="120" x2="20" y2="55" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
            <line id="sub-left-right-wall" x1="56" y1="120" x2="56" y2="55" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
            <line id="sub-left-roof" x1="20" y1="55" x2="56" y2="55" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />

            {/* Floor lines */}
            <line className="sub-left-floor" x1="20" y1="68" x2="56" y2="68" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <line className="sub-left-floor" x1="20" y1="81" x2="56" y2="81" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <line className="sub-left-floor" x1="20" y1="94" x2="56" y2="94" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <line className="sub-left-floor" x1="20" y1="107" x2="56" y2="107" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            {/* Windows - 5 rows, 3 per row */}
            <rect className="sub-left-window" x="24" y="58" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="sub-left-window" x="35" y="58" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="sub-left-window" x="46" y="58" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            <rect className="sub-left-window" x="24" y="71" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="sub-left-window" x="35" y="71" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="sub-left-window" x="46" y="71" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            <rect className="sub-left-window" x="24" y="84" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="sub-left-window" x="35" y="84" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="sub-left-window" x="46" y="84" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            <rect className="sub-left-window" x="24" y="97" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="sub-left-window" x="35" y="97" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="sub-left-window" x="46" y="97" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            <rect className="sub-left-window" x="24" y="110" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="sub-left-window" x="46" y="110" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          </g>

          {/* --- Right Sub-building (4 floors) --- */}
          <g id="sub-right-group">
            <line id="sub-right-base" x1="142" y1="120" x2="182" y2="120" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
            <line id="sub-right-left-wall" x1="144" y1="120" x2="144" y2="68" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
            <line id="sub-right-right-wall" x1="180" y1="120" x2="180" y2="68" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
            <line id="sub-right-roof" x1="144" y1="68" x2="180" y2="68" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />

            {/* Floor lines */}
            <line className="sub-right-floor" x1="144" y1="81" x2="180" y2="81" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <line className="sub-right-floor" x1="144" y1="94" x2="180" y2="94" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <line className="sub-right-floor" x1="144" y1="107" x2="180" y2="107" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            {/* Windows - 4 rows, 3 per row */}
            <rect className="sub-right-window" x="148" y="71" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="sub-right-window" x="159" y="71" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="sub-right-window" x="170" y="71" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            <rect className="sub-right-window" x="148" y="84" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="sub-right-window" x="159" y="84" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="sub-right-window" x="170" y="84" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            <rect className="sub-right-window" x="148" y="97" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="sub-right-window" x="159" y="97" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="sub-right-window" x="170" y="97" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            <rect className="sub-right-window" x="148" y="110" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="sub-right-window" x="170" y="110" width="7" height="7" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          </g>

          {/* --- Main Skyscraper (center, 10 floors) --- */}
          <g id="skyscraper-main-group">
            <line id="skyscraper-base" x1="62" y1="120" x2="138" y2="120" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
            <line id="skyscraper-left-wall" x1="65" y1="120" x2="65" y2="10" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
            <line id="skyscraper-right-wall" x1="135" y1="120" x2="135" y2="10" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
            <line id="skyscraper-roof" x1="65" y1="10" x2="135" y2="10" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />

            {/* Crown detail */}
            <line id="skyscraper-crown-left" x1="85" y1="10" x2="85" y2="4" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
            <line id="skyscraper-crown-right" x1="115" y1="10" x2="115" y2="4" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
            <line id="skyscraper-crown-top" x1="85" y1="4" x2="115" y2="4" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />

            {/* Floor lines - 10 floors */}
            <line className="skyscraper-floor" x1="65" y1="21" x2="135" y2="21" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <line className="skyscraper-floor" x1="65" y1="32" x2="135" y2="32" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <line className="skyscraper-floor" x1="65" y1="43" x2="135" y2="43" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <line className="skyscraper-floor" x1="65" y1="54" x2="135" y2="54" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <line className="skyscraper-floor" x1="65" y1="65" x2="135" y2="65" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <line className="skyscraper-floor" x1="65" y1="76" x2="135" y2="76" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <line className="skyscraper-floor" x1="65" y1="87" x2="135" y2="87" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <line className="skyscraper-floor" x1="65" y1="98" x2="135" y2="98" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            {/* Windows - 10 rows, 5 per row */}
            {/* Row 1 (top) */}
            <rect className="skyscraper-window" x="71" y="12" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="84" y="12" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="97" y="12" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="110" y="12" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="123" y="12" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            {/* Row 2 */}
            <rect className="skyscraper-window" x="71" y="23" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="84" y="23" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="97" y="23" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="110" y="23" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="123" y="23" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            {/* Row 3 */}
            <rect className="skyscraper-window" x="71" y="34" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="84" y="34" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="97" y="34" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="110" y="34" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="123" y="34" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            {/* Row 4 */}
            <rect className="skyscraper-window" x="71" y="45" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="84" y="45" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="97" y="45" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="110" y="45" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="123" y="45" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            {/* Row 5 */}
            <rect className="skyscraper-window" x="71" y="56" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="84" y="56" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="97" y="56" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="110" y="56" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="123" y="56" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            {/* Row 6 */}
            <rect className="skyscraper-window" x="71" y="67" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="84" y="67" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="97" y="67" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="110" y="67" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="123" y="67" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            {/* Row 7 */}
            <rect className="skyscraper-window" x="71" y="78" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="84" y="78" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="97" y="78" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="110" y="78" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="123" y="78" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            {/* Row 8 */}
            <rect className="skyscraper-window" x="71" y="89" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="84" y="89" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="110" y="89" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
            <rect className="skyscraper-window" x="123" y="89" width="9" height="6" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />

            {/* Entrance */}
            <line id="skyscraper-entrance-overhang" x1="85" y1="100" x2="115" y2="100" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
            <rect id="skyscraper-door" x="90" y="102" width="20" height="18" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" opacity="0" />
            <line id="skyscraper-door-line" x1="100" y1="102" x2="100" y2="120" stroke={GREEN} strokeWidth={THIN_STROKE} fill="none" opacity="0" />
          </g>
        </g>
      </svg>
    </div>
  );
}