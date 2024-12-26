import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
// import Scheduler from '../Scheduler';


const style = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  height:500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  zIndex: 1000,
  overflow: 'scroll',
};

function ChildModal(props) {

  const {oncodeSelect} = props;

  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCodes, setselectedCodes] = useState([]);
  const [isPCModalOpen, setIsPCModalOpen] = useState(false);
  
      const PChandleOpen = () => {
        
        setIsPCModalOpen(true)
      };
      const PChandleClose = () => setIsPCModalOpen(false);

      
      useEffect(() => {
        setLoading(true); // Start loading
        // Fetch all patients from the API
        const requestOptions = {
          method: "GET",
          redirect: "follow"
        };
        
        fetch("http://127.0.0.1:8000/api/codes/", requestOptions)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setCodes(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });

      }, []);

      const handleCheckboxChange = (code) => {
        setselectedCodes((prevSelected) =>
          prevSelected.includes(code)
            ? prevSelected.filter((id) => id !== code) // Deselect
            : [...prevSelected, code] // Select
        );
        console.log('selected patient in basicmodal',code);
      };

      const handleSubmit = () =>{
        oncodeSelect(selectedCodes);
        PChandleClose();
      }

  return (
    <React.Fragment>
      <Button variant="contained" onClick={setIsPCModalOpen}>Codes</Button>
      <Modal
        open={isPCModalOpen}
        onClose={PChandleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 650 }}>
          <h2 id="child-modal-title">Select Procedure Code</h2>
          <div style={{height: 400, overflow: "scroll"}}>
          <table
         border="1"
         style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          marginTop: "20px",
          
          overflow: "scroll"
         }}
      >
        <thead>
          <tr>
            <th>Category</th>
            <th>Description</th>
            <th>Abbr</th>
            <th>Code</th>
            <th>Fee1</th>
            <th>Fee2</th>
            <th>Fee3</th>
          </tr>
        </thead>
        <tbody>
        {codes.map((code) => (
            <tr >
              <td>
              <input
                  type="checkbox"
                  checked={selectedCodes.includes(code.id)}
                  onChange={() => handleCheckboxChange(code.id)}
                />
              </td>
              <td>{code.category}</td>
              <td>{code.description}</td>
              <td>{code.abbr}</td>
              <td>{code.code}</td>
              <td>{code.fee1}</td>
              <td>{code.fee2}</td>
              
            </tr>
        ))}
      
        </tbody>
      </table>
      </div>
      <Button
            variant="contained"
            onClick={handleSubmit}
            style={{ marginTop: "20px", marginRight: "10px" }}
          >
            Submit
          </Button>

          <Button onClick={PChandleClose}>Close</Button>
        </Box>
      </Modal>
    </React.Fragment>
  );
}


const BasicModal=(props) => {

  const { sendDataToprops,open,handleClose,onPatientSelect,selectedcode  } = props;
  console.log("props data",sendDataToprops);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchParams, setSearchParams] = useState({
    first_name: "",
    last_name: "",
    age: "",
  });
  const [selectedCodes, setselectedCodes] = useState(null);
  const [selectedPatients, setSelectedPatients] = useState([]);
  // console.log("codes",selectedcode);
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


  // Callback to receive selected patient from BasicModal
  const handleCodeSelect = (code) => {

    setselectedCodes(code);
    selectedcode(code);
    console.log("selected handleCodeSelect in scheduler",code);
    // setIsModalOpen(false); // Close the modal after selection
    
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
             
              <td>{patient.patient_id}</td>
              <td>{patient.first_name}</td>
              <td>{patient.last_name}</td>
              <td>{patient.age}</td>
              <td>{patient.address}</td>
              <td><button  onClick={() => handlePatientClick(patient)}>Select</button></td>
            </tr>
            
          ))}
        </tbody>
      </table>
      
      <ChildModal oncodeSelect={handleCodeSelect} />
      
        </Box>
        
      </Modal>


    </div>
    
  );
}

export default BasicModal;
