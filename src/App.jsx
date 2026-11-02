
import { useEffect, useState } from "react";
import "./App.css";

const jobsData = [
  {
    id: 1,
    company: "Slack",
    logo: "S",
    color: "#611f69",
    title: "Senior UI/UX Designer",
    location: "Pune, India",
    type: "Full Time",
    experience: "Senior",
    salary: 85000,
    posted: "2 days ago",
    description:
      "We are looking for a creative UI/UX Designer to create beautiful and user-friendly digital experiences.",
    skills: ["Figma", "UI Design", "Prototyping"],
  },
  {
    id: 2,
    company: "Figma",
    logo: "F",
    color: "#f24e1e",
    title: "Frontend Developer",
    location: "Mumbai, India",
    type: "Full Time",
    experience: "Mid Level",
    salary: 65000,
    posted: "1 day ago",
    description:
      "Join our team to build responsive web applications using modern frontend technologies.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
  },
  {
    id: 3,
    company: "Telegram",
    logo: "T",
    color: "#229ed9",
    title: "React Developer",
    location: "Remote",
    type: "Remote",
    experience: "Fresher",
    salary: 40000,
    posted: "Today",
    description:
      "We need a passionate React Developer who enjoys learning and building interactive websites.",
    skills: ["React", "JavaScript", "CSS"],
  },
  {
    id: 4,
    company: "Google",
    logo: "G",
    color: "#4285f4",
    title: "Web Developer",
    location: "Bengaluru, India",
    type: "Full Time",
    experience: "Mid Level",
    salary: 75000,
    posted: "3 days ago",
    description:
      "Work with a collaborative team to develop accessible, scalable and high-quality web products.",
    skills: ["JavaScript", "React", "Git"],
  },
  {
    id: 5,
    company: "Microsoft",
    logo: "M",
    color: "#0078d4",
    title: "Junior UI Designer",
    location: "Remote",
    type: "Part Time",
    experience: "Fresher",
    salary: 30000,
    posted: "Yesterday",
    description:
      "Help design simple and attractive interfaces while learning from experienced designers.",
    skills: ["Figma", "Wireframes", "UI Design"],
  },
];

