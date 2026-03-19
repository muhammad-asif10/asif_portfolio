import { lazy, PropsWithChildren, Suspense, useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar, { smoother } from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import setSplitText from "./utils/splitText";

const TechStack = lazy(() => import("./TechStack"));
const Work = lazy(() => import("./Work")); // Lazy load Work

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );
  const [view, setView] = useState<"home" | "projects">("home");

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

  // Refresh ScrollSmoother when view changes
  useEffect(() => {
    if (smoother) {
        ScrollTrigger.refresh();
        smoother.scrollTop(0); // Scroll to top on view change
    }
    // Re-initialize split text animations when view changes (e.g. back to home)
    setTimeout(() => setSplitText(), 100); 
  }, [view]);

  const handleNavigate = (section: string) => {
      if (section === "projects") setView("projects");
      else setView("home");
  };

  return (
    <div className="container-main">
      <Cursor />
      <Navbar onNavigate={handleNavigate} />
      <SocialIcons />
      {/* 
         If on home view, show hero children (3D Character).
         If on projects view, hide or unmount? 
         If we unmount CharacterModel (passed as children), it might re-load heavily.
         Let's keep it mounted but hidden if needed, or just unmount for performance.
         "Optimize load" suggests we prioritize memory/cpu.
         But let's hide via CSS or conditional rendering.
         If view is projects, we render Work.
      */}
      {view === "home" && isDesktopView && children}
      
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            {view === "home" ? (
                <>
                <Landing>{!isDesktopView && children}</Landing>
                <About />
                <WhatIDo />
                <Career />
                {/* Work removed from here */}
                {isDesktopView && (
                  <Suspense fallback={<div>Loading Skills...</div>}>
                    <TechStack />
                  </Suspense>
                )}
                <Contact />
                </>
            ) : (
                <div style={{ minHeight: "100vh", paddingTop: "100px" }}>
                    <Suspense fallback={<div>Loading Projects...</div>}>
                        <Work />
                    </Suspense>
                    <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
                        <button 
                            onClick={() => setView("home")}
                            style={{ 
                                padding: "10px 20px", 
                                fontSize: "1.2rem", 
                                background: "var(--accentColor)", 
                                border: "none", 
                                color: "var(--backgroundColor)", 
                                cursor: "pointer" 
                            }}
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
