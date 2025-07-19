'use client';

import { useEffect, useRef } from "react";
import Script from "next/script";
import Navbar from "./navbar";


export default function Homepage() {
  const vantaRef = useRef(null);

  useEffect(() => {
    const loadVanta = () => {
      if (typeof window.VANTA !== "undefined" && !window.vantaEffect) {
        window.vantaEffect = window.VANTA.GLOBE({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x22c55e,
          color2: 0x16a34a,
          backgroundColor: "#0a0f0a"
        });
      }
    };

    if (typeof window !== "undefined") {
      if (window.VANTA) {
        loadVanta();
      } else {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.globe.min.js";
        script.onload = loadVanta;
        document.body.appendChild(script);
      }
    }

    return () => {
      if (window.vantaEffect) {
        window.vantaEffect.destroy();
        window.vantaEffect = null;
      }
    };
  }, [])

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" strategy="beforeInteractive" />
      
      <div
        ref={vantaRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
          width: "100vw",
          height: "100vh",
        }}
      />
      
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            AI-Powered Learning
            <span className="block text-green-300">Excellence</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Unlock your potential with BodhAI - where artificial intelligence meets personalized learning to accelerate your educational journey
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-green-700 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg">
              <a href="/mockTests">Begin Your AI Journey</a>
            </button>
            
          </div>
        </div>
        </section>

        <section id="features" className="py-20 px-6 bg-gradient-to-b from-green-900/20 to-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Elevate Learning with BodhAI
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Experience the future of education with AI-powered personalized learning, adaptive assessments, and intelligent insights
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-800/30 to-gray-800 p-8 rounded-2xl border border-green-700/50 hover:shadow-xl hover:shadow-green-500/20 transition-all transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">AI-Powered Insights</h3>
                <p className="text-gray-300 leading-relaxed">
                  Harness the power of artificial intelligence to gain deep insights into your learning patterns and receive personalized recommendations for optimal study paths.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-800/30 to-gray-800 p-8 rounded-2xl border border-green-700/50 hover:shadow-xl hover:shadow-green-500/20 transition-all transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Adaptive Learning</h3>
                <p className="text-gray-300 leading-relaxed">
                  Experience dynamic learning that adapts to your pace and style. Our AI algorithms adjust difficulty levels and content delivery to maximize your learning efficiency.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-800/30 to-gray-800 p-8 rounded-2xl border border-green-700/50 hover:shadow-xl hover:shadow-green-500/20 transition-all transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Smart Analytics</h3>
                <p className="text-gray-300 leading-relaxed">
                  Visualize your progress with comprehensive analytics dashboards. Track performance trends, identify knowledge gaps, and celebrate achievements with data-driven insights.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Why Choose BodhAI?
                </h2>
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  BodhAI is revolutionizing education through cutting-edge artificial intelligence. 
                  Our platform delivers personalized learning experiences that adapt to your unique learning style and pace.
                </p>
                <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                  From intelligent content curation to real-time performance analytics, BodhAI empowers learners 
                  to achieve their full potential through the transformative power of AI-driven education.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">100,000+</div>
                    <div className="text-gray-400">AI-Generated Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-2">25,000+</div>
                    <div className="text-gray-400">Smart Learners</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-green-800/40 to-gray-800 p-8 rounded-3xl shadow-2xl border border-green-700/30">
                  <div className="bg-gray-900/90 backdrop-blur-sm p-6 rounded-2xl border border-green-600/50">
                    <h3 className="text-2xl font-bold text-white mb-4">Experience AI Learning</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Join the future of education with BodhAI. Experience personalized learning powered by advanced AI algorithms.
                    </p>
                    <button className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-full font-semibold hover:from-green-700 hover:to-green-600 transition-all w-full shadow-lg">
                      <a href="/mockTests">Start Learning Today</a>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="bg-black text-gray-300 py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-2xl font-bold mb-4 text-green-400">BodhAI</div>
                <p className="text-gray-400 leading-relaxed">
                  Revolutionizing education through artificial intelligence. Personalized learning experiences that adapt to every learner's unique journey.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-green-300">AI Features</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Smart Content Generation</li>
                  <li>Adaptive Learning Paths</li>
                  <li>AI-Powered Assessments</li>
                  <li>Intelligent Analytics</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-green-300">Learning Areas</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>Science & Mathematics</li>
                  <li>Language Arts</li>
                  <li>Computer Science</li>
                  <li>All Academic Subjects</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4 text-green-300">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>AI Help Assistant</li>
                  <li>Learning Resources</li>
                  <li>Community Forum</li>
                  <li>Technical Support</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-green-800/30 mt-8 pt-8 text-center">
              <p className="text-gray-500">
                © 2025 BodhAI. Empowering minds through intelligent learning.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}