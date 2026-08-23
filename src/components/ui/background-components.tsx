'use client';

import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const Component = ({ className, children, ...props }: BackgroundProps) => {
  const [count, setCount] = useState(0);

  return (
    <div className={cn("min-h-screen w-full relative bg-white", className)} {...props}>
      {/* Soft Yellow Glow */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, #FFF991 0%, transparent 70%)
          `,
          opacity: 0.6,
          mixBlendMode: "multiply",
        }}
      />
      {/* Your Content/Components */}
      <div className="relative z-10 w-full flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};

export const SoftYellowBackground = Component;

export default function DemoOne() {
  return <Component />;
}
