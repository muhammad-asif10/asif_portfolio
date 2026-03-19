import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          <span>Education</span>
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>ICS Physics</h4>
                <h5>Model Science College</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>BS Computer Science</h4>
                <h5>University of Veterinary & Animal Sciences (UVAS), Lahore</h5>
              </div>
              <h3>2024-2028</h3>
            </div>
            <p>
             Specializing in Data Science & AI & Machine Learing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
