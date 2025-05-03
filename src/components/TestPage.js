// src/components/TestPage.js
import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createUser, createAssignment, createVerification, updateUser, updateAssignment } from '../graphql/mutations';
import { getUser, listUsers, listAssignments, listVerifications } from '../graphql/queries';
import { 
  signUp, 
  signIn, 
  signOut, 
  fetchUserAttributes,
  confirmSignUp as confirmUserSignUp,
  updateUserAttributes
} from '@aws-amplify/auth';

const client = generateClient();

function TestPage() {
  const [results, setResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Auth Testing
  const testSignUp = async () => {
    setLoading(true);
    
    const email = prompt("Enter email address:");
    if (!email) {
      setResults("Sign up cancelled");
      setLoading(false);
      return;
    }
    
    const password = prompt("Enter password (min 8 chars, including uppercase, number, special character):");
    if (!password) {
      setResults("Sign up cancelled");
      setLoading(false);
      return;
    }
    
    const role = prompt("Enter user role (nurse, client, or admin):");
    if (!['nurse', 'client', 'admin'].includes(role)) {
      setResults("Invalid role. Please use nurse, client, or admin");
      setLoading(false);
      return;
    }
    
    try {
      const result = await signUp({
        username: email,
        password,
        attributes: {
          email,
          'custom:role': role
        }
      });
      setResults(JSON.stringify(result, null, 2));
    } catch (error) {
      setResults(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const confirmSignUp = async () => {
    setLoading(true);
    
    const email = prompt("Enter the email address you registered with:");
    if (!email) {
      setResults("Verification cancelled");
      setLoading(false);
      return;
    }
    
    const code = prompt("Enter the verification code from your email:");
    if (!code) {
      setResults("Verification cancelled");
      setLoading(false);
      return;
    }
    
    try {
      // Updated to use the correct parameter format for Amplify v6
      const result = await confirmUserSignUp({
        username: email,
        confirmationCode: code
      });
      
      setResults(JSON.stringify(result, null, 2));
      alert("Email verified successfully! You can now sign in.");
    } catch (error) {
      setResults(`Error confirming sign up: ${error.message}`);
    }
    setLoading(false);
  };

  const testSignIn = async () => {
    setLoading(true);
    try {
      const email = prompt("Enter your email:");
      if (!email) {
        setResults("Sign in cancelled");
        setLoading(false);
        return;
      }
      
      const password = prompt("Enter your password:");
      if (!password) {
        setResults("Sign in cancelled");
        setLoading(false);
        return;
      }
      
      const result = await signIn({
        username: email,
        password
      });
      
      const attributes = await fetchUserAttributes();
      setCurrentUser({ ...result, attributes });
      setResults(JSON.stringify({user: result, attributes}, null, 2));
    } catch (error) {
      setResults(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      setCurrentUser(null);
      setResults("Signed out successfully");
    } catch (error) {
      setResults(`Error signing out: ${error.message}`);
    }
    setLoading(false);
  };

  // User Management
  const testCreateUser = async () => {
    setLoading(true);
    try {
      const userType = prompt("Create which type of user? (nurse/client)");
      if (!['nurse', 'client'].includes(userType)) {
        setResults("Invalid user type. Please use nurse or client");
        setLoading(false);
        return;
      }

      let newUser = {
        name: prompt("Enter name:") || "Test User",
        email: prompt("Enter email:") || "test@example.com",
        role: userType,
        verified: true
      };
      
      // Add role-specific attributes
      if (userType === 'nurse') {
        newUser = {
          ...newUser,
          license: prompt("Enter license number:") || "RN12345",
          specialization: prompt("Enter specialization:") || "ICU",
          experience: prompt("Enter years of experience:") || "5 years",
          availability: prompt("Enter availability (comma-separated days):") || "Monday,Wednesday,Friday"
        };
        if (typeof newUser.availability === 'string') {
          newUser.availability = newUser.availability.split(',').map(day => day.trim());
        }
      } else if (userType === 'client') {
        newUser = {
          ...newUser,
          facility_type: prompt("Enter facility type:") || "Hospital",
          address: prompt("Enter address:") || "123 Healthcare Ave",
          description: prompt("Enter description:") || "Healthcare facility"
        };
      }
      
      const result = await client.graphql({
        query: createUser,
        variables: { input: newUser }
      });
      
      setResults(JSON.stringify(result.data.createUser, null, 2));
    } catch (error) {
      setResults(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testUpdateUser = async () => {
    setLoading(true);
    try {
      // First get users to select from
      const usersResult = await client.graphql({
        query: listUsers
      });
      
      const users = usersResult.data.listUsers.items;
      if (users.length === 0) {
        setResults("No users found to update");
        setLoading(false);
        return;
      }
      
      // Create a user selection prompt
      let userOptions = "Select a user to update:\n";
      users.forEach((user, index) => {
        userOptions += `${index + 1}. ${user.name} (${user.email}) - ${user.role}\n`;
      });
      
      const selection = prompt(userOptions);
      if (!selection) {
        setResults("Update cancelled");
        setLoading(false);
        return;
      }
      
      const selectedIndex = parseInt(selection) - 1;
      if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= users.length) {
        setResults("Invalid selection");
        setLoading(false);
        return;
      }
      
      const selectedUser = users[selectedIndex];
      
      // Update user fields
      const updatedFields = {
        id: selectedUser.id,
        name: prompt("Enter new name (leave empty to keep current):", selectedUser.name) || selectedUser.name
      };
      
      if (selectedUser.role === 'nurse') {
        const newSpecialization = prompt("Enter new specialization (leave empty to keep current):", selectedUser.specialization);
        if (newSpecialization) updatedFields.specialization = newSpecialization;
        
        const newExperience = prompt("Enter new experience (leave empty to keep current):", selectedUser.experience);
        if (newExperience) updatedFields.experience = newExperience;
      } else if (selectedUser.role === 'client') {
        const newDescription = prompt("Enter new description (leave empty to keep current):", selectedUser.description);
        if (newDescription) updatedFields.description = newDescription;
        
        const newAddress = prompt("Enter new address (leave empty to keep current):", selectedUser.address);
        if (newAddress) updatedFields.address = newAddress;
      }
      
      const result = await client.graphql({
        query: updateUser,
        variables: { input: updatedFields }
      });
      
      setResults(JSON.stringify(result.data.updateUser, null, 2));
    } catch (error) {
      setResults(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  // Assignment Management
  const testCreateAssignment = async () => {
    setLoading(true);
    try {
      // Get nurses and clients
      const nursesResult = await client.graphql({
        query: listUsers,
        variables: { filter: { role: { eq: "nurse" } } }
      });
      
      const clientsResult = await client.graphql({
        query: listUsers,
        variables: { filter: { role: { eq: "client" } } }
      });
      
      const nurses = nursesResult.data.listUsers.items;
      const clients = clientsResult.data.listUsers.items;
      
      if (nurses.length === 0) {
        setResults("No nurses found. Create a nurse user first.");
        setLoading(false);
        return;
      }
      
      if (clients.length === 0) {
        setResults("No clients found. Create a client user first.");
        setLoading(false);
        return;
      }
      
      // Create nurse selection prompt
      let nurseOptions = "Select a nurse (or leave empty for unassigned):\n";
      nurses.forEach((nurse, index) => {
        nurseOptions += `${index + 1}. ${nurse.name} - ${nurse.specialization || 'No specialization'}\n`;
      });
      
      // Create client selection prompt
      let clientOptions = "Select a client:\n";
      clients.forEach((client, index) => {
        clientOptions += `${index + 1}. ${client.name} - ${client.facility_type || 'Facility'}\n`;
      });
      
      const clientSelection = prompt(clientOptions);
      if (!clientSelection) {
        setResults("Assignment creation cancelled");
        setLoading(false);
        return;
      }
      
      const selectedClientIndex = parseInt(clientSelection) - 1;
      if (isNaN(selectedClientIndex) || selectedClientIndex < 0 || selectedClientIndex >= clients.length) {
        setResults("Invalid client selection");
        setLoading(false);
        return;
      }
      
      const selectedClient = clients[selectedClientIndex];
      let selectedNurse = null;
      
      const nurseSelection = prompt(nurseOptions);
      if (nurseSelection) {
        const selectedNurseIndex = parseInt(nurseSelection) - 1;
        if (!isNaN(selectedNurseIndex) && selectedNurseIndex >= 0 && selectedNurseIndex < nurses.length) {
          selectedNurse = nurses[selectedNurseIndex];
        }
      }
      
      // Create a new assignment
      const newAssignment = {
        clientId: selectedClient.id,
        nurseId: selectedNurse ? selectedNurse.id : null,
        specialization: prompt("Enter required specialization:") || "ICU",
        date: prompt("Enter date (YYYY-MM-DD):") || "2025-05-01",
        shift: prompt("Enter shift (Morning/Evening/Night):") || "Morning (7am-3pm)",
        status: selectedNurse ? "Confirmed" : "Open"
      };
      
      const result = await client.graphql({
        query: createAssignment,
        variables: { input: newAssignment }
      });
      
      setResults(JSON.stringify(result.data.createAssignment, null, 2));
    } catch (error) {
      setResults(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testUpdateAssignment = async () => {
    setLoading(true);
    try {
      // First get assignments to select from
      const assignmentsResult = await client.graphql({
        query: listAssignments
      });
      
      const assignments = assignmentsResult.data.listAssignments.items;
      if (assignments.length === 0) {
        setResults("No assignments found to update");
        setLoading(false);
        return;
      }
      
      // Create an assignment selection prompt
      let assignmentOptions = "Select an assignment to update:\n";
      assignments.forEach((assignment, index) => {
        assignmentOptions += `${index + 1}. ${assignment.specialization} on ${assignment.date} - ${assignment.status}\n`;
      });
      
      const selection = prompt(assignmentOptions);
      if (!selection) {
        setResults("Update cancelled");
        setLoading(false);
        return;
      }
      
      const selectedIndex = parseInt(selection) - 1;
      if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= assignments.length) {
        setResults("Invalid selection");
        setLoading(false);
        return;
      }
      
      const selectedAssignment = assignments[selectedIndex];
      
      // Get status options
      const newStatus = prompt("Enter new status (Open, Pending, Confirmed, Completed):", selectedAssignment.status);
      if (!newStatus) {
        setResults("Update cancelled");
        setLoading(false);
        return;
      }
      
      // Update assignment
      const updatedFields = {
        id: selectedAssignment.id,
        status: newStatus
      };
      
      // If status is Confirmed, make sure a nurse is assigned
      if (newStatus === 'Confirmed' && !selectedAssignment.nurseId) {
        const nursesResult = await client.graphql({
          query: listUsers,
          variables: { filter: { role: { eq: "nurse" } } }
        });
        
        const nurses = nursesResult.data.listUsers.items;
        if (nurses.length === 0) {
          setResults("No nurses found. Cannot confirm without a nurse.");
          setLoading(false);
          return;
        }
        
        // Create nurse selection prompt
        let nurseOptions = "Select a nurse to assign:\n";
        nurses.forEach((nurse, index) => {
          nurseOptions += `${index + 1}. ${nurse.name} - ${nurse.specialization || 'No specialization'}\n`;
        });
        
        const nurseSelection = prompt(nurseOptions);
        if (!nurseSelection) {
          setResults("Update cancelled - nurse required for confirmation");
          setLoading(false);
          return;
        }
        
        const selectedNurseIndex = parseInt(nurseSelection) - 1;
        if (isNaN(selectedNurseIndex) || selectedNurseIndex < 0 || selectedNurseIndex >= nurses.length) {
          setResults("Invalid nurse selection");
          setLoading(false);
          return;
        }
        
        updatedFields.nurseId = nurses[selectedNurseIndex].id;
      }
      
      const result = await client.graphql({
        query: updateAssignment,
        variables: { input: updatedFields }
      });
      
      setResults(JSON.stringify(result.data.updateAssignment, null, 2));
    } catch (error) {
      setResults(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  // Verification Testing
  const testCreateVerification = async () => {
    setLoading(true);
    try {
      // First get users to select from
      const usersResult = await client.graphql({
        query: listUsers
      });
      
      const users = usersResult.data.listUsers.items;
      if (users.length === 0) {
        setResults("No users found to create verification for");
        setLoading(false);
        return;
      }
      
      // Create a user selection prompt
      let userOptions = "Select a user to create verification for:\n";
      users.forEach((user, index) => {
        userOptions += `${index + 1}. ${user.name} (${user.email}) - ${user.role}\n`;
      });
      
      const selection = prompt(userOptions);
      if (!selection) {
        setResults("Verification creation cancelled");
        setLoading(false);
        return;
      }
      
      const selectedIndex = parseInt(selection) - 1;
      if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= users.length) {
        setResults("Invalid selection");
        setLoading(false);
        return;
      }
      
      const selectedUser = users[selectedIndex];
      
      // Create a new verification
      const newVerification = {
        userId: selectedUser.id,
        name: selectedUser.name,
        role: selectedUser.role,
        identifier: selectedUser.role === 'nurse' 
          ? prompt("Enter license number:") || selectedUser.license || "RN12345" 
          : "Facility",
        submissionDate: new Date().toISOString().split('T')[0],
        status: "Pending"
      };
      
      const result = await client.graphql({
        query: createVerification,
        variables: { input: newVerification }
      });
      
      setResults(JSON.stringify(result.data.createVerification, null, 2));
    } catch (error) {
      setResults(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  // Data Retrieval
  const testGetUser = async () => {
    setLoading(true);
    try {
      // First get users to select from
      const usersResult = await client.graphql({
        query: listUsers
      });
      
      const users = usersResult.data.listUsers.items;
      if (users.length === 0) {
        setResults("No users found");
        setLoading(false);
        return;
      }
      
      // Create a user selection prompt
      let userOptions = "Select a user to view details:\n";
      users.forEach((user, index) => {
        userOptions += `${index + 1}. ${user.name} (${user.email}) - ${user.role}\n`;
      });
      
      const selection = prompt(userOptions);
      if (!selection) {
        setResults("Operation cancelled");
        setLoading(false);
        return;
      }
      
      const selectedIndex = parseInt(selection) - 1;
      if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= users.length) {
        setResults("Invalid selection");
        setLoading(false);
        return;
      }
      
      const selectedUser = users[selectedIndex];
      
      // Get user by ID
      const result = await client.graphql({
        query: getUser,
        variables: { id: selectedUser.id }
      });
      
      setResults(JSON.stringify(result.data.getUser, null, 2));
    } catch (error) {
      setResults(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testListUsers = async () => {
    setLoading(true);
    try {
      // Option to filter by role
      const filterRole = prompt("Filter by role? (nurse/client/admin/all):");
      let variables = {};
      
      if (filterRole && filterRole !== 'all') {
        variables = {
          filter: { role: { eq: filterRole } }
        };
      }
      
      const result = await client.graphql({
        query: listUsers,
        variables
      });
      
      setResults(JSON.stringify(result.data.listUsers.items, null, 2));
    } catch (error) {
      setResults(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testListAssignments = async () => {
    setLoading(true);
    try {
      // Option to filter by status
      const filterStatus = prompt("Filter by status? (Open/Pending/Confirmed/Completed/all):");
      let variables = {};
      
      if (filterStatus && filterStatus !== 'all') {
        variables = {
          filter: { status: { eq: filterStatus } }
        };
      }
      
      const result = await client.graphql({
        query: listAssignments,
        variables
      });
      
      setResults(JSON.stringify(result.data.listAssignments.items, null, 2));
    } catch (error) {
      setResults(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const testListVerifications = async () => {
    setLoading(true);
    try {
      const result = await client.graphql({
        query: listVerifications
      });
      
      setResults(JSON.stringify(result.data.listVerifications.items, null, 2));
    } catch (error) {
      setResults(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AWS Backend Testing</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border p-4 rounded">
          <h2 className="text-lg font-bold mb-2">Authentication</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={testSignUp} className="bg-blue-500 text-white px-4 py-2 rounded">
              Sign Up
            </button>
            <button onClick={confirmSignUp} className="bg-teal-500 text-white px-4 py-2 rounded">
              Verify Code
            </button>
            <button onClick={testSignIn} className="bg-green-500 text-white px-4 py-2 rounded">
              Sign In
            </button>
            <button onClick={handleSignOut} className="bg-red-500 text-white px-4 py-2 rounded">
              Sign Out
            </button>
          </div>
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-lg font-bold mb-2">User Management</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={testCreateUser} className="bg-purple-500 text-white px-4 py-2 rounded">
              Create User
            </button>
            <button onClick={testUpdateUser} className="bg-indigo-500 text-white px-4 py-2 rounded">
              Update User
            </button>
            <button onClick={testGetUser} className="bg-blue-400 text-white px-4 py-2 rounded">
              Get User Details
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border p-4 rounded">
          <h2 className="text-lg font-bold mb-2">Assignment Management</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={testCreateAssignment} className="bg-green-600 text-white px-4 py-2 rounded">
              Create Assignment
            </button>
            <button onClick={testUpdateAssignment} className="bg-yellow-500 text-white px-4 py-2 rounded">
              Update Assignment
            </button>
          </div>
        </div>
        
        <div className="border p-4 rounded">
          <h2 className="text-lg font-bold mb-2">Verification Management</h2>
          <div className="flex flex-wrap gap-2">
            <button onClick={testCreateVerification} className="bg-pink-500 text-white px-4 py-2 rounded">
              Create Verification
            </button>
          </div>
        </div>
      </div>
      
      <div className="border p-4 rounded mb-6">
        <h2 className="text-lg font-bold mb-2">Data Retrieval</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={testListUsers} className="bg-yellow-500 text-white px-4 py-2 rounded">
            List Users
          </button>
          <button onClick={testListAssignments} className="bg-orange-500 text-white px-4 py-2 rounded">
            List Assignments
          </button>
          <button onClick={testListVerifications} className="bg-red-400 text-white px-4 py-2 rounded">
            List Verifications
          </button>
        </div>
      </div>
      
      <div className="border p-4 rounded">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold">Results:</h2>
          {currentUser && (
            <div className="text-sm bg-green-100 p-2 rounded">
              Logged in as: {currentUser.attributes.email} ({currentUser.attributes['custom:role']})
            </div>
          )}
        </div>
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Processing...</span>
          </div>
        ) : (
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {results || "No results yet"}
          </pre>
        )}
      </div>
    </div>
  );
}

export default TestPage;