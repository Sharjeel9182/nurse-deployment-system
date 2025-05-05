import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
// import { API, graphqlOperation } from 'aws-amplify'; // Old import
import { generateClient } from 'aws-amplify/api'; // New import
import { listShifts } from '../../graphql/queries'; // Assuming generated queries are here
import { createShift } from '../../graphql/mutations'; // Assuming generated mutations are here

const client = generateClient(); // Create the API client

// Mock data for a client (keep for now for clientId/Name until auth is integrated)
const mockClientData = {
  id: "client-placeholder-id", // Replace with actual ID post-auth
  name: 'City Hospital',
  email: 'client@example.com',
  role: 'client',
  verified: true,
  address: '123 Healthcare Ave',
  facility_type: 'Hospital',
  description: 'City Hospital providing comprehensive healthcare services',
  activeRequests: 2
};

// Remove mockNurseRequests and mockAvailableNurses
// const mockNurseRequests = [ ... ];
// const mockAvailableNurses = [ ... ];


const ClientDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentUser] = useState(mockClientData); // Keep for now
  const [shifts, setShifts] = useState([]); // Renamed state variable
  // const [availableNurses] = useState(mockAvailableNurses); // Remove or replace later
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const [nurseFilter, setNurseFilter] = useState({
    specialization: '',
    experience: '',
    availability: ''
  });

  // State for the new shift form
  const [newShiftDetails, setNewShiftDetails] = useState({
    specialization: '',
    date: '',
    startTime: '',
    endTime: '',
    rate: '',
    notes: ''
  });


  // Fetch shifts on component mount
  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Add filter by currentUser.id once auth is integrated
      // const filter = { clientId: { eq: currentUser.id } };
      // const shiftData = await API.graphql(graphqlOperation(listShifts)); // Old usage
      const shiftData = await client.graphql({ query: listShifts }); // New usage
      // Make sure the path to the shifts array is correct based on your query result structure
      const shiftsFromAPI = shiftData.data.listShifts.items;
      setShifts(shiftsFromAPI);
    } catch (err) {
      console.error('Error fetching shifts:', err);
      setError('Error fetching shifts. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleLogout = () => {
    alert('Logout functionality would be implemented here');
  };

  const handleViewRequestDetails = (id) => {
    alert(`View details for request ${id}`);
  };

  const handleCancelRequest = (id) => {
    alert(`Cancel request ${id}`);
  };

  const handleFilterNurses = () => {
    alert('Filter nurses with selected criteria');
  };

  const handleViewNurseProfile = (id) => {
    alert(`View profile for nurse ${id}`);
  };

  const handleRequestNurse = (id) => {
    alert(`Request nurse ${id}`);
  };

  // Handle input changes for the new request form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShiftDetails(prev => ({ ...prev, [name]: value }));
  };

  // Handle creation of a new shift request
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!currentUser.id || !currentUser.name) {
        alert("Client information is missing."); // Should not happen with placeholder
        return;
    }
    setLoading(true);
    setError(null);

    const input = {
      ...newShiftDetails,
      clientId: currentUser.id, // Use placeholder ID for now
      clientName: currentUser.name, // Use placeholder name for now
      status: 'OPEN', // Default status from schema
      rate: parseFloat(newShiftDetails.rate) || null, // Ensure rate is a float or null
    };

    // Basic validation (can be expanded)
    if (!input.specialization || !input.date || !input.startTime || !input.endTime) {
        alert("Please fill in all required fields (Specialization, Date, Start Time, End Time).");
        setLoading(false);
        return;
    }

    try {
      // await API.graphql(graphqlOperation(createShift, { input })); // Old usage
      await client.graphql({ // New usage
        query: createShift,
        variables: { input }
      });
      setShowRequestForm(false); // Close modal on success
      setNewShiftDetails({ // Reset form
        specialization: '',
        date: '',
        startTime: '',
        endTime: '',
        rate: '',
        notes: ''
      });
      fetchShifts(); // Refetch shifts to show the new one
    } catch (err) {
      console.error('Error creating shift:', err);
      setError('Error creating shift request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="bg-green-600 p-4 flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Client Portal</h1>
        <div className="flex items-center">
          <span className="text-white mr-4">Welcome, {currentUser.name}</span>
          <button
            onClick={handleLogout}
            className="bg-white text-green-600 px-4 py-1 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 p-4">
          <div className="mb-4">
            <div className="font-bold text-gray-700">Facility Information</div>
            <div className="mt-1 text-sm">
              <div><span className="font-medium">Address:</span> {currentUser.address}</div>
              <div><span className="font-medium">Active Requests:</span> {currentUser.activeRequests}</div>
            </div>
          </div>
          
          <ul className="space-y-2">
            <li>
              <button
                className={`w-full text-left p-2 rounded ${activeSection === 'dashboard' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveSection('dashboard')}
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${activeSection === 'requests' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveSection('requests')}
              >
                Nurse Requests
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${activeSection === 'find-nurses' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveSection('find-nurses')}
              >
                Find Nurses
              </button>
            </li>
            <li>
              <button
                className={`w-full text-left p-2 rounded ${activeSection === 'profile' ? 'bg-green-100 text-green-600' : 'hover:bg-gray-200'}`}
                onClick={() => setActiveSection('profile')}
              >
                Facility Profile
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
                  <div className="text-sm text-blue-500 font-medium">Active Requests</div>
                  <div className="text-2xl font-bold">{shifts.filter(s => s.status === 'OPEN' || s.status === 'PENDING').length}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="text-sm text-green-500 font-medium">Filled Positions</div>
                  <div className="text-2xl font-bold">{shifts.filter(s => s.status === 'ASSIGNED').length}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <div className="text-sm text-yellow-500 font-medium">Pending Confirmations</div>
                  <div className="text-2xl font-bold">{shifts.filter(s => s.status === 'PENDING').length}</div>
                </div>
              </div>
              
              <h3 className="font-bold text-lg mb-2">Recent Nurse Requests</h3>
              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specialization
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
                    {shifts.length > 0 ? (
                      shifts.slice(0, 5).map(shift => (
                        <tr key={shift.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {shift.specialization}
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
                                shift.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                shift.status === 'OPEN' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'}`}>
                              {shift.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {shift.status === 'OPEN' ? (
                              <button 
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => handleViewRequestDetails(shift.id)}
                              >
                                Edit
                              </button>
                            ) : shift.status === 'PENDING' ? (
                              <button 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleCancelRequest(shift.id)}
                              >
                                Cancel
                              </button>
                            ) : (
                              <button 
                                className="text-gray-500"
                                disabled
                              >
                                View
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                          No nurse requests found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {shifts.length > 5 && (
                  <div className="px-6 py-3 bg-gray-50 text-right">
                    <button 
                      className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      onClick={() => setActiveSection('requests')}
                    >
                      View all requests
                    </button>
                  </div>
                )}
              </div>
              
              <h3 className="font-bold text-lg mt-6 mb-2">Upcoming Shifts</h3>
              <div className="bg-white rounded-lg border p-4">
                {shifts.filter(s => s.status === 'ASSIGNED' && new Date(s.date) >= new Date()).length > 0 ? (
                  <div className="space-y-3">
                    {shifts
                      .filter(s => s.status === 'ASSIGNED' && new Date(s.date) >= new Date())
                      .slice(0, 3)
                      .map(shift => (
                        <div key={shift.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{shift.specialization} Nurse</div>
                            <div className="text-sm text-gray-500">{shift.date} • {shift.startTime} - {shift.endTime}</div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-green-600">Nurse Assigned</span>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                ) : (
                  <p className="text-gray-500">No confirmed shifts coming up.</p>
                )}
                <button 
                  className="mt-2 text-blue-600 hover:text-blue-900 text-sm font-medium flex items-center"
                  onClick={() => setActiveSection('requests')}
                >
                  View all schedules
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          {activeSection === 'requests' && !loading && !error && (
            <div>
              <h2 className="text-xl font-bold mb-4">Nurse Requests</h2>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-600">Manage your nurse staffing requests</p>
                <button 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  onClick={() => setShowRequestForm(true)}
                >
                  Create New Request
                </button>
              </div>
              
              <div className="bg-white rounded-lg border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Specialization
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
                        Applicants/Nurse
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {shifts.map(shift => (
                      <tr key={shift.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {shift.specialization}
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
                              shift.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              shift.status === 'OPEN' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'}`}>
                            {shift.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {shift.status === 'ASSIGNED' ?
                            'Nurse Assigned' :
                            shift.status === 'OPEN' ?
                             'Open' :
                             shift.status
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {shift.status === 'OPEN' ? (
                            <button
                              className="text-blue-600 hover:text-blue-900 mr-2"
                              onClick={() => handleViewRequestDetails(shift.id)}
                            >
                              Edit
                            </button>
                          ) : null }
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleCancelRequest(shift.id)}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Commenting out Find Nurses section as it's not functional yet */}
          {/* {activeSection === 'find-nurses' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Find Nurses</h2>

              <div className="mb-6">
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={nurseFilter.specialization}
                      onChange={(e) => setNurseFilter({...nurseFilter, specialization: e.target.value})}
                    >
                      <option value="">Any Specialization</option>
                      <option value="ICU">ICU</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Emergency">Emergency</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={nurseFilter.experience}
                      onChange={(e) => setNurseFilter({...nurseFilter, experience: e.target.value})}
                    >
                      <option value="">Any Experience</option>
                      <option value="1+">1+ years</option>
                      <option value="3+">3+ years</option>
                      <option value="5+">5+ years</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Availability
                    </label>
                    <select
                      className="w-full p-2 border rounded"
                      value={nurseFilter.availability}
                      onChange={(e) => setNurseFilter({...nurseFilter, availability: e.target.value})}
                    >
                      <option value="">Any Day</option>
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>
                </div>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  onClick={handleFilterNurses}
                >
                  Search
                </button>
              </div>

              <h3 className="font-bold text-lg mb-2">Available Nurses</h3>
              <div className="grid grid-cols-2 gap-4">
                {availableNurses.map(nurse => (
                  <div key={nurse.id} className="bg-white p-4 rounded-lg border">
                    <div className="flex justify-between">
                      <h4 className="font-bold">{nurse.name}</h4>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span>{nurse.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <div><span className="font-medium">Specialization:</span> {nurse.specialization}</div>
                      <div><span className="font-medium">Experience:</span> {nurse.experience}</div>
                    </div>
                    <div className="mt-3 flex justify-between">
                      <button
                        className="text-blue-600 hover:text-blue-900 text-sm"
                        onClick={() => handleViewNurseProfile(nurse.id)}
                      >
                        View Profile
                      </button>
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded"
                        onClick={() => handleRequestNurse(nurse.id)}
                      >
                        Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {activeSection === 'profile' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Facility Profile</h2>
              <form className="space-y-4 bg-white p-6 rounded-lg border">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facility Name
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
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    defaultValue={currentUser.address}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facility Type
                  </label>
                  <select
                    className="w-full p-2 border rounded"
                    defaultValue={currentUser.facility_type}
                    required
                  >
                    <option value="Hospital">Hospital</option>
                    <option value="Nursing Home">Nursing Home</option>
                    <option value="Clinic">Clinic</option>
                    <option value="Rehabilitation Center">Rehabilitation Center</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facility Description
                  </label>
                  <textarea
                    className="w-full p-2 border rounded h-32"
                    defaultValue={currentUser.description}
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      
      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Create New Nurse Request</h3>
                <button onClick={() => setShowRequestForm(false)} className="text-gray-400 hover:text-gray-600">
                   &times;
                </button>
              </div>

              {/* Form using handleCreateRequest */}
              <form onSubmit={handleCreateRequest}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization*
                  </label>
                  <select
                    name="specialization"
                    value={newShiftDetails.specialization}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Specialization</option>
                    <option value="ICU">ICU</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Emergency">Emergency</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date*
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={newShiftDetails.date}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time*
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={newShiftDetails.startTime}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time*
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={newShiftDetails.endTime}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>

                {/* Optional fields */}
                 <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    name="rate"
                    value={newShiftDetails.rate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., 50.00"
                    step="0.01"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={newShiftDetails.notes}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows="3"
                    placeholder="Any specific requirements or instructions..."
                  ></textarea>
                </div>


                <div className="items-center px-4 py-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
                 {error && <p className="text-center text-red-500 mt-2">{error}</p>}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ClientDashboardWrapper = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <ClientDashboard />
      </div>
    </div>
  );
};

export default ClientDashboardWrapper;