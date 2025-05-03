import React from 'react';
import { Link } from 'react-router-dom';

const MainApp = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Nurse Deployment System</h1>
        <p className="text-center text-gray-600 mb-8">
          This application helps match healthcare facilities with qualified nurses.
        </p>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">System Overview</h2>
            <p className="mb-4">
              Welcome to the Nurse Deployment System. This is a simplified starter version.
            </p>
            <div className="mt-4">
              <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2">
                Go to Login Page
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-bold mb-4">Dashboard Interfaces</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="border p-4 rounded-lg">
                <h3 className="font-bold text-blue-700 mb-2">Nurse Dashboard</h3>
                <p className="text-sm text-gray-600 mb-4">View the nurse interface</p>
                <Link to="/nurse-dashboard" className="block text-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded">
                  View Nurse Dashboard
                </Link>
              </div>
              
              <div className="border p-4 rounded-lg">
                <h3 className="font-bold text-green-700 mb-2">Client Dashboard</h3>
                <p className="text-sm text-gray-600 mb-4">View the client interface</p>
                <Link to="/client-dashboard" className="block text-center bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded">
                  View Client Dashboard
                </Link>
              </div>
              
              <div className="border p-4 rounded-lg">
                <h3 className="font-bold text-purple-700 mb-2">Admin Dashboard</h3>
                <p className="text-sm text-gray-600 mb-4">View the admin interface</p>
                <Link to="/admin-dashboard" className="block text-center bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded">
                  View Admin Dashboard
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-xl font-bold mb-4">System Information</h2>
            <Link to="/system-architecture" className="block text-center bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded">
              View System Architecture
            </Link>
          </div>
          
          {/* New Development Tools Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mt-6 border-2 border-dashed border-orange-300">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-orange-500 mr-2">🔧</span>
              Development Tools
              <span className="text-orange-500 ml-2">🔧</span>
            </h2>
            <p className="text-sm text-orange-600 mb-4">
              These tools are for development and testing purposes only.
            </p>
            <Link to="/test" className="block text-center bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded">
              Test AWS Backend Integration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainApp;