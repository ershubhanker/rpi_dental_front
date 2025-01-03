import React, { useState, useEffect } from "react";
import Scheduler from '../Scheduler';

const Selectpatient = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    first_name: "",
    last_name: "",
    age: "",
  });
  const [selectedPatients, setSelectedPatients] = useState([]);
  
  useEffect(() => {
    // Fetch all patients from the API
    fetch("http://127.0.0.1:8000/api/patients/")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPatients(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const fetchPatients = (query = "") => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/patients/search/?${query}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPatients(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(
      Object.entries(searchParams).filter(([_, value]) => value)
    ).toString();
    fetchPatients(query);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (patientId) => {
    setSelectedPatients((prevSelected) =>
      prevSelected.includes(patientId)
        ? prevSelected.filter((id) => id !== patientId) // Deselect
        : [...prevSelected, patientId] // Select
    );
    console.log('selected patient',patientId);
  };

  return (
    <div>
      <h1>Patients List</h1>

      <form onSubmit={handleSearch}>
        <div>
          <label>
            First Name:
            <input
              type="text"
              name="first_name"
              value={searchParams.first_name}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Last Name:
            <input
              type="text"
              name="last_name"
              value={searchParams.last_name}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Age:
            <input
              type="number"
              name="age"
              value={searchParams.age}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <button type="submit">Search</button>
      </form>

      <table
        border="1"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          marginTop: "20px",
        }}
      >
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Age</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.patient_id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedPatients.includes(patient.patient_id)}
                  onChange={() => handleCheckboxChange(patient.patient_id)}
                />
              </td>
              <td>{patient.patient_id}</td>
              <td>{patient.first_name}</td>
              <td>{patient.last_name}</td>
              <td>{patient.age}</td>
              <td>{patient.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <Scheduler selectedPatients={selectedPatients} /> */}
      {selectedPatients.length > 0 && (
        <button
          
          style={{
            marginTop: "20px",
            padding: "10px 15px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Select Patients
        </button>
      )}
    </div>
  );
};

export default Selectpatient;
