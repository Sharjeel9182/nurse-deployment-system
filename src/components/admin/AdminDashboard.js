import React, { useState } from 'react';

// Mock data for an admin
const mockAdminData = {
  id: 5,
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin'
};

// Mock users data
const mockUsers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'nurse@example.com',
    role: 'nurse',
    verified: true,
    created_at: '04/01/2025'
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'nurse2@example.com',
    role: 'nurse',
    verified: true,
    created_at: '04/01/2025'
  },
  {
    id: 3,
    name: 'City Hospital',
    email: 'client@example.com',
    role: 'client',
    verified: true,
    created_at: '04/01/2025'
  },
  {
    id: 4,
    name: 'Sunshine Nursing Home',
    email: 'client2@example.com',
    role: 'client',
    verified: true,
    created_at: '04/01/2025'
  },
  {
    id: 5,
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    verified: true,
    created_at: '04/01/2025'
  },
  {
    id: 6,
    name: 'Jessica Wang',
    email: 'nurse3@example.com',
    role: 'nurse',
    verified: false,
    created_at: '04/03/2025'
  },
  {
    id: 7,
    name: 'Central Clinic',
    email: 'client3@example.com',
    role: 'client',
    verified: false,
    created_at: '04/04/2025'
  }
];

// Mock pending verifications data
const mockPendingVerifications = [
  {
    id: 6,
    name: 'Jessica Wang',
    role: 'nurse',
    identifier: 'RN789012',
    submissionDate: '2025-04-03'
  },
  {
    id: 7,
    name: 'Central Clinic',
    role: 'client',
    identifier: 'Facility',
    submissionDate: '2025-04-04'
  }
];

