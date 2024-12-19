import React, { useState } from 'react';
import Box from '@mui/system/Box';
import Grid from '@mui/system/Grid';
import styled from '@mui/system/styled';
import { Button } from '@mui/material';


const Item = styled('div')(({ theme }) => ({
    backgroundColor: '#fff',
    border: '1px solid',
    borderColor: '#ced7e0',
    padding: theme.spacing(1),
    borderRadius: '4px',
    textAlign: 'center',
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
      borderColor: '#444d58',
    }),
  }));


const Makeappointment = () => {
    const [formData, setFormData] = useState({
        memberId: "",
        dob: "",
        firstName: "",
        lastName: "",
      });

      const doctorsList = [
        "Dr. John Smith",
        "Dr. Alice Johnson",
        "Dr. Emily Davis",
        "Dr. Michael Brown",
        "Dr. Sarah Wilson",
      ];
      

      const docType = [
        "Refferal Form",
        "Dental Models",
        "Diagnostic Report",
        "Explanation Benefits",
        "Support Data for Claim",
        "Periodontal Charts",
        "Radiology Films",
        "Radiology Reports",
      ];

      const [response, setResponse] = useState('');

      const runScript = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/run-script/');
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json(); // Parse JSON response
            setResponse(data.output); // Update state with the script output
        } catch (error) {
            console.error('Error running script:', error);
            setResponse('Error running script');
        }
    };


      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

      
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted", formData);
        // Add any further actions, such as sending data to a backend
      };
    
      return (
        <div style={{ margin: "0 auto", padding: "1em" }}>
          <h2>Member Information Form</h2>
          <Box sx={{ flexGrow: 1 }}>
          
          {/* <form onSubmit={handleSubmit}> */}
          <Grid container spacing={4}>
          <Grid size={3}>
            <div style={{ marginBottom: "1em" }}>
              <label htmlFor="memberId" style={{ display: "block" }}>
                Member ID:
              </label>
              <input
                type="text"
                id="memberId"
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "0.5em" }}
              />
            </div>
            </Grid>
            <Grid size={3}>
            <div style={{ marginBottom: "1em" }}>
              <label htmlFor="dob" style={{ display: "block" }}>
                Date of Birth:
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "0.5em" }}
              />
            </div>
            </Grid>

            <Grid size={3}>
            <div style={{ marginBottom: "1em" }}>
              <label htmlFor="firstName" style={{ display: "block" }}>
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "0.5em" }}
              />
            </div>
            </Grid>
            <Grid size={3}>
            <div style={{ marginBottom: "1em" }}>
              <label htmlFor="lastName" style={{ display: "block" }}>
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "0.5em" }}
              />
            </div>
            </Grid>
            <button type="submit" style={{ padding: "0.5em 1em" }}>
              Submit
            </button>
            </Grid>
          {/* </form> */}
          
          </Box>

        {/* Service line column start */}

          <h2>Service Line</h2>
          <Box sx={{ flexGrow: 1 }}>
        
          <Grid container spacing={4}>
          <Grid size={3}>
          <div style={{ marginBottom: "1em" }}>
              <label htmlFor="dob" style={{ display: "block" }}>
                Service Date:
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "0.5em" }}
              />
            </div>
            </Grid>

            <Grid size={3}>
          <div style={{ marginBottom: "1em" }}>
          <label htmlFor="doctorName" style={{ display: "block" }}>
            Doctor Name:
          </label>
          <select
            id="doctorName"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5em" }}
          >
            <option value="" disabled>
              Select a Doctor
            </option>
            {doctorsList.map((doctor, index) => (
              <option key={index} value={doctor}>
                {doctor}
              </option>
            ))}
          </select>
        </div>
        </Grid>
        </Grid>
        </Box>
            
            {/* Service line column End */}
        <div >
        <Box sx={{ flexGrow: 1 }}>
          
        
          <Grid container spacing={4}>
          <Grid size={1}>
            <div style={{ marginBottom: "1em" }}>
              <label htmlFor="memberId" style={{ display: "block" }}>
               Procedure Code
              </label>
              <input
                type="text"
                id="memberId"
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "0.5em" }}
              />
            </div>
            </Grid>
            <Grid size={1}>
            <div style={{ marginBottom: "1em" }}>
              <label htmlFor="memberId" style={{ display: "block" }}>
               Tooth No.
              </label>
              <input
                type="text"
                id="memberId"
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "0.5em" }}
              />
            </div>
            </Grid>

            <Grid size={3}>
            <div style={{ marginBottom: "1em" }}>
              <label htmlFor="firstName" style={{ display: "block" }}>
                Surface
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "0.5em" }}
              />
            </div>
            </Grid>

             <Grid size={3}>
          <div style={{ marginBottom: "1em" }}>
          <label htmlFor="doctorName" style={{ display: "block" }}>
          Quad
          </label>
          <select
            id="doctorName"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5em" }}
          >
        
            {doctorsList.map((doctor, index) => (
              <option key={index} value={doctor}>
                {doctor}
              </option>
            ))}
          </select>
        </div>
        </Grid>

            <Grid size={1}>
            <div style={{ marginBottom: "1em" }}>
              <label htmlFor="lastName" style={{ display: "block" }}>
                Auth No
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "0.5em" }}
              />
            </div>
            </Grid>

            <Grid size={1}>
            <div style={{ marginBottom: "1em" }}>
              <label htmlFor="lastName" style={{ display: "block" }}>
                Billed Amount
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "0.5em" }}
              />
            </div>
            </Grid>
            
            </Grid>
          {/* </form> */}
          
          </Box>
          </div>


          {/* File Attachment Area */}
          <div>
          <h2>File Attachment</h2>
          <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={6}>
          <Grid size={6}>
          <div style={{ marginBottom: "1em" }}>
          <label htmlFor="doctorName" style={{ display: "block" }}>
          Select Field
          </label>
          <select
            id="doctorName"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5em" }}
          >
        
            {docType.map((doc, index) => (
              <option key={index} value={doc}>
                {doc}
              </option>
            ))}
          </select>
        </div>
        </Grid>
        <Grid size={6}>
        <input type="file" id="myfile" name="File Upload"/>
        </Grid>
          </Grid>
          </Box>
          </div>
          {/* File Attachment Area end*/}



            {/* Insurance Carrier Start */}
            <div>
              <h2>Insurance Carrier</h2>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={6}>
                  <Grid size={6}>
                    <Button onClick={runScript}>MH</Button>
                  </Grid>
                </Grid>
              </Box>
            </div>
            {/* Insurance Carriet End */}
        </div>
      );

};

export default Makeappointment;
