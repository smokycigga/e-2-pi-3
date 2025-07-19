"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import Sidebar from "../components/sidebar";

// Import ApexCharts dynamically to avoid SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Dashboard() {
  const { isLoaded, userId } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("all");
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      router.push('/login');
      return;
    }
  }, [isLoaded, userId, router]);

  const fetchTestResults = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch test results
      const resultsResponse = await fetch(`http://localhost:5000/api/user-test-results/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (resultsResponse.ok) {
        const resultsData = await resultsResponse.json();
        setTestResults(resultsData.results || []);
        console.log('Test results fetched:', resultsData.results?.length || 0, 'tests');
      }
      
      // Fetch user statistics
      const statsResponse = await fetch(`http://localhost:5000/api/user-stats/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setUserStats(statsData);
        console.log('User stats fetched:', statsData);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isLoaded && userId) fetchTestResults();
  }, [fetchTestResults, isLoaded, userId]);

  const getFilteredResults = () => {
    if (selectedTimeRange === "all") return testResults;
    
    const now = new Date();
    const filterDate = new Date();
    const days = { "7days": 7, "30days": 30, "90days": 90 }[selectedTimeRange];
    filterDate.setDate(now.getDate() - days);
    
    return testResults.filter(result => new Date(result.completedAt) >= filterDate);
  };

  const getStats = () => {
    const filtered = getFilteredResults();
    if (!filtered.length) return null;

    const totalTests = filtered.length;
    const totalQuestions = filtered.reduce((sum, test) => sum + test.totalQuestions, 0);
    const totalCorrect = filtered.reduce((sum, test) => sum + test.results.score, 0);
    const avgScore = ((totalCorrect / totalQuestions) * 100).toFixed(1);
    const avgTime = Math.round(filtered.reduce((sum, test) => sum + test.timeTaken, 0) / totalTests / 60);

    return { totalTests, avgScore, avgTime, totalQuestions };
  };

  const getChartData = () => {
    const filtered = getFilteredResults();
    
    // Performance trend
    const performanceTrend = filtered.map((test, index) => ({
      name: `T${index + 1}`,
      score: parseFloat(test.results.percentage),
    }));

    // Subject performance
    const subjectData = {};
    filtered.forEach(test => {
      if (test.results.subjectWiseResults) {
        Object.entries(test.results.subjectWiseResults).forEach(([subject, data]) => {
          if (!subjectData[subject]) subjectData[subject] = { total: 0, correct: 0 };
          subjectData[subject].total += data.total;
          subjectData[subject].correct += data.correct;
        });
      }
    });

    const subjectPerformance = Object.entries(subjectData).map(([subject, data]) => ({
      subject: subject.slice(0, 4), // Shortened for chart
      score: ((data.correct / data.total) * 100).toFixed(1),
    }));

    // Score distribution
    const scoreRanges = { "90-100": 0, "80-89": 0, "70-79": 0, "60-69": 0, "<60": 0 };
    filtered.forEach(test => {
      const score = parseFloat(test.results.percentage);
      if (score >= 90) scoreRanges["90-100"]++;
      else if (score >= 80) scoreRanges["80-89"]++;
      else if (score >= 70) scoreRanges["70-79"]++;
      else if (score >= 60) scoreRanges["60-69"]++;
      else scoreRanges["<60"]++;
    });

    const scoreDistribution = Object.entries(scoreRanges).map(([range, count]) => ({
      range, count, percentage: ((count / filtered.length) * 100).toFixed(0)
    }));

    return { performanceTrend, subjectPerformance, scoreDistribution };
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-primary font-semibold text-lg">Loading Dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  if (testResults.length === 0) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="max-w-4xl mx-auto text-center pt-20">
            <div className="w-20 h-20 mx-auto mb-8 bg-primary/10 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to Your Dashboard</h1>
            <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
              Start your AI-powered learning journey with personalized assessments and track your progress with detailed analytics.
            </p>
            <button
              onClick={() => router.push('/mockTests')}
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg text-lg"
            >
              Take Your First Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = getStats();
  const chartData = getChartData();
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground text-base mt-2">Track your learning progress and performance</p>
              </div>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="bg-card border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent shadow-sm"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl font-bold text-primary">{stats.totalTests}</div>
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-muted-foreground text-sm font-medium">Total Tests</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl font-bold text-foreground">{stats.avgScore}%</div>
                  <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="text-muted-foreground text-sm font-medium">Average Score</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl font-bold text-primary">{stats.totalQuestions}</div>
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-muted-foreground text-sm font-medium">Questions Solved</div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl font-bold text-foreground">{stats.avgTime}m</div>
                  <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-muted-foreground text-sm font-medium">Avg Time</div>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Performance Trend */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Performance Trend</h3>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div style={{ height: "280px" }}>
                {typeof window !== 'undefined' && (
                  <ReactApexChart
                    type="line"
                    height={280}
                    options={{
                      chart: {
                        toolbar: {
                          show: false,
                        },
                        zoom: {
                          enabled: false,
                        },
                        background: 'transparent',
                      },
                      stroke: {
                        curve: 'smooth',
                        width: 3,
                      },
                      colors: ['hsl(var(--chart-1))'],
                      grid: {
                        borderColor: 'hsl(var(--border))',
                        strokeDashArray: 3,
                      },
                      markers: {
                        size: 6,
                        colors: ['hsl(var(--chart-1))'],
                        strokeWidth: 2,
                        strokeColors: 'hsl(var(--background))',
                      },
                      xaxis: {
                        categories: chartData.performanceTrend.map(item => item.name),
                        labels: {
                          style: {
                            colors: 'hsl(var(--muted-foreground))',
                            fontSize: '12px',
                            fontWeight: 500,
                          },
                        },
                        axisBorder: {
                          show: false,
                        },
                        axisTicks: {
                          show: false,
                        },
                      },
                      yaxis: {
                        min: 0,
                        max: 100,
                        labels: {
                          style: {
                            colors: 'hsl(var(--muted-foreground))',
                            fontSize: '12px',
                            fontWeight: 500,
                          },
                          formatter: (value) => `${value}%`,
                        },
                      },
                      tooltip: {
                        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
                        y: {
                          formatter: (value) => `${value}%`,
                        },
                      },
                    }}
                    series={[
                      {
                        name: 'Score',
                        data: chartData.performanceTrend.map(item => parseFloat(item.score)),
                      },
                    ]}
                  />
                )}
              </div>
            </div>

            {/* Subject Performance */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-foreground">Subject Performance</h3>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div style={{ height: "280px" }}>
                {typeof window !== 'undefined' && (
                  <ReactApexChart
                    type="bar"
                    height={280}
                    options={{
                      chart: {
                        toolbar: {
                          show: false,
                        },
                        background: 'transparent',
                      },
                      colors: ['hsl(var(--chart-2))'],
                      grid: {
                        borderColor: 'hsl(var(--border))',
                        strokeDashArray: 3,
                      },
                      plotOptions: {
                        bar: {
                          borderRadius: 8,
                          columnWidth: '60%',
                        },
                      },
                      dataLabels: {
                        enabled: false,
                      },
                      xaxis: {
                        categories: chartData.subjectPerformance.map(item => item.subject),
                        labels: {
                          style: {
                            colors: 'hsl(var(--muted-foreground))',
                            fontSize: '12px',
                            fontWeight: 500,
                          },
                        },
                        axisBorder: {
                          show: false,
                        },
                        axisTicks: {
                          show: false,
                        },
                      },
                      yaxis: {
                        min: 0,
                        max: 100,
                        labels: {
                          style: {
                            colors: 'hsl(var(--muted-foreground))',
                            fontSize: '12px',
                            fontWeight: 500,
                          },
                          formatter: (value) => `${value}%`,
                        },
                      },
                      tooltip: {
                        theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
                        y: {
                          formatter: (value) => `${value}%`,
                        },
                      },
                    }}
                    series={[
                      {
                        name: 'Score',
                        data: chartData.subjectPerformance.map(item => parseFloat(item.score)),
                      },
                    ]}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Score Distribution */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Score Distribution</h3>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
            </div>
            <div className="flex justify-center" style={{ height: "300px" }}>
              {typeof window !== 'undefined' && (
                <ReactApexChart
                  type="pie"
                  height={300}
                  options={{
                    chart: {
                      toolbar: {
                        show: false,
                      },
                      background: 'transparent',
                    },
                    colors: COLORS,
                    labels: chartData.scoreDistribution.map(item => `${item.range}%`),
                    legend: {
                      position: 'bottom',
                      fontSize: '14px',
                      fontWeight: 500,
                      labels: {
                        colors: 'hsl(var(--muted-foreground))',
                      },
                    },
                    dataLabels: {
                      enabled: true,
                      formatter: (val, opts) => {
                        return chartData.scoreDistribution[opts.seriesIndex].percentage + '%';
                      },
                      style: {
                        fontSize: '12px',
                        fontWeight: 600,
                      },
                    },
                    tooltip: {
                      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
                      y: {
                        formatter: (value) => `${value} tests`,
                      },
                    },
                    responsive: [{
                      breakpoint: 480,
                      options: {
                        chart: {
                          width: 300
                        },
                        legend: {
                          position: 'bottom'
                        }
                      }
                    }]
                  }}
                  series={chartData.scoreDistribution.map(item => item.count)}
                />
              )}
            </div>
          </div>

          {/* Recent Tests */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Recent Tests</h3>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              {getFilteredResults().slice(-5).reverse().map((test, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 rounded-xl transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{test.testName}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(test.completedAt).toLocaleDateString()} • {Math.round(test.timeTaken / 60)}m
                      </div>
                    </div>
                  </div>
                  <div className={`text-lg font-bold px-3 py-1 rounded-lg ${
                    parseFloat(test.results.percentage) >= 80 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground bg-muted/50'
                  }`}>
                    {test.results.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={() => router.push('/mockTests')}
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg text-lg"
            >
              Take New Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}