// Mock recent activity data
const mockRecentActivity = [
  {
    id: 1,
    user: 'Sarah Johnson',
    action: 'Updated availability',
    timestamp: '4/5/2025, 10:30:15 AM'
  },
  {
    id: 2,
    user: 'City Hospital',
    action: 'Created nurse request',
    timestamp: '4/5/2025, 9:45:22 AM'
  },
  {
    id: 3,
    user: 'Michael Chen',
    action: 'Logged in',
    timestamp: '4/5/2025, 9:30:05 AM'
  },
  {
    id: 4,
    user: 'Admin User',
    action: 'Approved verification for user 8',
    timestamp: '4/4/2025, 4:15:30 PM'
  }
];

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentUser] = useState(mockAdminData);
  const [pendingVerifications] = useState(mockPendingVerifications);
  const [recentActivity] = useState(mockRecentActivity);
  const [users] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    alert('Logout functionality would be implemented here');
  };

  const handleApproveVerification = (userId) => {
    alert(`Approve verification for user ${userId}`);
  };

  const handleRejectVerification = (userId) => {
    alert(`Reject verification for user ${userId}`);
  };

  // Filtered users based on search query
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-purple-600 p-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Admin Portal</h1>
        <div className="flex items-center">
          <span className="text-white mr-4">Welcome, {currentUser.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-purple-600 px-4 py-1 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 p-4">
          <ul className="space-y-2">
            <li>
              <button
                className={`w-full text-left p-2 rounded ${activeSection === 'dashboard' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveSection('dashboard')}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${activeSection === 'users' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveSection('users')}
              >
                Manage Users
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${activeSection === 'verifications' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveSection('verifications')}
              >
                Verifications
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${activeSection === 'assignments' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveSection('assignments')}
              >
                Assignments
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${activeSection === 'reports' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveSection('reports')}
              >
                Reports
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${activeSection === 'settings' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveSection('settings')}
              >
                System Settings
              </button>
            </li>
          </ul>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6">
          {activeSection === 'dashboard' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="text-sm text-blue-500 font-medium">Total Nurses</div>
                  <div className="text-2xl font-bold">{users.filter(u => u.role === 'nurse').length}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="text-sm text-green-500 font-medium">Total Clients</div>
                  <div className="text-2xl font-bold">{users.filter(u => u.role === 'client').length}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <div className="text-sm text-yellow-500 font-medium">Active Requests</div>
                  <div className="text-2xl font-bold">
                    {/* In a real app, we would fetch this from a query */}
                    57
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="text-sm text-purple-500 font-medium">Pending Verifications</div>
                  <div className="text-2xl font-bold">{pendingVerifications.length}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Pending Verifications</h3>
                  <div className="bg-white rounded-lg border overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {pendingVerifications.length > 0 ? (
                          pendingVerifications.map(verification => (
                            <tr key={verification.id}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                {verification.name}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {verification.role === 'nurse' ? 'Nurse' : 'Client'}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {verification.submissionDate}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm">
                                <div className="flex space-x-2">
                                  <button 
                                    className="text-green-600 hover:text-green-900"
                                    onClick={() => handleApproveVerification(verification.id)}
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    className="text-red-600 hover:text-red-900"
                                    onClick={() => handleRejectVerification(verification.id)}
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-4 py-4 text-center text-sm text-gray-500">
                              No pending verifications
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {pendingVerifications.length > 5 && (
                      <div className="px-4 py-2 bg-gray-50 text-right">
                        <button 
                          className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                          onClick={() => setActiveSection('verifications')}
                        >
                          View all verifications
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">Recent Activity</h3>
                  <div className="bg-white rounded-lg border overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Timestamp
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {recentActivity.length > 0 ? (
                          recentActivity.map(activity => (
                            <tr key={activity.id}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                {activity.user}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {activity.action}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {activity.timestamp}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="3" className="px-4 py-4 text-center text-sm text-gray-500">
                              No recent activity
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {recentActivity.length > 5 && (
                      <div className="px-4 py-2 bg-gray-50 text-right">
                        <button 
                          className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                          onClick={() => setActiveSection('activity')}
                        >
                          View all activity
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'users' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Manage Users</h2>
              <div className="mb-4 flex justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full p-2 pl-10 border rounded"
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <button 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                  onClick={() => alert('Add New User functionality would be implemented here')}
                >
                  Add New User
                </button>
              </div>
              
              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map(user => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'nurse' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.verified ? (
                              <span className="text-green-500 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                Verified
                              </span>
                            ) : (
                              <span className="text-red-500">Not Verified</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.created_at}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <button 
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => alert(`View details for user ${user.id}`)}
                              >
                                View
                              </button>
                              <button 
                                className="text-purple-600 hover:text-purple-900"
                                onClick={() => alert(`Edit user ${user.id}`)}
                              >
                                Edit
                              </button>
                              {user.role !== 'admin' && (
                                <button 
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => alert(`Delete user ${user.id}`)}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No users found matching your search
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeSection === 'verifications' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Credential Verifications</h2>
              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Identifier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submission Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pendingVerifications.length > 0 ? (
                      pendingVerifications.map(verification => (
                        <tr key={verification.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {verification.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {verification.role === 'nurse' ? 'Nurse' : 'Client'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {verification.identifier}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {verification.submissionDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <button 
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => alert(`Review verification for ${verification.name}`)}
                              >
                                Review
                              </button>
                              <button 
                                className="text-green-600 hover:text-green-900"
                                onClick={() => handleApproveVerification(verification.id)}
                              >
                                Approve
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleRejectVerification(verification.id)}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No pending verifications
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {(activeSection === 'assignments' || activeSection === 'reports' || activeSection === 'settings') && (
            <div>
              <h2 className="text-xl font-bold mb-4">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h2>
              <div className="bg-white p-6 rounded-lg border">
                <p className="text-gray-500">This section would be fully implemented in a production system.</p>
                <p className="mt-4 text-gray-500">The {activeSection} section would provide functionality to:</p>
                <ul className="list-disc pl-5 mt-2 text-gray-500">
                  {activeSection === 'assignments' && (
                    <>
                      <li>View all nurse assignments</li>
                      <li>Manage assignment disputes</li>
                      <li>Reassign nurses when needed</li>
                      <li>Track assignment completion</li>
                    </>
                  )}
                  {activeSection === 'reports' && (
                    <>
                      <li>Generate user activity reports</li>
                      <li>View nurse performance metrics</li>
                      <li>Track client satisfaction</li>
                      <li>Analyze system usage patterns</li>
                    </>
                  )}
                  {activeSection === 'settings' && (
                    <>
                      <li>Configure system parameters</li>
                      <li>Manage email notifications</li>
                      <li>Configure database connections</li>
                      <li>Set up backup and maintenance schedule</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminDashboardWrapper = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <AdminDashboard />
      </div>
    </div>
  );
};

export default AdminDashboardWrapper;