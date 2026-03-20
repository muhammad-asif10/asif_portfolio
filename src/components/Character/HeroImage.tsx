import { useEffect } from "react";
import { useLoading } from "../../context/LoadingProvider";
// Ensure we use the styles that position the character
import "../styles/Landing.css";

const HeroImage = () => {
  const { setLoading } = useLoading();

  useEffect(() => {
    // Simulate loading progress to ensure the loader finishes
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20; // Fast loading
      setLoading(progress);
      if (progress >= 100) clearInterval(interval);
    }, 100);
    
    return () => clearInterval(interval);
  }, [setLoading]);

  return (
    <div className="character-container">
      <div className="character-model">
        <img 
          src="/images/me.png" 
          alt="Muhammad Asif" 
          className="hero-image"
          onError={() => {
            // If image fails to load, maybe show nothing or a placeholder
            // For now, we'll just hide it so it doesn't look broken
            // e.currentTarget.style.display = 'none';
            // Or better, set a fallback if available
            console.warn("User image 'me.png' not found in public/images/");
          }}
        />
        {/* Keep the rim for effect if desired, or remove it */}
        <div className="character-rim"></div>
      </div>
    </div>
  );
};

export default HeroImage;
