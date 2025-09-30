// Lombok logo loader with blue gradient glowing animation
import React from "react";
import { LombokLoaderProps } from "../types";

const LombokLoader: React.FC<LombokLoaderProps> = ({
  progress = 0,
  currentTask = "Cargando...",
  error = null,
}) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center z-50">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main loader container */}
      <div className="relative flex flex-col items-center space-y-8 z-10">
        {/* Logo container with glowing animation */}
        <div className="relative">
          {/* Outer glow rings */}
          <div className="absolute inset-0 -m-8">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 animate-ping" />
          </div>
          <div className="absolute inset-0 -m-6">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400/30 via-cyan-400/30 to-blue-400/30 animate-pulse" />
          </div>
          <div className="absolute inset-0 -m-4">
            <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-300/40 via-cyan-300/40 to-blue-300/40 animate-bounce" />
          </div>

          {/* Logo with rotating glow */}
          <div className="relative">
            {/* Rotating glow effect */}
            <div className="absolute inset-0 -m-2">
              <div
                className="w-full h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full blur-xl opacity-75 animate-spin"
                style={{ animationDuration: "3s" }}
              />
            </div>

            {/* Logo container */}
            <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
              <img
                src="/assets/lombok-full-row.png"
                alt="Lombok"
                className="w-56 h-auto filter brightness-110 contrast-110"
                style={{
                  filter:
                    "drop-shadow(0 0 20px rgba(59, 130, 246, 0.6)) brightness(1.1) contrast(1.1)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Progress section */}
        <div className="flex flex-col items-center space-y-4 min-h-[80px]">
          {error ? (
            /* Error state */
            <div className="text-center">
              <div className="text-red-400 text-lg font-semibold mb-2">
                Error al cargar datos
              </div>
              <div className="text-red-300 text-sm">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Reintentar
              </button>
            </div>
          ) : (
            /* Loading state */
            <>
              {/* Progress bar */}
              <div className="w-80 bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 transition-all duration-500 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                </div>
              </div>

              {/* Progress text */}
              <div className="text-center">
                <div className="text-white text-lg font-semibold mb-1">
                  {Math.round(progress)}%
                </div>
                <div className="text-blue-200 text-sm animate-pulse">
                  {currentTask}
                </div>
              </div>

              {/* Loading dots animation */}
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: "1s",
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Subtitle */}
        <div className="text-center">
          <div className="text-blue-200 text-sm font-medium">
            Preparando tu próxima aventura épica
          </div>
        </div>
      </div>

      {/* Additional animated elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-2 text-blue-300/60 text-xs">
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
          <span>Lombok</span>
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
        </div>
      </div>

      {/* CSS for additional animations */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.8);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LombokLoader;
