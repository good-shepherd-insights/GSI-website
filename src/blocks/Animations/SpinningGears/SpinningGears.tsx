"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { createTimeline } from "animejs";
import "./SpinningGears.css";

export default function SpinningGears() {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const timelineRef = useRef<any>(null);
    const hasInitializedRef = useRef(false);

    // Brand green color matching BuildingGrowthAnimation
    const GREEN = "#99FF33";
    const STROKE_WIDTH = 1.5;

    // Helper to generate gear path
    const createGearPath = (
        cx: number,
        cy: number,
        outerRadius: number,
        innerRadius: number,
        teeth: number,
        holeRadius: number = 0
    ) => {
        const points: string[] = [];
        const angleStep = (Math.PI * 2) / teeth;

        // Start at angle 0
        for (let i = 0; i < teeth; i++) {
            const theta = i * angleStep;
            const nextTheta = (i + 1) * angleStep;

            // Tooth width (angular)
            const toothWidth = angleStep / 2;
            const halfTooth = toothWidth / 2;

            // 4 points per tooth: 
            // 1. Inner radius start
            // 2. Outer radius start
            // 3. Outer radius end
            // 4. Inner radius end

            // Actually, let's do a simpler trapezoidal tooth
            const t1 = theta;
            const t2 = theta + halfTooth * 0.5; // Slope up
            const t3 = theta + halfTooth * 1.5; // Slope down
            const t4 = nextTheta;

            // Let's refine for a standard gear look
            // Up, Across, Down, Flat
            const p0 = theta;
            const p1 = theta + angleStep * 0.15; // Start of tooth tip
            const p2 = theta + angleStep * 0.35; // End of tooth tip
            const p3 = theta + angleStep * 0.5;  // End of tooth / Start of gap

            // Coordinates
            const c = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];

            // Draw tooth
            if (i === 0) {
                const start = c(innerRadius, p0);
                points.push(`M ${start[0]} ${start[1]}`);
            } else {
                const start = c(innerRadius, p0);
                points.push(`L ${start[0]} ${start[1]}`);
            }

            const tipStart = c(outerRadius, p1);
            points.push(`L ${tipStart[0]} ${tipStart[1]}`);

            const tipEnd = c(outerRadius, p2);
            points.push(`L ${tipEnd[0]} ${tipEnd[1]}`);

            const toothEnd = c(innerRadius, p3);
            points.push(`L ${toothEnd[0]} ${toothEnd[1]}`);
        }

        points.push("Z"); // Close the gear shape

        // Add center hole if needed (drawn as a separate sub-path or circle element, 
        // but here we can just append a move command if we want a compound path, 
        // or easier: render hole as separate circle)
        // We'll render hole separately for easier animation control.

        return points.join(" ");
    };

    // Separate effect for spinning animation (always runs)
    useEffect(() => {
        const spinDuration = 10000; // 10 seconds per revolution for the largest gear

        const spinTimeline = createTimeline({
            loop: true,
            defaults: { ease: "linear" }
        });

        spinTimeline.add("#gear-group-1", {
            rotate: 360,
            duration: spinDuration,
        }, 0);

        spinTimeline.add("#gear-group-2", {
            rotate: -360 * (12 / 9),
            duration: spinDuration,
        }, 0);

        spinTimeline.add("#gear-group-3", {
            rotate: 360 * (12 / 7),
            duration: spinDuration,
        }, 0);

        // Cleanup not strictly necessary for infinite loop in this context but good practice if unmounting
        return () => {
            // animejs doesn't have a simple "kill" on the instance in all versions, but we can pause
            spinTimeline.pause();
        };
    }, []);

    const runAnimation = useCallback(() => {
        if (!svgRef.current || hasInitializedRef.current) return;
        hasInitializedRef.current = true;

        const svg = svgRef.current;

        // Setup stroke-dasharray for drawing animation
        const setupElement = (selector: string) => {
            const el = svg.querySelector(selector) as SVGGeometryElement;
            if (el && el.getTotalLength) {
                const length = el.getTotalLength();
                el.style.strokeDasharray = `${length}`;
                el.style.strokeDashoffset = `${length}`;
            }
        };

        setupElement("#gear-1");
        setupElement("#gear-2");
        setupElement("#gear-3");
        setupElement("#gear-1-hole");
        setupElement("#gear-2-hole");
        setupElement("#gear-3-hole");
        setupElement("#connecting-line-1");
        setupElement("#connecting-line-2");

        const timeline = createTimeline({
            defaults: { ease: "outQuad" },
        });

        // === PHASE 1: Draw the gears ===

        // Draw connecting lines first
        timeline.add(["#connecting-line-1", "#connecting-line-2"], {
            strokeDashoffset: 0,
            duration: 600,
            ease: "easeInOutQuad"
        }, 0);

        // Draw gears
        timeline.add(["#gear-1", "#gear-1-hole"], {
            strokeDashoffset: 0,
            duration: 1500,
            ease: "easeInOutQuad"
        }, 300);

        timeline.add(["#gear-2", "#gear-2-hole"], {
            strokeDashoffset: 0,
            duration: 1200,
            ease: "easeInOutQuad"
        }, 500);

        timeline.add(["#gear-3", "#gear-3-hole"], {
            strokeDashoffset: 0,
            duration: 1000,
            ease: "easeInOutQuad"
        }, 700);

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

    // Gear configurations
    // Center (100, 70)
    const g1 = { cx: 60, cy: 70, r: 35, teeth: 12 };
    const g2 = { cx: 120, cy: 50, r: 25, teeth: 9 }; // Meshed with g1 roughly
    const g3 = { cx: 160, cy: 90, r: 15, teeth: 6 }; // Meshed with g2 roughly

    // Adjust positions to ensure meshing visually
    // Distance between centers should be approx r1 + r2
    // g1(60,70) r=35. g2(120, 50). Dist = sqrt(60^2 + 20^2) = sqrt(3600+400) = 63.2. r1+r2 = 60. Close enough for visual.
    // g2(120,50) r=25. g3(160, 90). Dist = sqrt(40^2 + 40^2) = sqrt(3200) = 56.5. r2+r3 = 40. A bit loose, let's move g3 closer.
    // Let's adjust g3 to (150, 80). Dist = sqrt(30^2 + 30^2) = 42.4. Better.

    return (
        <div
            ref={containerRef}
            className="spinning-gears-animation"
            aria-label="Animation of spinning gears"
            role="img"
        >
            <svg
                ref={svgRef}
                viewBox="0 0 200 140"
                className="spinning-gears-svg"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Connecting lines (schematic style) */}
                <line id="connecting-line-1" x1="60" y1="70" x2="120" y2="50" stroke={GREEN} strokeWidth={0.5} strokeDasharray="4 4" opacity="0.5" />
                <line id="connecting-line-2" x1="120" y1="50" x2="150" y2="80" stroke={GREEN} strokeWidth={0.5} strokeDasharray="4 4" opacity="0.5" />

                {/* Gear 1 Group */}
                <g id="gear-group-1" style={{ transformOrigin: "60px 70px", transformBox: "view-box" }}>
                    <path
                        id="gear-1"
                        d={createGearPath(60, 70, 35, 30, 12)}
                        stroke={GREEN}
                        strokeWidth={STROKE_WIDTH}
                        fill="none"
                    />
                    <circle id="gear-1-hole" cx="60" cy="70" r="10" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" />
                    {/* Axle detail */}
                    <circle cx="60" cy="70" r="3" fill={GREEN} opacity="0.5" />
                </g>

                {/* Gear 2 Group */}
                <g id="gear-group-2" style={{ transformOrigin: "120px 50px", transformBox: "view-box" }}>
                    <path
                        id="gear-2"
                        d={createGearPath(120, 50, 25, 20, 9)}
                        stroke={GREEN}
                        strokeWidth={STROKE_WIDTH}
                        fill="none"
                    />
                    <circle id="gear-2-hole" cx="120" cy="50" r="8" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" />
                    <circle cx="120" cy="50" r="3" fill={GREEN} opacity="0.5" />
                </g>

                {/* Gear 3 Group */}
                <g id="gear-group-3" style={{ transformOrigin: "150px 80px", transformBox: "view-box" }}>
                    <path
                        id="gear-3"
                        d={createGearPath(150, 80, 18, 14, 7)}
                        stroke={GREEN}
                        strokeWidth={STROKE_WIDTH}
                        fill="none"
                    />
                    <circle id="gear-3-hole" cx="150" cy="80" r="5" stroke={GREEN} strokeWidth={STROKE_WIDTH} fill="none" />
                    <circle cx="150" cy="80" r="2" fill={GREEN} opacity="0.5" />
                </g>

            </svg>
        </div>
    );
}
