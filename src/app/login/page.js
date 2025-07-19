"use client";
import React, { useState } from "react";
import { SignIn, SignUp } from '@clerk/nextjs';
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import Navbar from "../components/navbar";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black font-poppins">
      <Navbar />
      <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="flex-1 bg-black flex items-center justify-center px-8 py-16 lg:py-24">
          <div className="max-w-2xl text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Master Your
              <span className="bg-gradient-to-r from-gray-300 to-gray-400 bg-clip-text text-transparent"> JEE Journey</span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Your Ultimate Destination for IIT JEE Preparation
            </p>

            <div className="space-y-4 text-gray-400">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Comprehensive mock tests for Physics, Chemistry & Mathematics</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Detailed performance analysis and rank predictions</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p>Expert solutions and personalized study recommendations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="lg:w-1/2 bg-green-900/20 flex items-center justify-center p-10">
          <div className="w-full max-w-md">
            {/* Custom Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-green-400 mb-2">
                {isLogin ? "Welcome Back" : "Join Bodh.ai"}
              </h2>
              <p className="text-green-300 text-sm">
                {isLogin ? "Sign in to continue your JEE preparation" : "Start your JEE preparation journey"}
              </p>
            </div>
            
            {/* Clerk Auth Component */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-green-600/20">
              {isLogin ? (
                <SignIn 
                  routing="hash"
                  signUpUrl="#signup"
                  redirectUrl="/mockTests"
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg rounded-xl py-3 font-semibold',
                      card: 'shadow-none border-none bg-transparent p-0',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'border-green-600/30 bg-white/90 hover:bg-green-50 text-gray-700 rounded-xl py-3 font-medium',
                      formFieldInput: 'border-green-600/30 bg-white/90 focus:border-green-500 focus:ring-green-500/20 placeholder-gray-500 rounded-xl py-3',
                      footerActionLink: 'text-green-400 hover:text-green-300 font-medium',
                      formFieldLabel: 'text-green-100 font-medium mb-2',
                      identityPreviewText: 'text-green-200',
                      formHeaderTitle: 'text-green-400',
                      formHeaderSubtitle: 'text-green-300',
                      dividerLine: 'bg-green-600/30',
                      dividerText: 'text-green-300',
                      formFieldRow: 'mb-4'
                    }
                  }}
                />
              ) : (
                <SignUp 
                  routing="hash"
                  signInUrl="#login"
                  redirectUrl="/mockTests"
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg rounded-xl py-3 font-semibold',
                      card: 'shadow-none border-none bg-transparent p-0',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'border-green-600/30 bg-white/90 hover:bg-green-50 text-gray-700 rounded-xl py-3 font-medium',
                      formFieldInput: 'border-green-600/30 bg-white/90 focus:border-green-500 focus:ring-green-500/20 placeholder-gray-500 rounded-xl py-3',
                      footerActionLink: 'text-green-400 hover:text-green-300 font-medium',
                      formFieldLabel: 'text-green-100 font-medium mb-2',
                      identityPreviewText: 'text-green-200',
                      formHeaderTitle: 'text-green-400',
                      formHeaderSubtitle: 'text-green-300',
                      dividerLine: 'bg-green-600/30',
                      dividerText: 'text-green-300',
                      formFieldRow: 'mb-4'
                    }
                  }}
                />
              )}
            </div>

            {/* Toggle Between Login/Signup */}
            <div className="text-center mt-6">
              <p className="text-green-300 text-sm">
                {isLogin ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="text-green-400 font-semibold hover:text-green-300 transition-colors"
                    >
                      Create one here
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => setIsLogin(true)}
                      className="text-green-400 font-semibold hover:text-green-300 transition-colors"
                    >
                      Sign in here
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}