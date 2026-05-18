import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Leaf, Shield, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-solar-dark via-[#0a1f1a] to-[#051512]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-b-0 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-solar-green" />
              <span className="text-xl font-bold gradient-text">Solar Intelligence</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-300 hover:text-solar-green transition">Features</Link>
              <Link href="#sustainability" className="text-gray-300 hover:text-solar-green transition">Sustainability</Link>
              <Link href="/auth/login" className="text-gray-300 hover:text-solar-green transition">Login</Link>
              <Link href="/auth/signup" className="btn-neon">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-solar-green/20 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 100 
              }}
              animate={{ 
                y: -100,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="gradient-text">Power Your Future</span>
                <br />
                <span className="text-white">with AI Solar Intelligence</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Live IoT monitoring, predictive maintenance, smart recycling, and sustainability analytics — all in one intelligent platform.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup" className="btn-neon text-lg px-8 py-4">
                  Start Free Trial
                </Link>
                <Link href="#demo" className="glass-card-hover px-8 py-4 text-lg border border-solar-green/30 text-solar-green">
                  Watch Demo
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
            >
              {[
                { icon: Zap, value: '10MW+', label: 'Energy Monitored' },
                { icon: Leaf, value: '5K+', label: 'Tons CO₂ Reduced' },
                { icon: Shield, value: '99.9%', label: 'Uptime' },
                { icon: TrendingUp, value: '30%', label: 'Efficiency Gain' },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-6">
                  <stat.icon className="w-8 h-8 text-solar-green mx-auto mb-3" />
                  <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Intelligent Features</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to monitor, maintain, and maximize your solar investment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Real-Time Monitoring',
                description: 'Live IoT data streaming with instant alerts and performance tracking',
                icon: Zap,
              },
              {
                title: 'AI Predictions',
                description: 'Machine learning algorithms predict maintenance needs and optimize efficiency',
                icon: TrendingUp,
              },
              {
                title: 'Smart Recycling',
                description: 'End-to-end solar waste management with certified recyclers network',
                icon: Leaf,
              },
              {
                title: 'Security First',
                description: 'Enterprise-grade encryption and role-based access control',
                icon: Shield,
              },
              {
                title: 'Rewards Program',
                description: 'Earn points for sustainable actions and redeem for eco-friendly rewards',
                icon: TrendingUp,
              },
              {
                title: 'Carbon Tracking',
                description: 'Detailed sustainability reports and environmental impact analytics',
                icon: Leaf,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 glass-card-hover"
              >
                <feature.icon className="w-12 h-12 text-solar-green mb-4" />
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 neon-border"
          >
            <h2 className="text-4xl font-bold mb-4 gradient-text">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-8">Join thousands of users optimizing their solar energy future</p>
            <Link href="/auth/signup" className="btn-neon text-lg px-12 py-4">
              Create Free Account
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Zap className="w-6 h-6 text-solar-green" />
              <span className="font-bold gradient-text">Solar Intelligence</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 Solar Intelligence. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
