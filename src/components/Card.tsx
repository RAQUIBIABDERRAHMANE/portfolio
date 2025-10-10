import grainImage from "@/assets/images/grain.webp";
import { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export const Card = ({
  className,
  children,
  ...other
}: ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      className={twMerge(
        "bg-cyber-card rounded-3xl relative z-0 overflow-hidden",
        className
      )}
      style={{
        border: '1px solid rgba(0, 255, 249, 0.2)',
        boxShadow: '0 0 20px rgba(0, 255, 249, 0.05)',
      }}
      {...other}
    >
      {/* Animated grid background */}
      <div
        className="absolute inset-0 -z-10 opacity-5"
        style={{
          backgroundImage: `url(${grainImage.src})`,
        }}
      />
      
      {/* Cyber grid overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(0, 255, 249, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 249, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      
      {/* Glowing corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20 opacity-30">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-neon-cyan to-transparent" />
        <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-neon-cyan to-transparent" />
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-20 opacity-30">
        <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-neon-cyan to-transparent" />
        <div className="absolute bottom-0 right-0 w-0.5 h-full bg-gradient-to-t from-neon-cyan to-transparent" />
      </div>
      
      {children}
    </div>
  );
};