function App() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState("All");
  const [experience, setExperience] = useState("All");
  const [jobType, setJobType] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [activeTab, setActiveTab] = useState("All Jobs");
  const [selectedJob, setSelectedJob] = useState(jobsData[0]);
  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jobsearch-saved")) || [];
    } catch {
      return [];
    }
  });
  const [applications, setApplications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jobsearch-applications")) || [];
    } catch {
      return [];
    }
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("jobsearch-saved", JSON.stringify(savedJobs));
  }, [savedJobs]);

  useEffect(() => {
    localStorage.setItem(
      "jobsearch-applications",
      JSON.stringify(applications)
    );
  }, [applications]);

  const filteredJobs = jobsData
    .filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(search.toLowerCase())
        );

      const matchesLocation = job.location
        .toLowerCase()
        .includes(location.toLowerCase());

      const matchesCompany = company === "All" || job.company === company;
      const matchesExperience =
        experience === "All" || job.experience === experience;
      const matchesType = jobType === "All" || job.type === jobType;

      const matchesTab =
        activeTab === "All Jobs" ||
        (activeTab === "Saved Jobs" &&
          savedJobs.some((saved) => saved.id === job.id)) ||
        (activeTab === "My Applications" &&
          applications.some((application) => application.id === job.id));

      return (
        matchesSearch &&
        matchesLocation &&
        matchesCompany &&
        matchesExperience &&
        matchesType &&
        matchesTab
      );
    })
    .sort((a, b) => {
      if (sortBy === "Salary: High to Low") return b.salary - a.salary;
      if (sortBy === "Salary: Low to High") return a.salary - b.salary;
      return a.id - b.id;
    });

  function toggleSaved(job) {
    const isSaved = savedJobs.some((item) => item.id === job.id);

    if (isSaved) {
      setSavedJobs((previous) =>
        previous.filter((item) => item.id !== job.id)
      );
      setMessage("Job removed from saved jobs.");
    } else {
      setSavedJobs((previous) => [...previous, job]);
      setMessage("Job saved successfully!");
    }

    setTimeout(() => setMessage(""), 2500);
  }

  function applyForJob(job) {
    if (applications.some((item) => item.id === job.id)) {
      setMessage("You have already applied for this demo job.");
    } else {
      setApplications((previous) => [...previous, job]);
      setMessage("Demo application submitted successfully!");
    }

    setTimeout(() => setMessage(""), 3000);
  }

  function resetFilters() {
    setSearch("");
    setLocation("");
    setCompany("All");
    setExperience("All");
    setJobType("All");
    setSortBy("Newest");
  }

  return (
    <div className="job-app">
      <header className="navbar">
        <a className="brand" href="#home">
          Job<span>Search</span>
          <small>Find your next opportunity</small>
        </a>

        <nav className="nav-links">
          <button
            className={activeTab === "All Jobs" ? "nav-active" : ""}
            onClick={() => setActiveTab("All Jobs")}
          >
            Find Jobs
          </button>
          <button
            className={activeTab === "Saved Jobs" ? "nav-active" : ""}
            onClick={() => setActiveTab("Saved Jobs")}
          >
            Saved Jobs ({savedJobs.length})
          </button>
          <button
            className={activeTab === "My Applications" ? "nav-active" : ""}
            onClick={() => setActiveTab("My Applications")}
          >
            My Applications ({applications.length})
          </button>
        </nav>

        <a className="profile-circle" href="#jobs" title="Your profile">
          JS
        </a>
      </header>

      <main id="home">
        <section className="hero">
          <span className="hero-label">YOUR CAREER STARTS HERE</span>
          <h1>
            Let’s find your <span>dream job</span>
          </h1>
          <p>
            Discover opportunities that match your skills, interests and
            career goals.
          </p>

          <div className="search-panel">
            <label className="search-field">
              <span>⌕</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title, company or skill"
              />
            </label>

            <label className="search-field">
              <span>⌖</span>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or Remote"
              />
            </label>

            <button
              className="primary-btn"
              onClick={() => document.getElementById("jobs")?.scrollIntoView()}
            >
              Search Jobs
            </button>
          </div>

          <div className="popular-searches">
            <span>Popular:</span>
            {["React", "Designer", "Remote"].map((term) => (
              <button key={term} onClick={() => setSearch(term)}>
                {term}
              </button>
            ))}
          </div>
        </section>

        <section className="jobs-section" id="jobs">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">OPPORTUNITIES FOR YOU</span>
              <h2>
                {activeTab === "All Jobs"
                  ? "Explore Jobs"
                  : activeTab}
              </h2>
              <p>
                {filteredJobs.length} job
                {filteredJobs.length !== 1 ? "s" : ""} found for you
              </p>
            </div>

            <label className="sort-control">
              Sort by
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Newest</option>
                <option>Salary: High to Low</option>
                <option>Salary: Low to High</option>
              </select>
            </label>
          </div>

          <div className="jobs-layout">
            <aside className="filters">
              <div className="filter-heading">
                <h3>Filters</h3>
                <button onClick={resetFilters}>Clear all</button>
              </div>

              <label className="filter-label">
                Company
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                >
                  <option>All</option>
                  {jobsData.map((job) => (
                    <option key={job.company}>{job.company}</option>
                  ))}
                </select>
              </label>

              <label className="filter-label">
                Experience Level
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                >
                  <option>All</option>
                  <option>Fresher</option>
                  <option>Mid Level</option>
                  <option>Senior</option>
                </select>
              </label>

              <label className="filter-label">
                Job Type
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  <option>All</option>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Remote</option>
                </select>
              </label>

              <div className="filter-note">
                <span>✦</span>
                <strong>Career tip</strong>
                <p>
                  Keep your skills updated and tailor your resume for each
                  opportunity.
                </p>
              </div>
            </aside>

            <div className="job-list">
              {filteredJobs.length === 0 ? (
                <div className="empty-state">
                  <span>⌕</span>
                  <h3>No jobs found</h3>
                  <p>Try another keyword or clear your filters.</p>
                  <button className="primary-btn" onClick={resetFilters}>
                    Clear Filters
                  </button>
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const isSaved = savedJobs.some(
                    (item) => item.id === job.id
                  );

                  return (
                    <article
                      className={`job-card ${
                        selectedJob?.id === job.id ? "job-selected" : ""
                      }`}
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div
                        className="company-logo"
                        style={{ backgroundColor: job.color }}
                      >
                        {job.logo}
                      </div>

                      <div className="job-card-content">
                        <div className="job-card-top">
                          <span className="company-name">{job.company}</span>
                          <button
                            className={`save-btn ${isSaved ? "is-saved" : ""}`}
                            title={isSaved ? "Remove saved job" : "Save job"}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaved(job);
                            }}
                          >
                            {isSaved ? "♥" : "♡"}
                          </button>
                        </div>

                        <h3>{job.title}</h3>
                        <p className="job-location">⌖ {job.location}</p>

                        <div className="job-tags">
                          <span>{job.type}</span>
                          <span>{job.experience}</span>
                        </div>

                        <div className="job-card-bottom">
                          <strong>₹{job.salary.toLocaleString("en-IN")}/mo</strong>
                          <span>{job.posted}</span>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            <aside className="job-details">
              {selectedJob ? (
                <>
                  <div className="details-company">
                    <div
                      className="company-logo large-logo"
                      style={{ backgroundColor: selectedJob.color }}
                    >
                      {selectedJob.logo}
                    </div>
                    <div>
                      <h3>{selectedJob.company}</h3>
                      <p>{selectedJob.location}</p>
                    </div>
                  </div>

                  <h2>{selectedJob.title}</h2>
                  <div className="details-tags">
                    <span>{selectedJob.type}</span>
                    <span>{selectedJob.experience}</span>
                  </div>

                  <div className="salary-box">
                    <span>Monthly Salary</span>
                    <strong>
                      ₹{selectedJob.salary.toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div className="details-block">
                    <h4>About this role</h4>
                    <p>{selectedJob.description}</p>
                  </div>

                  <div className="details-block">
                    <h4>Skills required</h4>
                    <div className="skills-list">
                      {selectedJob.skills.map((skill) => (
                        <span key={skill}>{skill}</span>
                      ))}
                    </div>
                  </div>

                  <p className="demo-note">
                    This is a student demo. No real application is sent.
                  </p>

                  <button
                    className="primary-btn apply-btn"
                    onClick={() => applyForJob(selectedJob)}
                  >
                    {applications.some((job) => job.id === selectedJob.id)
                      ? "Applied ✓"
                      : "Apply Now →"}
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() => toggleSaved(selectedJob)}
                  >
                    {savedJobs.some((job) => job.id === selectedJob.id)
                      ? "♥ Saved Job"
                      : "♡ Save Job"}
                  </button>
                </>
              ) : (
                <p>Select a job to see details.</p>
              )}
            </aside>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          Job<span>Search</span>
        </a>
        <p>Your next opportunity starts with one search.</p>
        <small>© 2026 JobSearch. Student demo project.</small>
      </footer>

      {message && <div className="toast">{message}</div>}
    </div>
  );
}

export default App;
