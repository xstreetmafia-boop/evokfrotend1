import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../calendar.css';

function MeetingCalendar({ leads, onDateClick }) {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Get meetings for a specific date
    const getMeetingsForDate = (date) => {
        return leads.filter(lead => {
            if (!lead.meetingDate) return false;
            const meetingDate = new Date(lead.meetingDate);
            return meetingDate.toDateString() === date.toDateString();
        });
    };

    // Highlight dates with meetings
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const meetings = getMeetingsForDate(date);
            if (meetings.length > 0) {
                // Check if any meeting is overdue
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tileDate = new Date(date);
                tileDate.setHours(0, 0, 0, 0);

                if (tileDate < today) {
                    return 'has-overdue-meeting';
                } else if (tileDate.toDateString() === today.toDateString()) {
                    return 'has-today-meeting';
                }
                return 'has-meeting';
            }
        }
        return null;
    };

    const handleDateClick = (date) => {
        setSelectedDate(date);
        const meetings = getMeetingsForDate(date);
        if (onDateClick) {
            onDateClick(date, meetings);
        }
    };

    return (
        <div className="meeting-calendar">
            <h3>📅 Meeting Calendar</h3>
            <Calendar
                onChange={handleDateClick}
                value={selectedDate}
                tileClassName={tileClassName}
            />
            <div className="calendar-legend">
                <div className="legend-item">
                    <span className="legend-dot overdue"></span>
                    <span>Overdue</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot today"></span>
                    <span>Today</span>
                </div>
                <div className="legend-item">
                    <span className="legend-dot upcoming"></span>
                    <span>Upcoming</span>
                </div>
            </div>
        </div>
    );
}

export default MeetingCalendar;
