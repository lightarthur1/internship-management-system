import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Hero from '../Components/Hero/Hero'
import PathCard from '../Components/PathCard/PathCard'
import Footer from '../Components/Footer/Footer'
import '../Styles/Landing.css'
import{GraduationCap, Briefcase, Users } from 'lucide-react'

const Landing = () => {
  return (
    <div className='landing'>
      <Navbar />
      <Hero />
      <section className="roles-section">
        <div className="section-container">
          <div className="section-header">
          <h2 className="discovery-main-title">
              Are you ready to discovery?
          </h2>
          <p className="discovery-subtitle">
              Tailored experiences for every user in the internship ecosystem.
          </p>
          </div>

          <div className="path-selection-grid">
              <PathCard icon={<GraduationCap size={40} />} question="Are you a Student?" header="Elevated Career Mastery" paragraph="Automate your logbooks and track your professional evolution through a world-class interface." btntext="Start Your Legacy" />
              <PathCard icon={<Briefcase size={40} />} question="Are you an Employer?" header="Talent Acquisition" paragraph="Discover and recruit top talent with our advanced matching algorithms." btntext="Find Top Talent" />
              <PathCard icon={<Users size={40} />} question="Are you a Mentor?" header="Guidance & Support" paragraph="Provide invaluable mentorship and support to the next generation of professionals." btntext="Become a Mentor" />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Landing