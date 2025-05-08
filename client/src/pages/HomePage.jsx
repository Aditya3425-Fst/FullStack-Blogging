import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [activeTab, setActiveTab] = useState('tech');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Testimonials data
  const testimonials = [
    {
      quote: "This platform completely transformed how I share my travel experiences with my audience. Easy to use and beautiful design!",
      author: "Sarah Johnson",
      role: "Travel Blogger",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      location: "New York, USA"
    },
    {
      quote: "The analytics features helped me understand my audience better. My tech blog has grown 3x since I started using this platform.",
      author: "Alex Chen",
      role: "Tech Blogger",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      location: "San Francisco, USA"
    },
    {
      quote: "The customization options are exactly what I needed for my cooking blog. The recipe layouts are perfect!",
      author: "Maria Rodriguez",
      role: "Food Blogger",
      image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      location: "Barcelona, Spain"
    },
    {
      quote: "Since switching to this platform, my lifestyle blog has seen a 45% increase in reader engagement. The clean design really showcases my content.",
      author: "James Wilson",
      role: "Lifestyle Blogger",
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      location: "London, UK"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Add scroll reveal effect
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight * 0.85) {
          element.classList.add('revealed');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on mount to reveal elements already in view
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="pre-title">The Blogging Platform</span>
          <h1>Publish your passions, <span className="highlight">your way</span></h1>
          <p>Create a unique and beautiful blog easily. Join thousands of content creators sharing their stories.</p>
          <div className="hero-buttons">
            <Link to="/create-blog" className="cta-button primary-button">
              Create your blog
              <span className="button-arrow">→</span>
            </Link>
            <Link to="/blogs" className="cta-button secondary-button">
              Explore blogs
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Active Bloggers</span>
            </div>
            <div className="stat">
              <span className="stat-number">50k+</span>
              <span className="stat-label">Articles</span>
            </div>
            <div className="stat">
              <span className="stat-number">120+</span>
              <span className="stat-label">Countries</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="blog-examples">
            <div className="blog-example family">
              <span className="blog-label">Family Blog</span>
            </div>
            <div className="blog-example tech">
              <span className="blog-label">Tech Blog</span>
            </div>
            <div className="blog-example cooking">
              <span className="blog-label">Cooking Blog</span>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="mouse"></div>
          <p>Scroll to explore</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header reveal-on-scroll">
          <span className="section-subtitle">Features You'll Love</span>
          <h2>Everything you need to create amazing blogs</h2>
          <div className="section-divider"></div>
        </div>
        
        <div className="features-container">
          <div className="feature reveal-on-scroll">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2>Choose the perfect design</h2>
            <p>Create a beautiful blog that fits your style. Choose from a selection of easy-to-use templates with flexible layouts.</p>
            <span className="feature-number">01</span>
          </div>

          <div className="feature reveal-on-scroll">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2>Get a domain</h2>
            <p>Give your blog the perfect home. Get a custom domain with just a few clicks to make your blog stand out.</p>
            <span className="feature-number">02</span>
          </div>

          <div className="feature reveal-on-scroll">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <h2>Know your audience</h2>
            <p>Find out which posts are a hit with built-in analytics. See where your audience is coming from and what they're interested in.</p>
            <span className="feature-number">03</span>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-header reveal-on-scroll">
          <span className="section-subtitle">Explore Categories</span>
          <h2>Share your story, <span className="highlight">your way</span></h2>
          <p>Join thousands of bloggers in sharing your passions with the world</p>
        </div>
        
        <div className="category-tabs">
          <button 
            className={`tab-button ${activeTab === 'tech' ? 'active' : ''}`} 
            onClick={() => setActiveTab('tech')}
          >
            Technology
          </button>
          <button 
            className={`tab-button ${activeTab === 'travel' ? 'active' : ''}`} 
            onClick={() => setActiveTab('travel')}
          >
            Travel
          </button>
          <button 
            className={`tab-button ${activeTab === 'food' ? 'active' : ''}`} 
            onClick={() => setActiveTab('food')}
          >
            Food & Cooking
          </button>
          <button 
            className={`tab-button ${activeTab === 'lifestyle' ? 'active' : ''}`} 
            onClick={() => setActiveTab('lifestyle')}
          >
            Lifestyle
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'tech' && (
            <div className="tab-panel">
              <div className="panel-image tech-image">
                <div className="tech-image-content">
                  <div className="tech-badges">
                    <span className="tech-badge">React</span>
                    <span className="tech-badge">JavaScript</span>
                    <span className="tech-badge">Node.js</span>
                    <span className="tech-badge">Python</span>
                  </div>
                  <div className="code-preview">
                    <code>
                      <span style={{color: '#9cdcfe'}}>const</span> <span style={{color: '#dcdcaa'}}>createBlog</span> = <span style={{color: '#569cd6'}}>async</span> () =&gt; {'{'}<br/>
                      &nbsp;&nbsp;<span style={{color: '#9cdcfe'}}>const</span> response = <span style={{color: '#569cd6'}}>await</span> api.post(<span style={{color: '#ce9178'}}>&apos;/blogs/new&apos;</span>);<br/>
                      &nbsp;&nbsp;<span style={{color: '#c586c0'}}>return</span> response.data;<br/>
                      {'}'};
                    </code>
                  </div>
                </div>
              </div>
              <div className="panel-content">
                <h3>Technology Blogs</h3>
                <p>Share your insights on the latest gadgets, programming techniques, tech news, and digital innovations. Connect with a global audience passionate about technology.</p>
                <ul className="feature-list">
                  <li>Code snippet embedding</li>
                  <li>Technical documentation formatting</li>
                  <li>Integration with GitHub</li>
                </ul>
                <Link to="/tech-blogs" className="category-link">Explore Technology Blogs <span className="arrow">→</span></Link>
              </div>
            </div>
          )}
          
          {activeTab === 'travel' && (
            <div className="tab-panel">
              <div className="panel-image travel-image">
                <div className="travel-image-content">
                  <div className="travel-badges">
                    <span className="travel-badge">Europe</span>
                    <span className="travel-badge">Asia</span>
                    <span className="travel-badge">Africa</span>
                    <span className="travel-badge">Americas</span>
                  </div>
                  <div className="location-preview">
                    <svg xmlns="http://www.w3.org/2000/svg" className="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <div>
                      <div style={{fontWeight: '600', marginBottom: '0.2rem'}}>Santorini, Greece</div>
                      <div style={{fontSize: '0.8rem', opacity: '0.8'}}>Share your journey with interactive maps</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="panel-content">
                <h3>Travel Blogs</h3>
                <p>Document your adventures around the world. Share travel tips, destination guides, stunning photography, and personal journeys from across the globe.</p>
                <ul className="feature-list">
                  <li>Map integration</li>
                  <li>Photo galleries</li>
                  <li>Trip itinerary templates</li>
                </ul>
                <Link to="/blogs?category=travel" className="category-link">Explore Travel Blogs <span className="arrow">→</span></Link>
              </div>
            </div>
          )}
          
          {activeTab === 'food' && (
            <div className="tab-panel">
              <div className="panel-image food-image">
                <div className="food-image-content">
                  <div className="food-badges">
                    <span className="food-badge">Italian</span>
                    <span className="food-badge">Indian</span>
                    <span className="food-badge">Mexican</span>
                    <span className="food-badge">Baking</span>
                  </div>
                  <div className="recipe-preview">
                    <div style={{fontWeight: '600', marginBottom: '0.5rem', fontSize: '1.1rem'}}>Pasta Primavera</div>
                    <div className="recipe-grid">
                      <div className="recipe-label">Prep Time:</div>
                      <div>15 minutes</div>
                      <div className="recipe-label">Cook Time:</div>
                      <div>20 minutes</div>
                      <div className="recipe-label">Servings:</div>
                      <div>4</div>
                      <div className="recipe-label">Rating:</div>
                      <div>★★★★★ (4.8)</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="panel-content">
                <h3>Food & Cooking Blogs</h3>
                <p>Share your culinary creations, recipes, cooking techniques, and food photography. Connect with food lovers and inspire others with your gastronomic adventures.</p>
                <ul className="feature-list">
                  <li>Recipe card formats</li>
                  <li>Cooking time calculators</li>
                  <li>Ingredient organizers</li>
                </ul>
                <Link to="/blogs?category=food" className="category-link">Explore Food Blogs <span className="arrow">→</span></Link>
              </div>
            </div>
          )}
          
          {activeTab === 'lifestyle' && (
            <div className="tab-panel">
              <div className="panel-image lifestyle-image">
                <div className="lifestyle-image-content">
                  <div className="lifestyle-badges">
                    <span className="lifestyle-badge">Wellness</span>
                    <span className="lifestyle-badge">Fashion</span>
                    <span className="lifestyle-badge">Home</span>
                    <span className="lifestyle-badge">Mindfulness</span>
                  </div>
                  <div className="wellness-preview">
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: '600', marginBottom: '0.5rem', fontSize: '1.1rem'}}>Your Wellness Journey</div>
                      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem'}}>
                        <div style={{height: '12px', width: '35%', backgroundColor: 'rgba(156, 39, 176, 0.8)', borderRadius: '10px'}}></div>
                        <div style={{fontSize: '0.8rem', opacity: '0.8'}}>Sleep</div>
                      </div>
                      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '0.5rem'}}>
                        <div style={{height: '12px', width: '60%', backgroundColor: 'rgba(156, 39, 176, 0.6)', borderRadius: '10px'}}></div>
                        <div style={{fontSize: '0.8rem', opacity: '0.8'}}>Exercise</div>
                      </div>
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <div style={{height: '12px', width: '45%', backgroundColor: 'rgba(156, 39, 176, 0.4)', borderRadius: '10px'}}></div>
                        <div style={{fontSize: '0.8rem', opacity: '0.8'}}>Meditation</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="panel-content">
                <h3>Lifestyle Blogs</h3>
                <p>Write about your experiences, personal growth, wellness journey, fashion, home decor, and everyday life. Share your perspective and inspire others.</p>
                <ul className="feature-list">
                  <li>Mood board layouts</li>
                  <li>Journal templates</li>
                  <li>Personal milestone tracking</li>
                </ul>
                <Link to="/blogs?category=lifestyle" className="category-link">Explore Lifestyle Blogs <span className="arrow">→</span></Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section reveal-on-scroll">
        <div className="section-header">
          <span className="section-subtitle">What Bloggers Say</span>
          <h2>From our community</h2>
          <div className="section-divider"></div>
        </div>
        
        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="quote-mark">"</div>
            <p className="testimonial-quote">{testimonials[currentTestimonial].quote}</p>
            <div className="testimonial-author">
              <img src={testimonials[currentTestimonial].image} alt={testimonials[currentTestimonial].author} className="author-image" />
              <div className="author-info">
                <h4>{testimonials[currentTestimonial].author}</h4>
                <p>{testimonials[currentTestimonial].role}</p>
                <span className="author-location">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {testimonials[currentTestimonial].location}
                </span>
              </div>
            </div>
          </div>
          
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button 
                key={index} 
                className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="join-section">
        <div className="join-content reveal-on-scroll">
          <h2>Ready to start your blogging journey?</h2>
          <p>Whether sharing your expertise, breaking news, or whatever's on your mind, you're in good company on MyBlog.</p>
          <Link to="/create-blog" className="cta-button primary-button reveal-on-scroll">
            Create your blog
            <span className="button-arrow">→</span>
          </Link>
          
          <div className="join-features">
            <div className="join-feature">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Free to start</span>
            </div>
            <div className="join-feature">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Easy setup</span>
            </div>
            <div className="join-feature">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage; 