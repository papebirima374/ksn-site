"use client";

import { useState } from "react";
import { fmtNumber } from "@/lib/challenge";

type DataPoint = {
  month: string;
  value: number; // in millions
  isProjected?: boolean;
};

const DATA: DataPoint[] = [
  { month: "Jan", value: 250 },
  { month: "Fév", value: 278 },
  { month: "Mar", value: 306 },
  { month: "Avr", value: 334 },
  { month: "Mai", value: 362 },
  { month: "Jui", value: 390, isProjected: true },
  { month: "Jul", value: 418, isProjected: true },
  { month: "Aoû", value: 446, isProjected: true },
  { month: "Sep", value: 474, isProjected: true },
  { month: "Oct", value: 502, isProjected: true },
  { month: "Nov", value: 530, isProjected: true },
  { month: "Déc", value: 558, isProjected: true },
];

export default function ChallengeProgression() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG Chart Dimensions
  const width = 800;
  const height = 300;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = 600; // max value of scale in Millions
  const minVal = 200;

  // Coordinate helpers
  const getX = (index: number) => {
    return paddingLeft + (index / (DATA.length - 1)) * chartWidth;
  };

  const getY = (value: number) => {
    const scale = (value - minVal) / (maxVal - minVal);
    return paddingTop + chartHeight - scale * chartHeight;
  };

  // Generate Path for Realized Data
  const realizedPoints = DATA.filter((d) => !d.isProjected);
  const projectedPoints = DATA.filter((d, i) => d.isProjected || (i > 0 && DATA[i - 1] && !DATA[i - 1].isProjected));

  const makePathString = (points: DataPoint[]) => {
    return points
      .map((d, i) => {
        const idx = DATA.indexOf(d);
        const prefix = i === 0 ? "M" : "L";
        return `${prefix} ${getX(idx).toFixed(1)} ${getY(d.value).toFixed(1)}`;
      })
      .join(" ");
  };

  const realizedPath = makePathString(realizedPoints);
  const projectedPath = makePathString(DATA); // line for whole trend, we can style it dashed later or draw separately

  // For Area under the path (realized)
  const realizedAreaPath = realizedPoints.length > 0 
    ? `${realizedPath} L ${getX(DATA.indexOf(realizedPoints[realizedPoints.length - 1])).toFixed(1)} ${getY(minVal).toFixed(1)} L ${getX(DATA.indexOf(realizedPoints[0])).toFixed(1)} ${getY(minVal).toFixed(1)} Z`
    : "";

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
      <div className="bg-white rounded-[28px] sm:rounded-[45px] shadow-[0_20px_80px_rgba(0,0,0,0.08)] p-6 sm:p-12 md:p-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="uppercase tracking-[0.25em] text-[#B8860B] font-semibold text-xs sm:text-sm">
              Tendances & Prévisions 2026
            </span>
            <h2 className="font-display mt-3 text-3xl sm:text-4xl font-bold text-[#0F7C55]">
              Progression Mensuelle
            </h2>
            <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-xl">
              Suivi de la progression cumulée vers l&apos;objectif spirituel du milliard. La ligne pointillée représente les projections basées sur le rythme actuel.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <span className="w-3.5 h-3.5 rounded-sm bg-gradient-to-r from-[#0F7C55] to-[#B8860B]" />
              Réalisé
            </span>
            <span className="flex items-center gap-1.5 text-gray-500">
              <span className="w-3.5 h-1 border-t-2 border-dashed border-[#B8860B]" />
              Projeté
            </span>
          </div>
        </div>

        {/* SVG Wrapper */}
        <div className="relative overflow-x-auto">
          <div className="min-w-[700px] w-full">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="w-full h-auto overflow-visible select-none"
            >
              {/* Gradients */}
              <defs>
                <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F7C55" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0F7C55" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0F7C55" />
                  <stop offset="50%" stopColor="#0F7C55" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
              </defs>

              {/* Grid Lines (Horizontal) */}
              {[200, 300, 400, 500, 600].map((v) => (
                <g key={v}>
                  <line
                    x1={paddingLeft}
                    y1={getY(v)}
                    x2={width - paddingRight}
                    y2={getY(v)}
                    stroke="#E2E8F0"
                    strokeWidth={1}
                    strokeDasharray={v === 200 ? "0" : "4 4"}
                  />
                  <text
                    x={paddingLeft - 10}
                    y={getY(v) + 4}
                    textAnchor="end"
                    className="text-[11px] font-bold fill-gray-400 tabular-nums"
                  >
                    {v} M
                  </text>
                </g>
              ))}

              {/* Grid Lines (Vertical Month markers) */}
              {DATA.map((d, i) => (
                <g key={d.month}>
                  <line
                    x1={getX(i)}
                    y1={paddingTop}
                    x2={getX(i)}
                    y2={height - paddingBottom}
                    stroke="#F1F5F9"
                    strokeWidth={1}
                  />
                  <text
                    x={getX(i)}
                    y={height - paddingBottom + 20}
                    textAnchor="middle"
                    className={`text-[11px] font-bold ${
                      d.isProjected ? "fill-gray-400 font-medium" : "fill-[#0F7C55]"
                    }`}
                  >
                    {d.month}
                  </text>
                </g>
              ))}

              {/* Area Fill */}
              {realizedAreaPath && (
                <path d={realizedAreaPath} fill="url(#area-grad)" />
              )}

              {/* Base Line */}
              <line
                x1={paddingLeft}
                y1={height - paddingBottom}
                x2={width - paddingRight}
                y2={height - paddingBottom}
                stroke="#CBD5E1"
                strokeWidth={1.5}
              />

              {/* Realized Trend Line */}
              {realizedPath && (
                <path
                  d={realizedPath}
                  fill="none"
                  stroke="url(#line-grad)"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              )}

              {/* Projected Trend Line */}
              {projectedPath && (
                <path
                  d={projectedPath}
                  fill="none"
                  stroke="#B8860B"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeDasharray="6 6"
                />
              )}

              {/* Interactive Circles */}
              {DATA.map((d, i) => {
                const cx = getX(i);
                const cy = getY(d.value);
                const isHovered = hoveredIdx === i;

                return (
                  <g
                    key={d.month}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  >
                    {/* Larger transparent hover capture circle */}
                    <circle cx={cx} cy={cy} r={20} fill="transparent" />

                    {/* Outer glowing circle on hover */}
                    {isHovered && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={10}
                        fill={d.isProjected ? "#B8860B" : "#0F7C55"}
                        opacity={0.3}
                        className="animate-pulse"
                      />
                    )}

                    {/* Main point circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 6 : 4}
                      fill={d.isProjected ? "#FFFFFF" : "#0F7C55"}
                      stroke={d.isProjected ? "#B8860B" : "#D4AF37"}
                      strokeWidth={2.5}
                      className="transition-all duration-200"
                    />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Tooltip detail block below or overlay */}
        <div className="mt-8 bg-[#F8F5EF] border border-[#E9E3D5] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl">📈</span>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                {hoveredIdx !== null ? `Mois de ${DATA[hoveredIdx].month === 'Jan' ? 'Janvier' : DATA[hoveredIdx].month === 'Fév' ? 'Février' : DATA[hoveredIdx].month === 'Mar' ? 'Mars' : DATA[hoveredIdx].month === 'Avr' ? 'Avril' : DATA[hoveredIdx].month === 'Mai' ? 'Mai' : DATA[hoveredIdx].month === 'Jui' ? 'Juin' : DATA[hoveredIdx].month === 'Jul' ? 'Juillet' : DATA[hoveredIdx].month === 'Aoû' ? 'Août' : DATA[hoveredIdx].month === 'Sep' ? 'Septembre' : DATA[hoveredIdx].month === 'Oct' ? 'Octobre' : DATA[hoveredIdx].month === 'Nov' ? 'Novembre' : 'Décembre'}` : "Sélectionner un mois"}
              </p>
              <h4 className="font-display text-lg sm:text-xl font-bold text-[#0F7C55]">
                {hoveredIdx !== null 
                  ? `${fmtNumber(DATA[hoveredIdx].value * 1_000_000)} Salaatus`
                  : "Survolez les points pour voir les détails"}
              </h4>
            </div>
          </div>
          {hoveredIdx !== null && (
            <div className="flex gap-4">
              <div className="bg-white/80 backdrop-blur-sm border border-[#E9E3D5] px-4 py-2 rounded-xl text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Progression</span>
                <span className="font-display text-base font-bold text-[#0F7C55]">
                  {((DATA[hoveredIdx].value * 1_000_000) / 1_000_000_000 * 100).toFixed(1)} %
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-[#E9E3D5] px-4 py-2 rounded-xl text-center">
                <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Statut</span>
                <span className={`font-display text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                  DATA[hoveredIdx].isProjected 
                    ? "bg-[#B8860B]/10 text-[#B8860B]" 
                    : "bg-emerald-100 text-emerald-800"
                }`}>
                  {DATA[hoveredIdx].isProjected ? "Projeté" : "Réalisé"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
