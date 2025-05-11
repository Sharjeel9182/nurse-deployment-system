import React, { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listShifts } from '../../graphql/queries';
import { updateShift } from '../../graphql/mutations';
import { useAuth } from '../../contexts/AuthContext';
import { uploadData } from '@aws-amplify/storage';

const client = generateClient();

const NurseDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [availableShifts, setAvailableShifts] = useState([]);
  const [myShifts, setMyShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({});

  // Get user attributes with fallbacks
  const nurseData = {
    id: user?.username || user?.sub || '', // Using Cognito-generated ID (like 017b5560-80e1-705e...)
    name: user?.name || user?.email?.split('@')[0] || 'User',
    email: user?.email || '',
    role: user?.['custom:role'] || 'nurse',
    verified: user?.email_verified || false,
    license: user?.['custom:license'] || 'N/A',
    specialization: user?.['custom:specialization'] || 'N/A',
    experience: user?.['custom:experience'] || 'N/A',
    availability: user?.['custom:availability']?.split(',') || [],
    gender: user?.['custom:gender'] || '',
    provinces: user?.['custom:provinces']?.split(',') || []
  };

  // Canadian provinces list
  const canadianProvinces = [
    'Alberta',
    'British Columbia',
    'Manitoba',
    'New Brunswick',
    'Newfoundland and Labrador',
    'Nova Scotia',
    'Ontario',
    'Prince Edward Island',
    'Quebec',
    'Saskatchewan',
    'Northwest Territories',
    'Nunavut',
    'Yukon'
  ];

  // Handle file upload
  const handleFileUpload = async (event, documentType) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadStatus(prev => ({ ...prev, [documentType]: 'uploading' }));
    try {
      // The file will be stored in a folder structure like: documents/userId/documentType/filename
      const fileName = `${documentType}_${Date.now()}_${file.name}`;
      const result = await uploadData({
        key: `documents/${nurseData.id}/${documentType}/${fileName}`,
        data: file,
        options: {
          contentType: file.type
        }
      });
      setUploadStatus(prev => ({ ...prev, [documentType]: 'success' }));
      console.log('Upload success:', result);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus(prev => ({ ...prev, [documentType]: 'error' }));
    }
  };

  // Wrap fetchAllShifts in useCallback to stabilize its identity
  const fetchAllShifts = useCallback(async () => {
    if (!nurseData.id) {
      console.log("User ID not available yet");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fetch OPEN shifts
      const openShiftsData = await client.graphql({
        query: listShifts,
        variables: { filter: { status: { eq: "OPEN" } } }
      });
      setAvailableShifts(openShiftsData.data.listShifts.items);

      // Fetch shifts assigned to current nurse using Cognito user ID
      const myShiftsData = await client.graphql({
        query: listShifts,
        variables: { filter: { nurseId: { eq: nurseData.id } } }
      });
      setMyShifts(myShiftsData.data.listShifts.items);

    } catch (err) {
      console.error('Error fetching shifts:', err);
      setError('Error fetching shifts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [nurseData.id]);

  // Add debug logging to help verify the data
  useEffect(() => {
    if (user) {
      console.log('Nurse Data:', {
        userId: user.username || user.sub, // Log the actual Cognito ID being used
        nurseData,
        rawUser: user
      });
    }
  }, [user, nurseData]);

  // Fetch shifts on component mount and when user changes
  useEffect(() => {
    if (!authLoading && nurseData.id) {
      fetchAllShifts();
    }
  }, [authLoading, nurseData.id, fetchAllShifts]);

  const handleLogout = () => {
    alert('Logout functionality would be implemented here');
  };

  const handleAcceptAssignment = async (shift) => {
    if (!shift || !shift.id) return;
    if (!nurseData.id) {
      alert("Nurse information missing. Cannot accept shift.");
      return;
    }

    setLoading(true);
    setError(null);
    const input = {
      id: shift.id,
      status: 'ASSIGNED',
      nurseId: nurseData.id,
    };

    try {
      await client.graphql({
        query: updateShift,
        variables: { input }
      });
      alert(`Shift accepted: ${shift.id} for ${shift.clientName || 'client'} on ${shift.date}`);
      fetchAllShifts();
    } catch (err) {
      console.error('Error accepting shift:', err);
      setError(`Error accepting shift ${shift.id}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAssignment = (id) => {
    alert(`Cancel assignment ${id}`);
  };

  const handleViewAssignmentDetails = (id) => {
    alert(`View details for assignment ${id}`);
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading user information...</p>
      </div>
    );
  }

  // Show error state if no user data
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">Please log in to access the nurse dashboard.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-blue-500 p-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Nurse Portal</h1>
        <div className="flex items-center">
          <span className="text-white mr-4">Welcome, {nurseData.name}</span>
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
              {nurseData.verified ? 
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
              <div><span className="font-medium">License:</span> {nurseData.license}</div>
              <div><span className="font-medium">Specialization:</span> {nurseData.specialization}</div>
              <div><span className="font-medium">Experience:</span> {nurseData.experience}</div>
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
          {/* Loading and Error Display */}
          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}

          {activeSection === 'dashboard' && !loading && !error && (
            <div>
              <h2 className="text-xl font-bold mb-4">Dashboard</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="text-sm text-blue-500 font-medium">Upcoming Shifts</div>
                  <div className="text-2xl font-bold">{myShifts.filter(s => s.status === 'ASSIGNED' && new Date(s.date) >= new Date()).length}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="text-sm text-green-500 font-medium">Hours This Month</div>
                  <div className="text-2xl font-bold">--</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="text-sm text-purple-500 font-medium">Available Requests</div>
                  <div className="text-2xl font-bold">{availableShifts.length}</div>
                </div>
              </div>
              
              <h3 className="font-bold text-lg mb-2">Available Shifts</h3>
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
                    {availableShifts.length > 0 ? (
                      availableShifts.map(shift => (
                        <tr key={shift.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {shift.clientName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {shift.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {shift.startTime} - {shift.endTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800`}>
                              {shift.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => handleAcceptAssignment(shift)}
                              disabled={loading}
                            >
                              Accept
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No available shifts found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
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
                    {nurseData.availability && nurseData.availability.map(day => (
                      <span key={day} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {day}
                      </span>
                    ))}
                    {(!nurseData.availability || nurseData.availability.length === 0) && (
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
                          defaultChecked={nurseData.availability.includes(day)}
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
          
          {activeSection === 'assignments' && !loading && !error && (
            <div>
              <h2 className="text-xl font-bold mb-4">My Assignments</h2>
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
                    {myShifts.length > 0 ? (
                      myShifts.map(shift => (
                        <tr key={shift.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {shift.clientName || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {shift.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {shift.startTime} - {shift.endTime}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${shift.status === 'ASSIGNED' ? 'bg-green-100 text-green-800' :
                                shift.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                                'bg-yellow-100 text-yellow-800'}`}>
                              {shift.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {shift.status === 'ASSIGNED' && (
                              <button
                                className="text-red-600 hover:text-red-900 mr-2"
                                onClick={() => handleCancelAssignment(shift.id)}
                              >
                                Cancel
                              </button>
                            )}
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              onClick={() => handleViewAssignmentDetails(shift.id)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          You have no assigned shifts.
                        </td>
                      </tr>
                    )}
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
                    defaultValue={nurseData.name}
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
                    defaultValue={nurseData.email}
                    required
                  />
                </div>

                {/* Gender Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    className="w-full p-2 border rounded"
                    defaultValue={nurseData.gender}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>

                {/* Canadian Provinces */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Licensed Provinces
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {canadianProvinces.map(province => (
                      <label key={province} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          defaultChecked={nurseData.provinces.includes(province)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{province}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    defaultValue={nurseData.specialization}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    defaultValue={nurseData.experience}
                  />
                </div>

                {/* Document Upload Section */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Required Documents</h3>
                  
                  {/* License Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nursing License
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e, 'license')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                      {uploadStatus.license && (
                        <span className={`ml-2 text-sm ${
                          uploadStatus.license === 'success' ? 'text-green-600' :
                          uploadStatus.license === 'error' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {uploadStatus.license === 'uploading' ? 'Uploading...' :
                           uploadStatus.license === 'success' ? 'Uploaded' :
                           'Error'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* First Aid Certification */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Aid Certification
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e, 'firstAid')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                      {uploadStatus.firstAid && (
                        <span className={`ml-2 text-sm ${
                          uploadStatus.firstAid === 'success' ? 'text-green-600' :
                          uploadStatus.firstAid === 'error' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {uploadStatus.firstAid === 'uploading' ? 'Uploading...' :
                           uploadStatus.firstAid === 'success' ? 'Uploaded' :
                           'Error'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* TB Test */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      TB Test Results
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e, 'tbTest')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                      {uploadStatus.tbTest && (
                        <span className={`ml-2 text-sm ${
                          uploadStatus.tbTest === 'success' ? 'text-green-600' :
                          uploadStatus.tbTest === 'error' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {uploadStatus.tbTest === 'uploading' ? 'Uploading...' :
                           uploadStatus.tbTest === 'success' ? 'Uploaded' :
                           'Error'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Background Check */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Background Check
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e, 'backgroundCheck')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                      {uploadStatus.backgroundCheck && (
                        <span className={`ml-2 text-sm ${
                          uploadStatus.backgroundCheck === 'success' ? 'text-green-600' :
                          uploadStatus.backgroundCheck === 'error' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {uploadStatus.backgroundCheck === 'uploading' ? 'Uploading...' :
                           uploadStatus.backgroundCheck === 'success' ? 'Uploaded' :
                           'Error'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Resume */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resume
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e, 'resume')}
                        accept=".pdf,.doc,.docx"
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                      {uploadStatus.resume && (
                        <span className={`ml-2 text-sm ${
                          uploadStatus.resume === 'success' ? 'text-green-600' :
                          uploadStatus.resume === 'error' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {uploadStatus.resume === 'uploading' ? 'Uploading...' :
                           uploadStatus.resume === 'success' ? 'Uploaded' :
                           'Error'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* COVID Certificate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      COVID-19 Vaccination Certificate
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        onChange={(e) => handleFileUpload(e, 'covidCert')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                      {uploadStatus.covidCert && (
                        <span className={`ml-2 text-sm ${
                          uploadStatus.covidCert === 'success' ? 'text-green-600' :
                          uploadStatus.covidCert === 'error' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {uploadStatus.covidCert === 'uploading' ? 'Uploading...' :
                           uploadStatus.covidCert === 'success' ? 'Uploaded' :
                           'Error'}
                        </span>
                      )}
                    </div>
                  </div>
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