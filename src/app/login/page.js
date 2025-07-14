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
        <div className="lg:w-1/2 bg-yellow-300/20 flex items-center justify-center p-10">
          <div className="w-full max-w-md space-y-6">
            <h2 className="text-3xl font-bold text-[#FA812F]">
              {isLogin ? "Login to Your Account" : "Create a New Account"}
            </h2>
            
            <div className="flex justify-center">
              {isLogin ? (
                <SignIn 
                  routing="hash"
                  signUpUrl="#signup"
                  redirectUrl="/mockTests"
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-[#FA812F] hover:bg-[#e5731a] text-white',
                      card: 'shadow-none border-none bg-transparent',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'border-yellow-600 bg-white hover:bg-yellow-50',
                      formFieldInput: 'border-yellow-600 bg-yellow-50 focus:border-[#FA812F] focus:ring-[#FA812F] placeholder-gray-600',
                      footerActionLink: 'text-[#F3C623] hover:text-[#FA812F]'
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
                      formButtonPrimary: 'bg-[#F3C623] hover:bg-yellow-500 text-gray-800',
                      card: 'shadow-none border-none bg-transparent',
                      headerTitle: 'hidden',
                      headerSubtitle: 'hidden',
                      socialButtonsBlockButton: 'border-yellow-600 bg-white hover:bg-yellow-50',
                      formFieldInput: 'border-yellow-600 bg-yellow-50 focus:border-[#FA812F] focus:ring-[#FA812F] placeholder-gray-600',
                      footerActionLink: 'text-[#FA812F] hover:text-[#F3C623]'
                    }
                  }}
                />
              )}
            </div>

            <p className="text-center text-sm text-[#FA812F]">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-[#F3C623] font-semibold hover:underline"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-[#F3C623] font-semibold hover:underline"
                  >
                    Log In
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}