import { useState, useEffect } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [users, setUsers] = useState([]);

  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyMessage, setPropertyMessage] = useState("");

  function changeName(e) {
    setName(e.target.value);
  }

  function changeEmail(e) {
    setEmail(e.target.value);
  }

  function changePassword(e) {
    setPassword(e.target.value);
  }

  async function submitForm(e) {
    e.preventDefault(); //prevents page from refreshing when we submit

    const response = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });

    const data = await response.json();
    setResponse(data.message);
    setName("");
    setEmail("");
    setPassword("");
    getAllUsers();
  }

  async function getAllUsers() {
    const response = await fetch("http://localhost:3000/api/users/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setUsers(data.users);
  }

  async function getAllProperties() {
    const response = await fetch("http://localhost:3000/api/properties/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    setProperties(data.properties || []);
  }

  async function fetchProperty(id) {
    const property = properties.find(p => p.id == id);
    if (property) {
      setSelectedProperty(property);
      setPropertyMessage("");
    } else {
      setSelectedProperty(null);
      setPropertyMessage("Property not found.");
    }
  }

  async function getPropertyById(e) {
    e.preventDefault();
    fetchProperty(selectedPropertyId);
  }

  async function deleteProperty(id) {
    setProperties(properties.filter(p => p.id != id));
    setPropertyMessage("Property deleted");
    if (selectedProperty?.id === id) {
      setSelectedProperty(null);
    }
  }

  useEffect(() => {
    getAllUsers();
    getAllProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">Real Estate Management System</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Manage your properties and team members with ease. Explore listings, add new members, and keep track of all your real estate assets.</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left Column - Sign Up Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg border-l-4 border-teal-400 p-10">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Create New Account</h3>
              <p className="text-gray-600 mb-10">Join our platform to manage your real estate portfolio</p>
              
              {response && (
                <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 text-green-800 rounded-lg text-lg font-medium">
                  {response}
                </div>
              )}

              <form onSubmit={submitForm} className="space-y-8">
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={changeName}
                    placeholder="Enter your full name"
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={changeEmail}
                    placeholder="your@email.com"
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-700 mb-3">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={changePassword}
                    placeholder="Create a strong password"
                    className="form-input w-full"
                  />
                </div>
                <div className="pt-4">
                  <button type="submit" className="px-8 py-4 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition shadow-md hover:shadow-lg">
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Users List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border-l-4 border-teal-400 p-8 h-fit sticky top-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Team Members</h3>
              <span className="inline-block bg-teal-100 text-teal-800 rounded-full px-4 py-2 text-base font-semibold mb-6">{users.length} Members</span>
              
              {users.length === 0 ? (
                <p className="text-gray-500 text-base">No team members yet</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {users.map((user) => (
                    <div key={user.id} className="user-item p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-base font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search Properties Section */}
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-teal-400 p-10 mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">Find Properties</h3>
          <p className="text-gray-600 mb-10">Search and filter through our available properties</p>
          
          <form onSubmit={getPropertyById} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3 uppercase tracking-wide">Property ID</label>
              <input
                type="number"
                value={selectedPropertyId}
                onChange={(e) => setSelectedPropertyId(e.target.value)}
                placeholder="Enter ID"
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3 uppercase tracking-wide">Title</label>
              <input
                type="text"
                placeholder="Property title"
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3 uppercase tracking-wide">Location</label>
              <input
                type="text"
                placeholder="Location"
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3 uppercase tracking-wide">Status</label>
              <select className="form-input w-full">
                <option>All Status</option>
                <option>Active</option>
                <option>Sold</option>
              </select>
            </div>
          </form>

          <div className="flex justify-start items-center gap-4">
            <button 
              onClick={getAllProperties}
              className="px-8 py-4 text-base font-bold text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-300 shadow-md hover:shadow-lg"
            >
              Reset
            </button>
            <button onClick={getPropertyById} className="px-8 py-4 text-base font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition shadow-md hover:shadow-lg">
              Search
            </button>
          </div>
        </div>

        {/* Message Alert */}
        {propertyMessage && (
          <div className="mb-6 p-5 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-lg text-lg font-semibold">
            {propertyMessage}
          </div>
        )}

        {/* Properties Table */}
        {properties.length > 0 && !selectedProperty && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-teal-400 mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-5 text-left text-base font-bold text-gray-900">ID</th>
                    <th className="px-6 py-5 text-left text-base font-bold text-gray-900">Title</th>
                    <th className="px-6 py-5 text-left text-base font-bold text-gray-900">Price</th>
                    <th className="px-6 py-5 text-left text-base font-bold text-gray-900">Location</th>
                    <th className="px-6 py-5 text-left text-base font-bold text-gray-900">Description</th>
                    <th className="px-6 py-5 text-left text-base font-bold text-gray-900">Status</th>
                    <th className="px-6 py-5 text-left text-base font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property, idx) => (
                    <tr key={property.id} className="border-b border-gray-200 hover:bg-gray-50 transition duration-200">
                      <td className="px-6 py-5 text-base text-gray-900">{idx + 1}</td>
                      <td className="px-6 py-5 text-base font-medium text-gray-900">{property.title}</td>
                      <td className="px-6 py-5 text-base font-bold text-teal-600">${property.price}</td>
                      <td className="px-6 py-5 text-base text-gray-600">{property.location}</td>
                      <td className="px-6 py-5 text-base text-gray-600 max-w-xs truncate">{property.description}</td>
                      <td className="px-6 py-5">
                        <span className="inline-block bg-green-100 text-green-800 text-sm font-bold px-4 py-2 rounded-full">Active</span>
                      </td>
                      <td className="px-6 py-5 text-base">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => fetchProperty(property.id)}
                            className="px-5 py-2.5 bg-teal-600 text-white text-sm font-bold rounded hover:bg-teal-700 transition shadow-md hover:shadow-lg"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => deleteProperty(property.id)}
                            className="px-5 py-2.5 bg-red-600 text-white text-sm font-bold rounded hover:bg-red-700 transition shadow-md hover:shadow-lg"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Selected Property Detail View */}
        {selectedProperty && (
          <div className="bg-white rounded-lg shadow-lg border-l-4 border-teal-400 p-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-5xl font-bold text-gray-900 mb-3">{selectedProperty.title}</h2>
                <p className="text-xl text-gray-600">{selectedProperty.location}</p>
              </div>
              <button 
                onClick={() => setSelectedProperty(null)}
                className="text-gray-400 hover:text-gray-600 text-3xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-600 text-base font-medium mb-2">Price</p>
                <p className="text-4xl font-bold text-teal-600">${selectedProperty.price}</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-600 text-base font-medium mb-2">Status</p>
                <p className="text-3xl font-bold text-green-600">Active</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-600 text-base font-medium mb-2">Location</p>
                <p className="text-2xl font-bold text-gray-900">{selectedProperty.location}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Description</h3>
              <p className="text-lg text-gray-700 leading-relaxed">{selectedProperty.description}</p>
            </div>

            {selectedProperty.image && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Image URL</h3>
                <p className="text-lg text-gray-700 break-all bg-gray-50 p-4 rounded border border-gray-200">{selectedProperty.image}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setSelectedProperty(null)}
                className="px-6 py-3 bg-gray-600 text-white text-base font-bold rounded-lg hover:bg-gray-700 transition shadow-md hover:shadow-lg"
              >
                Back
              </button>
              <button 
                onClick={() => deleteProperty(selectedProperty.id)}
                className="px-6 py-3 bg-red-600 text-white text-base font-bold rounded-lg hover:bg-red-700 transition shadow-md hover:shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedProperty && properties.length === 0 && (
          <div className="bg-white rounded-lg border-2 border-gray-300 p-16 text-center shadow-lg">
            <p className="text-gray-700 text-3xl font-bold mb-3">No Properties Yet</p>
            <p className="text-gray-600 text-xl">Start adding your properties to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

