import React, { useState } from "react";
import tandakirikananIcon from "../../assets/icons/back.png";

const MONTHS = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

const KalenderTransaksi = ({ onApply, onClose }) => {
    const today = new Date();

    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(today);
    const [startTime, setStartTime] = useState("07:00");
    const [endTime, setEndTime] = useState("23:59");

    const [baseMonth, setBaseMonth] = useState(today.getMonth());
    const [baseYear, setBaseYear] = useState(today.getFullYear());

    const leftMonth = baseMonth;
    const leftYear = baseYear;
    const rightMonth = baseMonth === 11 ? 0 : baseMonth + 1;
    const rightYear = baseMonth === 11 ? baseYear + 1 : baseYear;

    const buildCalendar = (month, year) => {
        const firstDay = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDay; i++) days.push(null);
        for (let d = 1; d <= totalDays; d++) days.push(new Date(year, month, d));
        return days;
    };

    const isSameDay = (a, b) =>
        a && b &&
        a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear();

    const isInRange = (date) =>
        date >= startDate && date <= endDate;

    const handleSelectDate = (date) => {
        if (!startDate || date < startDate) {
            setStartDate(date);
            setEndDate(date);
        } else {
            setEndDate(date);
        }
    };

    return (
        <div className="calendar-overlay">
            <div className="calendar-modal">

                <div className="calendar-sidebar">
                    <button onClick={() => {
                        const d = new Date();
                        setStartDate(d);
                        setEndDate(d);
                    }}>Hari Ini</button>

                    <button onClick={() => {
                        const d = new Date();
                        const first = new Date(d.setDate(d.getDate() - d.getDay()));
                        const last = new Date(first);
                        last.setDate(first.getDate() + 6);
                        setStartDate(first);
                        setEndDate(last);
                    }}>Minggu Ini</button>

                    <button onClick={() => {
                        const d = new Date();
                        const first = new Date(d.getFullYear(), d.getMonth(), 1);
                        const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
                        setStartDate(first);
                        setEndDate(last);
                    }}>Bulan Ini</button>
                </div>

                <div className="calendar-content">

                    <div className="calendar-header">
                        <button
                            className="calendar-nav-btn"
                            onClick={() => {
                                setBaseMonth(m => {
                                    if (m === 0) {
                                        setBaseYear(y => y - 1);
                                        return 11;
                                    }
                                    return m - 1;
                                });
                            }}
                        >
                            <img src={tandakirikananIcon} alt="prev" />
                        </button>

                        <span>
                            {MONTHS[leftMonth]} {leftYear} – {MONTHS[rightMonth]} {rightYear}
                        </span>

                        <button
                            className="calendar-nav-btn rotate"
                            onClick={() => {
                                setBaseMonth(m => {
                                    if (m === 11) {
                                        setBaseYear(y => y + 1);
                                        return 0;
                                    }
                                    return m + 1;
                                });
                            }}
                        >
                            <img src={tandakirikananIcon} alt="next" />
                        </button>
                    </div>

                    <div className="calendar-calendars">
                        {[{ month: leftMonth, year: leftYear }, { month: rightMonth, year: rightYear }].map((cal, idx) => (
                            <div className="calendar-box" key={idx}>
                                <div className="calendar-days">
                                    {DAYS.map(d => <span key={d}>{d}</span>)}
                                </div>

                                <div className="calendar-grid">
                                    {buildCalendar(cal.month, cal.year).map((date, i) => (
                                        <button
                                            key={i}
                                            className={`calendar-date
                        ${date && isSameDay(date, startDate) ? "start" : ""}
                        ${date && isSameDay(date, endDate) ? "end" : ""}
                        ${date && isInRange(date) ? "range" : ""}
                      `}
                                            disabled={!date}
                                            onClick={() => date && handleSelectDate(date)}
                                        >
                                            {date?.getDate()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="calendar-time-row">
                        <div className="calendar-time-group">
                            <label>Dari Tanggal</label>
                            <span>{startDate.toLocaleDateString("id-ID")}</span>
                        </div>

                        <div className="calendar-time-group">
                            <label>Dari Pukul</label>
                            <input type="time" className="calendar-time-input" value={startTime}
                                onChange={(e) => setStartTime(e.target.value)} />
                        </div>

                        <div className="calendar-time-group">
                            <label>Hingga Tanggal</label>
                            <span>{endDate.toLocaleDateString("id-ID")}</span>
                        </div>

                        <div className="calendar-time-group">
                            <label>Hingga Pukul</label>
                            <input type="time" className="calendar-time-input" value={endTime}
                                onChange={(e) => setEndTime(e.target.value)} />
                        </div>
                    </div>

                    <div className="calendar-footer">
                        <button className="btn-outline" onClick={onClose}>Batal</button>
                        <button className="btn-primary" onClick={() => onApply({ startDate, endDate, startTime, endTime })}>
                            Proses
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default KalenderTransaksi;
