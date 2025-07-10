'use client';

import { useState } from 'react';
import { Bell, Mail, Lock, Shield, Globe, Clock, Users, Building, AlertTriangle } from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: Users },
    { id: 'organization', name: 'Organization', icon: Building },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
  ];

  const [formData, setFormData] = useState({
    profile: {
      fullName: 'Demo User',
      email: 'demo@example.com',
      jobTitle: 'Administrator',
      phone: '',
    },
    organization: {
      name: '',
      industry: '',
      size: '',
      website: '',
    },
    security: {
      mfa: false,
      sessionTimeout: '30',
      ipWhitelist: '',
    },
    notifications: {
      emailAlerts: true,
      scanCompletion: true,
      vulnerabilityFound: true,
      weeklyDigest: true,
    },
  });

  const handleInputChange = (section: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (disabled for demo)
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Platform Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your account preferences and organization settings
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center px-6 py-4 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon
                  className={`-ml-0.5 mr-2 h-5 w-5 ${
                    activeTab === tab.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <form>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}