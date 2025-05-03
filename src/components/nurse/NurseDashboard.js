import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUser, listAssignments } from '../../graphql/queries';
import { updateAssignment } from '../../graphql/mutations';
import { generateClient } from 'aws-amplify/api';

// Create API client outside component
const client = generateClient();

const NurseDashboard = () => {
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchAssignments();
    }
  }, [user]);

  async function fetchUserData() {
    try {
      // New pattern for querying
      const userData = await client.graphql({
        query: getUser,
        variables: { id: user.username }
      });
      
      setCurrentUser(userData.data.getUser);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async function fetchAssignments() {
    try {
      // New pattern for querying with filters
      const assignmentData = await client.graphql({
        query: listAssignments,
        variables: {
          filter: { nurseId: { eq: user.username } }
        }
      });
      
      setAssignments(assignmentData.data.listAssignments.items);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setLoading(false);
    }
  }

  const handleLogout = () => {
    signOut();
  };

  const handleAcceptAssignment = async (id) => {
    try {
      // New pattern for mutations
      await client.graphql({
        query: updateAssignment,
        variables: {
          input: {
            id: id,
            status: 'Confirmed',
            nurseId: user.username
          }
        }
      });
      
      // Refresh assignments
      fetchAssignments();
    } catch (error) {
      console.error('Error accepting assignment:', error);
    }
  };

  const handleCancelAssignment = async (id) => {
    try {
      // New pattern for mutations
      await client.graphql({
        query: updateAssignment,
        variables: {
          input: {
            id: id,
            status: 'Confirmed',
            nurseId: user.username
          }
        }
      });
      
      // Refresh assignments
      fetchAssignments();
    } catch (error) {
      console.error('Error accepting assignment:', error);
    }
  };

  const handleViewAssignmentDetails = async (id) => {
    try {
      // New pattern for mutations
      await client.graphql({
        query: updateAssignment,
        variables: {
          input: {
            id: id,
            status: 'Confirmed',
            nurseId: user.username
          }
        }
      });
      
      // Refresh assignments
      fetchAssignments();
    } catch (error) {
      console.error('Error accepting assignment:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-blue-500 p-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Nurse Portal</h1>
        <div className="flex items-center">
          <span className="text-white mr-4">Welcome, {currentUser.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-500 px-4 py-1 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 p-4">
          <div className="mb-4">
            <div className="font-bold text-gray-700">Verification Status</div>
            <div className="mt-1 flex items-center">
              {currentUser.verified ? 
                <span className="text-green-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  Verified
                </span> : 
                <span className="text-red-500">Not Verified</span>
              }
            </div>
          </div>
          <div className="mb-4">
            <div className="font-bold text-gray-700">My Information</div>
            <div className="mt-1 text-sm">
              <div><span className="font-medium">License:</span> {currentUser.license}</div>
              <div><span className="font-medium">Specialization:</span> {currentUser.specialization}</div>
              <div><span className="font-medium">Experience:</span> {currentUser.experience}</div>
            </div>
          </div>
          <ul className="space-y-2">
            <li>
              <button
                className={`w-full text-left p-2 rounded ${activeSection === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveSection('dashboard')}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${activeSection === 'assignments' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveSection('assignments')}
              >
                My Assignments
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${activeSection === 'availability' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveSection('availability')}
              >
                Set Availability
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${activeSection === 'profile' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveSection('profile')}
              >
                Update Profile
              </button>
            </li>
          </ul>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-6">
          {activeSection === 'dashboard' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Dashboard</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="text-sm text-blue-500 font-medium">Upcoming Shifts</div>
                  <div className="text-2xl font-bold">{assignments.filter(a => a.status !== 'Completed').length}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="text-sm text-green-500 font-medium">Hours This Month</div>
                  <div className="text-2xl font-bold">42</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="text-sm text-purple-500 font-medium">Available Requests</div>
                  <div className="text-2xl font-bold">12</div>
                </div>
              </div>
              
              <h3 className="font-bold text-lg mb-2">Upcoming Assignments</h3>
              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shift
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {assignments.length > 0 ? (
                      assignments.map(assignment => (
                        <tr key={assignment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {assignment.client}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {assignment.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {assignment.shift}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${assignment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                                assignment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-blue-100 text-blue-800'}`}>
                              {assignment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {assignment.status === 'Available' ? (
                              <button 
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => handleAcceptAssignment(assignment.id)}
                              >
                                Accept
                              </button>
                            ) : assignment.status === 'Pending' ? (
                              <button 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleCancelAssignment(assignment.id)}
                              >
                                Cancel
                              </button>
                            ) : (
                              <button 
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => handleViewAssignmentDetails(assignment.id)}
                              >
                                Details
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No assignments found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <h3 className="font-bold text-lg mt-6 mb-2">Upcoming Shifts</h3>
              <div className="bg-white rounded-lg border p-4">
                <p className="text-gray-500">No shifts scheduled for today.</p>
                <button 
                  className="mt-2 text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center"
                  onClick={() => setActiveSection('assignments')}
                >
                  View all schedules
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {activeSection === 'availability' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Set Availability</h2>
              <div className="bg-white p-4 rounded-lg border">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Current Availability</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.availability && currentUser.availability.map(day => (
                      <span key={day} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {day}
                      </span>
                    ))}
                    {(!currentUser.availability || currentUser.availability.length === 0) && (
                      <p className="text-gray-500 text-sm">No availability set</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Update Availability</h3>
                  <p className="text-gray-600 mb-4">Select the days you are available to work:</p>
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <label key={day} className="flex items-center space-x-2 border p-2 rounded">
                        <input 
                          type="checkbox" 
                          defaultChecked={currentUser.availability.includes(day)}
                          className="h-4 w-4"
                        />
                        <span className="text-sm">{day}</span>
                      </label>
                    ))}
                  </div>
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeSection === 'assignments' && (
            <div>
              <h2 className="text-xl font-bold mb-4">My Assignments</h2>
              <p className="text-gray-600 mb-4">View and manage all your scheduled assignments.</p>
              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shift
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {assignments.map(assignment => (
                      <tr key={assignment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {assignment.client}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assignment.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assignment.shift}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${assignment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                              assignment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-blue-100 text-blue-800'}`}>
                            {assignment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleViewAssignmentDetails(assignment.id)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeSection === 'profile' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Update Profile</h2>
              <form className="space-y-4 bg-white p-6 rounded-lg border">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    defaultValue={currentUser.name}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded"
                    defaultValue={currentUser.email}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    defaultValue={currentUser.specialization}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    defaultValue={currentUser.experience}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    readOnly
                    className="w-full p-2 border rounded bg-gray-100"
                    value={currentUser.license || ''}
                  />
                  <p className="text-sm text-gray-500 mt-1">License information can only be changed by administrators.</p>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NurseDashboardWrapper = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <NurseDashboard />
      </div>
    </div>
  );
};

export default NurseDashboardWrapper;