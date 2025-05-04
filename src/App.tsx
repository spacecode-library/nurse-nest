
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Gallery from "./pages/Gallery";
import Apartments from "./pages/Apartments";
import Apply from "./pages/Apply";
import About from "./pages/About";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/apartments" element={<Apartments />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/about" element={<About />} />
        
        {/* Add all other routes above the catch-all 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
