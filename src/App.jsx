
import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Projects from "./components/Projects";
import Strengths from "./components/Strengths";
import Contact from "./components/Contact";
import GlobalBackground from "./components/GlobalBackground";
import LoadingScreen from "./components/LoadingScreen";

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <LoadingScreen onComplete={() => setLoading(false)} />}
      <GlobalBackground />
      <Navbar />
      <main style={{ position: "relative", zIndex: 1 }}>
        <Hero />
        <Marquee />
        <About />
        <Projects />
        <Strengths />
        <Contact />
      </main>
    </>
  );
}
