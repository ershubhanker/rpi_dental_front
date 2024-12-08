
import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Scheduler from '../Scheduler';


const style = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height:400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  zIndex: 1000,
  overflow: 'scroll',
};


const BasicModal=(props) => {

  const { sendDataToprops,open,handleClose,onPatientSelect  } = props;
  console.log("props data",sendDataToprops);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchParams, setSearchParams] = useState({
    first_name: "",
    last_name: "",
    age: "",
  });
  
  const [selectedPatients, setSelectedPatients] = useState([]);
  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    onPatientSelect(patient); // Pass selected patient to parent
    setSelectedPatient(null);
};

useEffect(() => {
  // Reset selected patients when modal is opened
  if (open) {
    setSelectedPatients([]);
  }
}, [open]);

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
    console.log('selected patient in basicmodal',patientId);
  };

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Select Patient
          </Typography>

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
              <td><button onClick={() => handlePatientClick(patient)}>Select</button></td>
            </tr>
            
          ))}
        </tbody>
      </table>
      
        </Box>
        
      </Modal>
     
    </div>
    
  );
}

export default BasicModal;
