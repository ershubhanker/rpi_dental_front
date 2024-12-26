import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
// import Selectpatient from '../components/pages/Selectpatient';
import BasicModal from '../components/pages/BasicModal';

const Scheduler = () => {

    const [meetingCreated, setmeetingCreated] = useState([null])

    const [events, setEvents] = useState([]); // Start with an empty array

    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [eventTitle, seteventTitle] = useState(null);
    const [selectedDateRange, setSelectedDateRange] = useState(null);
    const doctors = ['All', 'Dr. Smith', 'Dr. Adams', 'Dr. Johnson'];
   
    const doctorslist = [
        { id: 'dr_albert', title: 'Dr. Brian Albert' },
        { id: 'dr_lexington', title: 'Dr. Sarah Lexington' },
        { id: 'dr_overflow', title: 'Doctor Overflow' },
        { id: 'tina', title: 'Tina' },
        { id: 'bruce', title: 'Bruce' },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    // Filter events based on selected doctor
    const filteredEvents = 
        selectedDoctor === 'All'
            ? events
            : events.filter((event) => event.doctors === selectedDoctor);


    // Callback to receive selected patient from BasicModal
    const handlePatientSelect = (patient) => {

        setSelectedPatient(patient);
        // console.log("selected handlePatientSelect in scheduler",patient);
        setIsModalOpen(false); // Close the modal after selection
        
    };

const [selectedCodes, setselectedCodes] = useState(null);
    // Callback to receive selected patient from BasicModal
  const handleCodeSelect = (code) => {

    setselectedCodes(code);
    console.log("selected handleCodeSelect in scheduler",code);
    // setIsModalOpen(false); // Close the modal after selection
    
};

    // Open edit form
    const handleEventClick = (clickInfo) => {
        console.log("handleEventClick in scheduler",clickInfo);
        // console.log("selected appt:",clickInfo.event.id)
        setCurrentEvent({
            id: clickInfo.event.id,
            title: clickInfo.event.title,
            doctor: clickInfo.event.extendedProps.doctor,
            start: clickInfo.event.startStr,
            end: clickInfo.event.endStr,
            
        });
        setIsEditing(true);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        setCurrentEvent((prev) => ({ ...prev, [name]: value }));
    };


    const saveEventChanges = async () => {
        try {
            // Create the updated event data
            const updatedEvent = {
                title: currentEvent.title,
                doctor_name: currentEvent.doctor,
                start_datetime: currentEvent.start,
                end_datetime: currentEvent.end,
                // patient_procedure_codes: currentEvent.patient_procedure_codes || [], // Include additional fields if necessary
            };
            console.log("currentEvent id", currentEvent.id);
            // API call to update the event on the server
            const response = await fetch(`http://127.0.0.1:8000/api/edit_meeting/${currentEvent.id}/`, {
                method: "PUT", // Use PUT for full updates or PATCH for partial updates
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedEvent),
            });
    
            if (response.ok) {
                const data = await response.json();
                
                // Update the local state with the updated event
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event.id === currentEvent.id
                            ? {
                                  ...event,
                                  title: data.title,
                                  doctor: data.doctor_name,
                                  start: data.start_datetime,
                                  end: data.end_datetime,
                              }
                            : event
                    )
                );
                alert("Meeting updated successfully!");
            } else {
                const errorData = await response.json();
                console.error("Error updating meeting:", errorData);
                alert("Failed to update the meeting!");
            }
        } catch (error) {
            console.error("Error during meeting update:", error);
            alert("An error occurred while updating the meeting!");
        } finally {
            // Reset editing state
            setIsEditing(false);
            setIsModalOpen(false);
            setCurrentEvent(null);
        }
    };
    
    // Close the edit form
    const cancelEdit = () => {
        setIsEditing(false);
        setIsModalOpen(false);
        setCurrentEvent(null);
    };

    // Delete the selected event
    const deleteEvent = (eventId) => {
        // console.log("delete id:",eventId)
        const confirmDelete = window.confirm('Are you sure you want to delete this appointment?');
        if (confirmDelete) {
            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));

            // Delete the event in the API
            fetch(`http://127.0.0.1:8000/api/edit_patient_appt/${eventId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to delete event');
                    }
                    alert('Event deleted successfully');
                })
                .catch((error) => console.error('Error deleting event:', error));

            setIsEditing(false);
            setCurrentEvent(null);
        }
    };


    // Fetch events from the API
    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/patientappt/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
               
                const formattedEvents = data.map((event) => ({
                    id: event.id.toString(),
                    title: event.title || 'No Title',
                    resourceId: event.doctor_name || 'Unknown Doctor',
                    start: event.start_datetime,
                    end: event.end_datetime,
                    patient: event.patient_details || 'Unknown Patient',
                }));
                // setEvents(formattedEvents);
                setEvents((prevEvents) => [...prevEvents, ...formattedEvents])
                setCurrentEvent(null);
            })
            .catch((error) => console.error('Error fetching events:', error));
            // Reset temporary states
        
    }, []);


    // send data to API to store in DB ()meeting is created in this useEffect function
    useEffect(() => {

        //Runs on the first render
        //And any time any dependency value changes
        // console.log("selected pateint before event created in scheduler:",selectedPatient);
        if ( selectedPatient && eventTitle && selectedDateRange) {
            const { startStr, endStr } = selectedDateRange;
            const newEvent = {
                patient_details: selectedPatient.patient_id,
                doctor_name: selectedDoctor,
                title: eventTitle,
                patient_procedure_codes:selectedCodes,
                start_datetime: startStr,
                end_datetime: endStr,
            };
    
            // Add event to the local calendar
            setEvents((prevEvents) => [...prevEvents, newEvent]);
    
            // Send event to the API
            (async () => {
                try {
                    const response = await fetch("http://127.0.0.1:8000/api/create-meeting/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newEvent),
                    });
    
                    if (response.ok) {
                        const data = await response.json();
                        alert("Meeting created successfully!");
                        // console.log("Response:", data);
                    } else {
                        const errorData = await response.json();
                        // console.error("Error:", errorData);
                        alert("Failed to create the meeting!");
                    }
                } catch (error) {
                    // console.error("Error:", error);
                    alert("An error occurred while creating the meeting!");
                }
            })();
    
            // Reset temporary states
            setSelectedDateRange(null);
            setSelectedPatient(null);
            seteventTitle(null);
            // setNewEventReady(false);
        }

      }, [eventTitle, selectedPatient]);



    // Add a new event when a date range is selected
    const handleDateSelect = async(selectInfo) => {
        const { startStr, endStr, resource } = selectInfo;
        // console.log("select info",startStr);
        const selectedStart = new Date(startStr);
        const currentTime = new Date();
        const selectedDoctorName = resource.id;
        // console.log("selected Doctor",selectedDoctorName);
        setSelectedDoctor(selectedDoctorName)
        if (selectedStart < currentTime && selectedStart != currentTime) {
            alert('You cannot create Appointment in the past.');
            selectInfo.view.calendar.unselect();
            return;
        }
        setSelectedDateRange({ startStr, endStr })
        handleOpen();
        // console.log("selected pateint before event created in scheduler:",selectedPatient);
        const title = prompt('Enter a title for the new Appointment:');
        seteventTitle(title);
        if (eventTitle && selectedDoctor !== '' && selectedPatient !== null) {
            setSelectedDateRange({ startStr, endStr })
            
        }
        

        selectInfo.view.calendar.unselect();
    };



    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2>Doctor Scheduler</h2>
            
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin, resourceTimeGridPlugin]}
                initialView="resourceTimeGridDay"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'resourceTimeGridDay',
                }}
                editable={true}
                selectable={!isModalOpen && !isEditing}
                events={events} // Show filtered events
                resources={doctorslist} // Provide doctors as resources
                eventClick={handleEventClick}
                select={handleDateSelect}
            />
        <BasicModal open={isModalOpen} handleClose={handleClose} onPatientSelect={handlePatientSelect} selectedcode={handleCodeSelect}/>

            {isEditing && (
                <div style={modalStyle}>
                    <h3>Edit Event</h3>
                    <label>
                        Title:
                        <input
                            type="text"
                            name="title"
                            value={currentEvent.title}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Doctor:
                        <select
                            name="doctor"
                            value={currentEvent.doctor}
                            onChange={handleInputChange}
                        >
                            {doctorslist.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.title}
                            </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        Start Time:
                        <input
                            type="datetime-local"
                            name="start"
                            value={currentEvent.start}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        End Time:
                        <input
                            type="datetime-local"
                            name="end"
                            value={currentEvent.end}
                            onChange={handleInputChange}
                        />
                    </label>
                    <div style={{ marginTop: '10px' }}>
                        <button onClick={saveEventChanges}>Save</button>
                        <button onClick={cancelEdit} style={{ marginLeft: '10px' }}>
                            Cancel
                        </button>
                        <button
                            onClick={() => deleteEvent(currentEvent.id)}
                            style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Basic modal styles
const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
};

export default Scheduler;