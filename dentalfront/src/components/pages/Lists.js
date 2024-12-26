import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';

const Lists = () => {
    const [events, setEvents] = useState([]);

    const doctors = [
        { id: 'dr_albert', title: 'Dr. Brian Albert' },
        { id: 'dr_lexington', title: 'Dr. Sarah Lexington' },
        { id: 'dr_overflow', title: 'Doctor Overflow' },
        { id: 'tina', title: 'Tina' },
        { id: 'bruce', title: 'Bruce' },
    ];

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
                    start: event.start_datetime,
                    end: event.end_datetime,
                    resourceId: event.doctor_name, // Associate with the doctor's ID
                }));
                setEvents(formattedEvents);
            })
            .catch((error) => console.error('Error fetching events:', error));
    }, []);

    const handleDateSelect = (selectInfo) => {
        const { startStr, endStr, resource } = selectInfo;
        const selectedStart = new Date(startStr);
        const currentTime = new Date();

        if (!resource) {
            alert('Please select a doctor to schedule an appointment.');
            return;
        }
        if (selectedStart < currentTime && selectedStart != currentTime) {
            alert('You cannot create Appointment in the past.');
            selectInfo.view.calendar.unselect();
            return;
        }

        const title = prompt('Enter a title for the new Appointment:');
        if (title) {
            const newEvent = {
                id: Date.now().toString(),
                title,
                start: startStr,
                end: endStr,
                resourceId: resource.id, // Associate the event with the doctor
            };

            setEvents((prevEvents) => [...prevEvents, newEvent]);

            // Optionally, send the new event to the backend
            fetch('http://127.0.0.1:8000/api/create-meeting/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newEvent),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to save event.');
                    }
                    alert('Event created successfully!');
                })
                .catch((error) => console.error('Error saving event:', error));
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2>Doctor Scheduler</h2>
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin, resourceTimeGridPlugin]}
                initialView="resourceTimeGridDay"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'resourceTimeGridDay,resourceTimeGridWeek',
                }}
                editable={true}
                selectable={true}
                events={events} // Pass fetched and new events
                resources={doctors} // Provide doctors as resources
                select={handleDateSelect}
            />
        </div>
    );
};

export default Lists;
