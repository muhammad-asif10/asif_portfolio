import { useEffect, MouseEvent } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap-trial/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = ({ onNavigate }: { onNavigate?: (section: string) => void }) => {
  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    window.addEventListener("resize", () => {
      ScrollSmoother.refresh(true);
    });
  }, []);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, section: string) => {
    e.preventDefault();
    // Default scroll behavior if no onNavigate (or onNavigate assumes routing)
    if (onNavigate) {
      if (section === "#work") {
        onNavigate("projects");
      } else if (section === "/#") {
        onNavigate("home");
        // Scroll to top
        smoother.scrollTo(0, true, "top top");
      } else {
        onNavigate("home");
        // Wait for render
        setTimeout(() => {
          smoother.scrollTo(section, true, "top top");
        }, 100);
      }
    } else {
       if (section === "/#") smoother.scrollTo(0, true, "top top");
       else smoother.scrollTo(section, true, "top top");
    }
  };

  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable" onClick={(e) => handleNavClick(e, "/#")}>
          MA
        </a>
        <a
          href="mailto:muhammadasifkha01@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          muhammadasifkha01@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about" onClick={(e) => handleNavClick(e, "#about")}>
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work" onClick={(e) => handleNavClick(e, "#work")}>
              <HoverLinks text="PROJECTS" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact" onClick={(e) => handleNavClick(e, "#contact")}>
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
