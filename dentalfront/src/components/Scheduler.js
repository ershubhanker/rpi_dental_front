import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
// import Selectpatient from '../components/pages/Selectpatient';
import BasicModal from '../components/pages/BasicModal';

const Scheduler = (props) => {

    useEffect(() => {
        console.log("Selected Patients in Scheduler:", props);
        // Perform any additional logic with the selected patient IDs
      }, [props]); // Re-run whenever `value` changes

    const [events, setEvents] = useState([
        {
            id: '1',
            title: 'Consultation',
            doctor: 'Dr. Smith',
            start: new Date().toISOString().split('T')[0] + 'T10:00:00',
            end: new Date().toISOString().split('T')[0] + 'T11:00:00',
        },
        {
            id: '2',
            title: 'Surgery',
            doctor: 'Dr. Adams',
            start: new Date().toISOString().split('T')[0] + 'T13:00:00',
            end: new Date().toISOString().split('T')[0] + 'T14:30:00',
        },
        {
            id: '3',
            title: 'Follow-up',
            doctor: 'Dr. Smith',
            start: new Date().toISOString().split('T')[0] + 'T15:00:00',
            end: new Date().toISOString().split('T')[0] + 'T16:00:00',
        },
    ]);

    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState('All');
    
    const doctors = ['All', 'Dr. Smith', 'Dr. Adams', 'Dr. Johnson'];


    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpen = () => setIsModalOpen(true);
    const handleClose = () => setIsModalOpen(false);

    // Filter events based on selected doctor
    const filteredEvents =
        selectedDoctor === 'All'
            ? events
            : events.filter((event) => event.doctor === selectedDoctor);

    // Open edit form
    const handleEventClick = (clickInfo) => {
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

    // Save changes to the event
    const saveEventChanges = () => {
        setEvents((prevEvents) =>
            prevEvents.map((event) =>
                event.id === currentEvent.id
                    ? {
                          ...event,
                          title: currentEvent.title,
                          doctor: currentEvent.doctor,
                          start: currentEvent.start,
                          end: currentEvent.end,
                      }
                    : event
            )
        );
        setIsEditing(false);
        setIsModalOpen(false);
        setCurrentEvent(null);
    };

    // Close the edit form
    const cancelEdit = () => {
        setIsEditing(false);
        setIsModalOpen(false);
        setCurrentEvent(null);
    };

    // Delete the selected event
    const deleteEvent = (eventId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this appointment?');
        if (confirmDelete) {
            setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
            setIsEditing(false);
            setCurrentEvent(null);
        }
    };

    
    // Add a new event when a date range is selected
    const handleDateSelect = (selectInfo) => {
        const { startStr, endStr } = selectInfo;
        console.log("select info",startStr);
        const selectedStart = new Date(startStr);
        const currentTime = new Date();

        if (selectedStart < currentTime && selectedStart != currentTime) {
            alert('You cannot create Appointment in the past.');
            selectInfo.view.calendar.unselect();
            return;
        }
        // if (typeof handleOpen === "function") {
        //     handleOpen();  // Calling the function passed from the parent
        //   }
         handleOpen()
        // const title = prompt('Enter a title for the new Appointment:');
        // if (title && selectedDoctor !== 'All') {
        //     const newEvent = {
        //         id: String(events.length + 1),
        //         title,
        //         doctor: selectedDoctor,
        //         start: startStr,
        //         end: endStr,
        //     };

        //     setEvents((prevEvents) => [...prevEvents, newEvent]);
        // } else if (selectedDoctor === 'All') {
        //     alert('Please select a doctor to add an Appointment.');
        // }

        selectInfo.view.calendar.unselect();
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h2>Doctor Scheduler</h2>
            <label>
                Select Doctor:
                <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    style={{ marginLeft: '10px', marginBottom: '10px' }}
                >
                    {doctors.map((doctor, index) => (
                        <option key={index} value={doctor}>
                            {doctor}
                        </option>
                    ))}
                </select>
            </label>
            
            <FullCalendar
                plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'timeGridDay,timeGridWeek,dayGridMonth',
                }}
                editable={true}
                selectable={!isModalOpen && !isEditing}
                events={filteredEvents} // Show filtered events
                eventClick={handleEventClick}
                select={handleDateSelect}
            />
        <BasicModal open={isModalOpen} handleClose={handleClose} />

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
                            {doctors
                                .filter((doctor) => doctor !== 'All')
                                .map((doctor, index) => (
                                    <option key={index} value={doctor}>
                                        {doctor}
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
