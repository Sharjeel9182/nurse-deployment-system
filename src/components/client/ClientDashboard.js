import React, { useState } from 'react';

// Mock data for a client
const mockClientData = {
  id: 3,
  name: 'City Hospital',
  email: 'client@example.com',
  role: 'client',
  verified: true,
  address: '123 Healthcare Ave',
  facility_type: 'Hospital',
  description: 'City Hospital providing comprehensive healthcare services',
  activeRequests: 2
};

// Mock nurse requests data
const mockNurseRequests = [
  {
    id: 1,
    specialization: 'ICU',
    date: '2025-04-15',
    shift: 'Morning (7am-3pm)',
    status: 'Confirmed',
    applicants: 3,
    nurseAssigned: 'Sarah Johnson'
  },
  {
    id: 2,
    specialization: 'General',
    date: '2025-04-20',
    shift: 'Evening (3pm-11pm)',
    status: 'Pending',
    applicants: 2,
    nurseAssigned: null
  },
  {
    id: 3,
    specialization: 'Pediatrics',
    date: '2025-04-25',
    shift: 'Night (11pm-7am)',
    status: 'Open',
    applicants: 0,
    nurseAssigned: null
  }
];

// Mock available nurses data
const mockAvailableNurses = [
  {
    id: 1,
    name: 'Sarah Johnson',
    specialization: 'ICU',
    experience: '5 years',
    rating: 4.8
  },
  {
    id: 2,
    name: 'Michael Chen',
    specialization: 'Pediatrics',
    experience: '3 years',
    rating: 4.5
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    specialization: 'Emergency',
    experience: '7 years',
    rating: 4.9
  },
  {
    id: 4,
    name: 'James Wilson',
    specialization: 'General',
    experience: '4 years',
    rating: 4.2
  }
];

const ClientDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [currentUser] = useState(mockClientData);
  const [nurseRequests] = useState(mockNurseRequests);
  const [availableNurses] = useState(mockAvailableNurses);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [nurseFilter, setNurseFilter] = useState({
    specialization: '',
    experience: '',
    availability: ''
  });

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
          {activeSection === 'dashboard' && (
            <div>
              <h2 className="text-xl font-bold mb-4">Dashboard</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="text-sm text-blue-500 font-medium">Active Requests</div>
                  <div className="text-2xl font-bold">{nurseRequests.filter(r => r.status !== 'Filled').length}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="text-sm text-green-500 font-medium">Filled Positions</div>
                  <div className="text-2xl font-bold">{nurseRequests.filter(r => r.status === 'Confirmed').length}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                  <div className="text-sm text-yellow-500 font-medium">Pending Confirmations</div>
                  <div className="text-2xl font-bold">{nurseRequests.filter(r => r.status === 'Pending').length}</div>
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
                    {nurseRequests.length > 0 ? (
                      nurseRequests.slice(0, 5).map(request => (
                        <tr key={request.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {request.specialization}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.shift}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${request.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                                request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-blue-100 text-blue-800'}`}>
                              {request.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {request.status === 'Open' ? (
                              <button 
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => handleViewRequestDetails(request.id)}
                              >
                                Edit
                              </button>
                            ) : request.status === 'Pending' ? (
                              <button 
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => handleViewRequestDetails(request.id)}
                              >
                                View ({request.applicants})
                              </button>
                            ) : (
                              <button 
                                className="text-blue-600 hover:text-blue-900"
                                onClick={() => handleViewRequestDetails(request.id)}
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
                          No nurse requests found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                {nurseRequests.length > 5 && (
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
                {nurseRequests.filter(r => r.status === 'Confirmed' && new Date(r.date) >= new Date()).length > 0 ? (
                  <div className="space-y-3">
                    {nurseRequests
                      .filter(r => r.status === 'Confirmed')
                      .slice(0, 3)
                      .map(request => (
                        <div key={request.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                          <div>
                            <div className="font-medium">{request.specialization} Nurse</div>
                            <div className="text-sm text-gray-500">{request.date} • {request.shift}</div>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-green-600">{request.nurseAssigned}</span>
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
          
          {activeSection === 'requests' && (
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
                    {nurseRequests.map(request => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.specialization}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.shift}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${request.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                              request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-blue-100 text-blue-800'}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.status === 'Confirmed' ? 
                            request.nurseAssigned : 
                            `${request.applicants} applicant(s)`
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-2">
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => handleViewRequestDetails(request.id)}
                          >
                            View
                          </button>
                          {request.status !== 'Confirmed' && (
                            <button 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleCancelRequest(request.id)}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeSection === 'find-nurses' && (
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
          )}
          
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Create Nurse Request</h3>
              <button 
                onClick={() => setShowRequestForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Request submitted!');
              setShowRequestForm(false);
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <select
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
                  Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift
                </label>
                <select
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Shift</option>
                  <option value="Morning (7am-3pm)">Morning (7am-3pm)</option>
                  <option value="Evening (3pm-11pm)">Evening (3pm-11pm)</option>
                  <option value="Night (11pm-7am)">Night (11pm-7am)</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  Create Request
                </button>
              </div>
            </form>
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