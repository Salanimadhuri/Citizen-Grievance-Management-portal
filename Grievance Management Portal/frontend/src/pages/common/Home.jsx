import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FileText, Users, Shield, TrendingUp, CheckCircle, Clock, Eye, BarChart3, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import TextType from '../../components/TextType';
import ClickSpark from '../../components/ClickSpark';
import Carousel from '../../components/Carousel';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const redirectMap = {
        citizen: '/citizen/dashboard',
        officer: '/officer/dashboard',
        admin: '/admin/dashboard',
      };
      navigate(redirectMap[user.role] || '/');
    }
  }, [user, navigate]);

  return (
    <ClickSpark
      sparkColor='#1976D2'
      sparkSize={15}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <div className="min-h-screen bg-white/10 relative">
        <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b relative z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <img 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5L43Bm7seuRYi53lm-CSbm0uP81vizDj05Q&s" 
                alt="Grievance Portal Logo" 
                className="h-12 w-auto"
              />
              <h1 className="text-xl font-bold text-primary-700">Citizen Grievance Management Portal</h1>
            </div>
            <div className="flex items-center space-x-6">
              <button className="text-gray-600 hover:text-primary-700 font-medium transition-colors">Home</button>
              <button onClick={() => navigate('/about')} className="text-gray-600 hover:text-primary-700 font-medium transition-colors">About</button>
              <button onClick={() => navigate('/login')} className="btn-secondary">
                Sign In
              </button>
              <button onClick={() => navigate('/register')} className="btn-secondary">
                Register
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50/80 to-blue-50/80 py-20 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl text-gray-900 mb-6 min-h-[200px]">
                  <TextType
                    text={[
                      "Citizen Grievance Management Portal",
                      "Empowering Communities Through Technology",
                      "Report Issues. Track Progress. Improve Cities."
                    ]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor
                    cursorCharacter="_"
                    deletingSpeed={50}
                    variableSpeedEnabled={false}
                    cursorBlinkDuration={0.5}
                  />
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  A modern platform to submit, track, and resolve citizen complaints efficiently. Empowering communities through transparent governance.
                </p>
                <button onClick={() => navigate('/register')} className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                  Submit Complaint <ArrowRight size={20} />
                </button>
              </div>
              <div className="text-center">
                <img 
                  src="https://vidhilegalpolicy.in/wp-content/uploads/2026/01/Screenshot-2026-01-21-at-12.25.36-PM.png" 
                  alt="Grievance Management System"
                  className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-gray-200"
                />
                <p className="text-gray-600 text-lg mt-4">Building Better Communities Together</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white/80 backdrop-blur-sm relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Platform Features</h2>
              <p className="text-xl text-gray-600">Everything you need for effective grievance management</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { 
                  icon: FileText, 
                  title: 'Submit Complaints', 
                  desc: 'Easy complaint submission with location tracking and image uploads' 
                },
                { 
                  icon: Eye, 
                  title: 'Track Progress', 
                  desc: 'Real-time status updates and notifications throughout the process' 
                },
                { 
                  icon: Shield, 
                  title: 'Secure & Transparent', 
                  desc: 'End-to-end encrypted process with complete transparency' 
                },
                { 
                  icon: BarChart3, 
                  title: 'Analytics', 
                  desc: 'Comprehensive insights and analytics for better governance' 
                },
              ].map((feature, index) => (
                <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 hover:scale-105">
                  <div className="bg-primary-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <feature.icon className="text-primary-700" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Carousel Section */}
        <section className="py-20 bg-gray-50/80 backdrop-blur-sm relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            
            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Carousel */}
              <div style={{ height: '600px', position: 'relative' }}>
                <Carousel
                  baseWidth={400}
                  autoplay={false}
                  autoplayDelay={3000}
                  pauseOnHover={false}
                  loop={false}
                  round={false}
                />
              </div>
              
              {/* Right Side - CTA */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-xl border border-gray-200 text-center">
                <h3 className="text-4xl font-bold text-gray-900 mb-6">
                  Ready to Make a Difference?
                </h3>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Join thousands of citizens working together to improve our community through transparent governance and efficient complaint resolution.
                </p>
                <button 
                  onClick={() => navigate('/register')} 
                  className="bg-primary-700 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-primary-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  Get Started Today
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900/90 backdrop-blur-sm text-white py-12 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">🏛️ Grievance Portal</h3>
                <p className="text-gray-400">Empowering citizens through transparent governance and efficient complaint resolution.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><button onClick={() => navigate('/about')} className="hover:text-white">About</button></li>
                  <li><button onClick={() => navigate('/login')} className="hover:text-white">Sign In</button></li>
                  <li><button onClick={() => navigate('/register')} className="hover:text-white">Register</button></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Contact</a></li>
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact Info</h4>
                <p className="text-gray-400">Email: support@grievanceportal.gov</p>
                <p className="text-gray-400">Phone: 1800-XXX-XXXX</p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Citizen Grievance Management Portal. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </ClickSpark>
  );
};

export default Home;
