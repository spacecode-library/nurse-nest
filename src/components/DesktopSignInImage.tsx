
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OptimizedBackground } from "@/components/ui/optimized-background";
import { ArrowLeft } from "lucide-react";

const DesktopSignInImage = () => (
  <div className="hidden lg:flex lg:w-1/2 relative">
    <OptimizedBackground
      src="/lovable-uploads/f3390946-3574-4e5c-8994-49d192f98a10.png"
      alt="Modern architectural interior"
      className="w-full h-screen"
      priority={true}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      {/* Return to Home Button - Desktop */}
      <div className="absolute top-8 left-8 z-10">
        <Link to="/">
          <div className="relative group">
            <div className="absolute -inset-2 bg-white/50 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <Button
              variant="ghost"
              className="relative bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 hover:text-white transition-all duration-300 rounded-xl px-6 py-3 shadow-lg"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Home
            </Button>
          </div>
        </Link>
      </div>
    </OptimizedBackground>
  </div>
);

export default DesktopSignInImage;
