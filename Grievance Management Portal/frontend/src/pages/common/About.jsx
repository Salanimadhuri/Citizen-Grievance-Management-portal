import { useNavigate } from 'react-router-dom';
import { CheckCircle, Users, Shield, TrendingUp, Clock, Eye, Target } from 'lucide-react';
import ClickSpark from '../../components/ClickSpark';
import TiltedCard from '../../components/TiltedCard';
import Stepper, { Step } from '../../components/Stepper';

const About = () => {
  const navigate = useNavigate();

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
              <button onClick={() => navigate('/')} className="text-gray-600 hover:text-primary-700 font-medium transition-colors">Home</button>
              <button className="text-primary-700 font-medium">About</button>
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
      <section className="bg-gradient-to-br from-primary-50/80 to-primary-100/80 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">About Our Platform</h1>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                The Citizen Grievance Management Portal is designed to bridge the gap between citizens and government authorities. 
                Our platform empowers citizens to report civic problems efficiently while helping authorities resolve them in a 
                transparent and timely manner.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We believe in creating a more responsive government that listens to its citizens and takes swift action to 
                improve community living standards through technology-driven solutions.
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 p-3 rounded-lg">
                  <Target className="text-primary-700" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Transparent Governance</h3>
                  <p className="text-gray-600">Building trust through open communication</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-blue-100 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🏛️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Serving Citizens Since 2024</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary-700">1000+</div>
                  <div className="text-gray-600">Complaints Resolved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-700">500+</div>
                  <div className="text-gray-600">Active Citizens</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Platform Works */}
      <section className="py-20 bg-gray-50/80 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How the Platform Works</h2>
            <p className="text-xl text-gray-600">Understanding the complete complaint lifecycle</p>
          </div>
          
          <Stepper
            initialStep={1}
            onStepChange={(step) => {
              console.log(step);
            }}
            onFinalStepCompleted={() => console.log("All steps completed!")}
            backButtonText="Previous"
            nextButtonText="Next"
          >
            <Step>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Citizen Registration & Complaint Submission</h2>
              <p className="text-lg text-gray-600">
                Citizens register on the platform and submit complaints with detailed descriptions, location information, and supporting images.
              </p>
            </Step>

            <Step>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Automatic Assignment & Review</h2>
              <p className="text-lg text-gray-600">
                The system automatically assigns complaints to relevant departments based on category and location. Authorities review and prioritize issues.
              </p>
            </Step>

            <Step>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Officer Assignment & Action</h2>
              <p className="text-lg text-gray-600">
                Department officers are assigned complaints and begin resolution work while citizens receive real-time progress updates.
              </p>
            </Step>

            <Step>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Resolution & Feedback</h2>
              <p className="text-lg text-gray-600">
                Once the issue is resolved, citizens are notified and can provide feedback on the resolution quality.
              </p>
            </Step>
          </Stepper>
        </div>
      </section>

      {/* Real Impact Stories */}
      <section className="py-20 bg-white/80 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Real Impact Stories</h2>
            <p className="text-xl text-gray-600">See how our platform transforms communities</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 justify-items-center">
            <TiltedCard
              imageSrc="https://www.shutterstock.com/image-photo/large-pothole-sits-on-road-600nw-2711964027.jpg"
              altText="Before - Road Damage"
              captionText="Before – Road Damage Reported"
              containerHeight="300px"
              containerWidth="300px"
              imageHeight="300px"
              imageWidth="300px"
              rotateAmplitude={12}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip
              displayOverlayContent
              overlayContent={
                <p className="tilted-card-demo-text text-lg font-medium">
                  Citizen reported a dangerous pothole through the platform.
                </p>
              }
            />

            <TiltedCard
              imageSrc="https://media.istockphoto.com/id/1304206415/photo/worker-pushing-bitumen-asphalt-in-the-hole-road-repair-and-maintenance.jpg?s=612x612&w=0&k=20&c=hbgoterju4oHiD2pEAoDySPDFhl9mvTNjwTltT78CKI="
              altText="After - Road Repaired"
              captionText="After – Road Successfully Repaired"
              containerHeight="300px"
              containerWidth="300px"
              imageHeight="300px"
              imageWidth="300px"
              rotateAmplitude={12}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip
              displayOverlayContent
              overlayContent={
                <p className="tilted-card-demo-text text-lg font-medium">
                  Authorities repaired the road after the complaint was assigned and resolved.
                </p>
              }
            />
          </div>

          <div className="text-center mt-12">
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 inline-block">
              <p className="text-primary-700 font-semibold text-lg">
                💡 "Thanks to the Grievance Portal, our neighborhood issues get resolved 10x faster!" 
                <br />
                <span className="text-primary-600 font-normal">- Sarah M., Local Resident</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 bg-gray-50/80 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Benefits</h2>
            <p className="text-xl text-gray-600">Why choose our platform for civic engagement</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: "Transparency",
                description: "Complete visibility into complaint status and resolution process",
                color: "bg-blue-100 text-blue-700"
              },
              {
                icon: Clock,
                title: "Faster Resolution",
                description: "Streamlined workflow reduces resolution time by up to 70%",
                color: "bg-green-100 text-green-700"
              },
              {
                icon: Users,
                title: "Citizen Participation",
                description: "Empowers citizens to actively participate in community improvement",
                color: "bg-purple-100 text-purple-700"
              },
              {
                icon: TrendingUp,
                title: "Data-Driven Governance",
                description: "Analytics help authorities make informed policy decisions",
                color: "bg-orange-100 text-orange-700"
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`${benefit.color} w-16 h-16 rounded-lg flex items-center justify-center mb-6`}>
                  <benefit.icon size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-700/90 backdrop-blur-sm relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join Our Community Today
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Be part of the change. Help us build a more responsive and transparent government.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors">
              Register as Citizen
            </button>
            <button onClick={() => navigate('/officer-register')} className="bg-primary-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-900 transition-colors">
              Join as Officer
            </button>
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
                <li><button onClick={() => navigate('/')} className="hover:text-white">Home</button></li>
                <li><button className="hover:text-white">About</button></li>
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

export default About;