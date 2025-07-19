"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import { useAuth } from "@clerk/nextjs";
import dynamic from 'next/dynamic';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function CreateMockTest() {
  const [selectedSubjects, setSelectedSubjects] = useState({
    Physics: { selected: true, questions: 25, maxQuestions: 50 },
    Chemistry: { selected: true, questions: 25, maxQuestions: 50 },
    Mathematics: { selected: true, questions: 25, maxQuestions: 50 }
  });
  const [difficultyLevel, setDifficultyLevel] = useState('mixed');
  const [testMode, setTestMode] = useState('timed');
  const [duration, setDuration] = useState('1hour');
  const [isLoading, setIsLoading] = useState(false);
  const [testCreated, setTestCreated] = useState(false);
  const [testData, setTestData] = useState(null);
  const { isLoaded, userId } = useAuth();
  const [testId, setTestId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      router.push("/login");
      return;
    }
  }, [isLoaded, userId, router]);

  // Helper functions
  const getTotalQuestions = () => {
    return Object.values(selectedSubjects).reduce((total, subject) => 
      subject.selected ? total + subject.questions : total, 0
    );
  };

  const getDurationInMinutes = () => {
    switch(duration) {
      case '15min': return 15;
      case '30min': return 30;
      case '1hour': return 60;
      case '3hours': return 180;
      default: return 60;
    }
  };

  const handleSubjectToggle = (subjectName) => {
    setSelectedSubjects(prev => ({
      ...prev,
      [subjectName]: {
        ...prev[subjectName],
        selected: !prev[subjectName].selected,
        questions: !prev[subjectName].selected ? 25 : 0
      }
    }));
  };

  const handleQuestionCountChange = (subjectName, count) => {
    setSelectedSubjects(prev => ({
      ...prev,
      [subjectName]: {
        ...prev[subjectName],
        questions: Math.min(Math.max(5, count), prev[subjectName].maxQuestions)
      }
    }));
  };

  const generateQuestionsForSubject = async (subject, count) => {
    try {
      console.log(`Generating exactly ${count} questions for ${subject}`);
      const response = await fetch("http://localhost:5000/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: subject,
          count: count, // This ensures backend generates exactly this many questions
          topics: [],
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate questions for ${subject}`);
      }

      const data = await response.json();
      const questions = data.questions || [];
      console.log(`Generated ${questions.length} questions for ${subject}`);
      return questions.slice(0, count); // Ensure we don't exceed the requested count
    } catch (error) {
      console.error(`Error generating questions for ${subject}:`, error);
      return [];
    }
  };

  const handleCreateTest = async () => {
    setIsLoading(true);
    console.log('🚀 Starting test creation...');
    
    try {
      let allQuestions = [];
      const selectedSubjectsList = Object.entries(selectedSubjects)
        .filter(([_, data]) => data.selected)
        .map(([name, data]) => ({ name, questions: data.questions }));

      console.log('📚 Creating test with subjects:', selectedSubjectsList);
      
      if (selectedSubjectsList.length === 0) {
        alert('Please select at least one subject');
        setIsLoading(false);
        return;
      }

      for (const { name, questions } of selectedSubjectsList) {
        console.log(`🔄 Generating ${questions} questions for ${name}...`);
        const subjectQuestions = await generateQuestionsForSubject(name, questions);
        console.log(`✅ Generated ${subjectQuestions.length} questions for ${name}`);
        
        if (subjectQuestions.length === 0) {
          console.warn(`⚠️ No questions generated for ${name}`);
          alert(`Failed to generate questions for ${name}. Please try again.`);
          setIsLoading(false);
          return;
        }
        
        allQuestions = [...allQuestions, ...subjectQuestions.map(q => ({ ...q, subject: name }))];
      }

      console.log(`📊 Total questions generated: ${allQuestions.length}`);
      
      if (allQuestions.length === 0) {
        alert('No questions were generated. Please check your internet connection and try again.');
        setIsLoading(false);
        return;
      }

      const testConfig = {
        questions: allQuestions,
        timeLimit: getDurationInMinutes(),
        testType: "custom",
        subjects: selectedSubjectsList.map(s => s.name),
        totalQuestions: allQuestions.length,
        difficultyLevel,
        testMode
      };

      if (userId) {
        const response = await fetch("http://localhost:5000/api/save-test", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            testConfig,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setTestId(data.testId);
        }
      }

      setTestData(testConfig);
      setTestCreated(true);
    } catch (error) {
      console.error("Error creating test:", error);
      alert("Failed to create test. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakeTest = () => {
    localStorage.setItem("currentTest", JSON.stringify({ ...testData, testId }));
    router.push("/takeTest");
  };

  // Chart configurations with distinct colors
  const pieChartOptions = {
    chart: {
      type: 'donut',
      background: 'transparent'
    },
    colors: ['#3B82F6', '#10B981', '#8B5CF6'], // Distinct colors: Blue, Green, Purple
    labels: Object.keys(selectedSubjects),
    legend: {
      show: false
    },
    dataLabels: {
      enabled: false
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    },
    stroke: {
      width: 0
    }
  };

  const pieChartSeries = Object.values(selectedSubjects).map(subject => 
    subject.selected ? subject.questions : 0
  );

  const barChartOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    colors: ['#3B82F6', '#3B82F6', '#3B82F6'], // Same bold blue color for all bars
    xaxis: {
      categories: Object.keys(selectedSubjects).filter(key => selectedSubjects[key].selected),
      labels: {
        style: {
          colors: ['#000000'], // Pure black for maximum visibility
          fontSize: '14px',
          fontWeight: 700
        },
        rotate: -45, // Rotate labels to prevent overlap
        offsetY: 5,
        maxHeight: 80
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: ['#000000'], // Pure black for maximum visibility
          fontSize: '14px',
          fontWeight: 600
        }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 3,
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#000000'], // Black text for better visibility
        fontSize: '16px',
        fontWeight: 'bold'
      },
      offsetY: -15 // Move labels up from bars
    },
    plotOptions: {
      bar: {
        distributed: true, // This makes each bar use a different color
        borderRadius: 6,
        columnWidth: '40%', // Further reduced width for more spacing between bars
        dataLabels: {
          position: 'top'
        }
      }
    },
    legend: {
      show: false
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      style: {
        fontSize: '12px'
      }
    }
  };

  const barChartSeries = [{
    name: 'Questions',
    data: Object.entries(selectedSubjects)
      .filter(([_, data]) => data.selected)
      .map(([_, data]) => data.questions)
  }];

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-primary text-xl animate-pulse">Loading Bodh.ai...</div>
      </div>
    );
  }

  if (testCreated && testData) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-primary/10 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">Test Created Successfully!</h1>
              <p className="text-muted-foreground text-lg">Your personalized mock test is ready to begin</p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 mb-8 shadow-sm">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-muted-foreground text-sm">Questions</span>
                  <p className="font-semibold text-foreground text-lg">{testData.totalQuestions}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-3 flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-muted-foreground text-sm">Duration</span>
                  <p className="font-semibold text-foreground text-lg">{testData.timeLimit} min</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleTakeTest}
                className="w-full px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg text-lg"
              >
                Start Test Now
              </button>
              <button
                onClick={() => {
                  setTestCreated(false);
                  setTestData(null);
                  setTestId(null);
                }}
                className="px-6 py-3 text-primary hover:bg-accent hover:text-accent-foreground rounded-xl transition-colors font-medium"
              >
                Create Another Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Custom Test</h1>
            <p className="text-muted-foreground">Configure your personalized practice test</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* Select Subjects */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-card-foreground">Select Subjects</h2>
                </div>

                <div className="space-y-4">
                  {Object.entries(selectedSubjects).map(([subject, data]) => (
                    <div key={subject} className={`border-2 rounded-xl p-4 transition-all ${
                      data.selected 
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border bg-muted/30'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={data.selected}
                            onChange={() => handleSubjectToggle(subject)}
                            className="w-5 h-5 text-primary rounded focus:ring-primary"
                          />
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                              {subject === 'Physics' ? (
                                <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                              ) : subject === 'Chemistry' ? (
                                <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              )}
                            </div>
                            <span className="font-semibold text-card-foreground">{subject}</span>
                          </div>
                        </label>
                        <span className="text-sm text-muted-foreground font-medium">
                          {data.questions} questions
                        </span>
                      </div>

                      {data.selected && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Questions: {data.questions}</span>
                            <span>Max: {data.maxQuestions}</span>
                          </div>
                          <div className="relative">
                            <input
                              type="range"
                              min="5"
                              max={data.maxQuestions}
                              value={data.questions}
                              onChange={(e) => handleQuestionCountChange(subject, parseInt(e.target.value))}
                              className="w-full question-slider"
                              style={{
                                background: `linear-gradient(to right, #059669 0%, #059669 ${(data.questions / data.maxQuestions) * 100}%, #e5e7eb ${(data.questions / data.maxQuestions) * 100}%, #e5e7eb 100%)`
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty Level & Test Mode */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">Difficulty Level</h3>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: 'easy', label: 'Easy', desc: 'Basic concepts and fundamental problems', accuracy: '70-80%' },
                      { id: 'mixed', label: 'Mixed', desc: 'Combination of easy, medium, and hard questions', accuracy: '50-65%' },
                      { id: 'advanced', label: 'Advanced', desc: 'Complex problems and challenging concepts', accuracy: '30-50%' }
                    ].map((level) => (
                      <label key={level.id} className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        difficultyLevel === level.id 
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}>
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="difficulty"
                            value={level.id}
                            checked={difficultyLevel === level.id}
                            onChange={(e) => setDifficultyLevel(e.target.value)}
                            className="mt-1 w-4 h-4 text-primary"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-card-foreground">{level.label}</span>
                              {level.id === 'mixed' && (
                                <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                                  Recommended
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{level.desc}</p>
                            <p className="text-xs text-muted-foreground">{level.accuracy} accuracy expected</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Test Mode */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground">Test Mode</h3>
                  </div>

                  <div className="space-y-3">
                    <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      testMode === 'timed' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="testMode"
                          value="timed"
                          checked={testMode === 'timed'}
                          onChange={(e) => setTestMode(e.target.value)}
                          className="w-4 h-4 text-primary"
                        />
                        <div>
                          <div className="font-medium text-card-foreground">Timed</div>
                          <p className="text-sm text-muted-foreground">Time pressure simulates real exam conditions</p>
                        </div>
                      </div>
                    </label>

                    <label className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      testMode === 'untimed' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="testMode"
                          value="untimed"
                          checked={testMode === 'untimed'}
                          onChange={(e) => setTestMode(e.target.value)}
                          className="w-4 h-4 text-primary"
                        />
                        <div>
                          <div className="font-medium text-card-foreground">Untimed</div>
                          <p className="text-sm text-muted-foreground">Focus on accuracy without time constraints</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Duration Selection */}
                  {testMode === 'timed' && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <h4 className="font-medium text-card-foreground mb-3">Duration</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: '15min', label: '15 minutes', desc: 'Quick practice' },
                          { id: '30min', label: '30 minutes', desc: 'Short test' },
                          { id: '1hour', label: '1 hour', desc: 'Standard test' },
                          { id: '3hours', label: '3 hours', desc: 'Full exam simulation' }
                        ].map((dur) => (
                          <button
                            key={dur.id}
                            onClick={() => setDuration(dur.id)}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              duration === dur.id 
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <div className="font-medium text-card-foreground text-sm">{dur.label}</div>
                            <div className="text-xs text-muted-foreground">{dur.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Preview */}
            <div className="space-y-6">
              {/* Test Preview */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground">Test Preview</h3>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-primary/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{getTotalQuestions()}</div>
                    <div className="text-sm text-primary">Total Questions</div>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {testMode === 'timed' ? `${getDurationInMinutes()} min` : '∞'}
                    </div>
                    <div className="text-sm text-primary">Duration</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Difficulty Level</span>
                      <span className="font-medium text-card-foreground capitalize">{difficultyLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Test Mode</span>
                      <span className="font-medium text-card-foreground capitalize">{testMode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time per Question</span>
                      <span className="font-medium text-card-foreground">
                        {testMode === 'timed' ? `${(getDurationInMinutes() / getTotalQuestions()).toFixed(1)} min` : 'Unlimited'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subject Distribution Chart */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Subject Distribution</h3>
                
                {getTotalQuestions() > 0 ? (
                  <div className="space-y-4">
                    <div className="h-48">
                      <Chart
                        options={pieChartOptions}
                        series={pieChartSeries}
                        type="donut"
                        height="100%"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      {Object.entries(selectedSubjects)
                        .filter(([_, data]) => data.selected)
                        .map(([subject, data], index) => (
                        <div key={subject} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full`} 
                                 style={{ backgroundColor: pieChartOptions.colors[index] }}></div>
                            <span className="text-card-foreground">{subject}</span>
                          </div>
                          <span className="font-medium text-card-foreground">{data.questions}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2">📊</div>
                    <p>Select subjects to see distribution</p>
                  </div>
                )}
              </div>

              {/* Questions per Subject Chart */}
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Questions per Subject</h3>
                
                {getTotalQuestions() > 0 ? (
                  <div className="h-48">
                    <Chart
                      options={barChartOptions}
                      series={barChartSeries}
                      type="bar"
                      height="100%"
                    />
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="text-4xl mb-2">📈</div>
                    <p>Select subjects to see breakdown</p>
                  </div>
                )}
              </div>

              {/* Create Test Button */}
              <button
                onClick={handleCreateTest}
                disabled={isLoading || getTotalQuestions() === 0}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                  isLoading || getTotalQuestions() === 0
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    Creating Test...
                  </div>
                ) : (
                  `Create Test (${getTotalQuestions()} Questions)`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}