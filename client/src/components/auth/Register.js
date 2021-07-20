import React, { useEffect, useRef, useState } from 'react';
import isDate from 'validator/lib/isDate';
import useInputState from '../../hooks/useInputState';

function Register(props) {
    // Handle form input change
    const [email, setEmail, resetEmail] = useInputState('');
    const [username, setUsername, resetUsername] = useInputState('');
    const [password, setPassword, resetPassword] = useInputState('');
    const [month, setMonth, resetMonth] = useInputState('');
    const [day, setDay, resetDay] = useInputState('');
    const [year, setYear, resetYear] = useInputState('');

    // Handle Register Submit
    const handleSubmit = e => {
        e.preventDefault();
        resetEmail();
        resetUsername();
        resetPassword();
        resetMonth();
        resetDay();
        resetYear();
    }

    // Date of birth data
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = []
    for(let i = 1; i <= 31; i++) {
        days.push(<option key={i} value={i < 10 ? `0${i}` : i}>{i}</option>);
    }
    const curYear = (new Date()).getFullYear();
    const years = Array.from(new Array(100),( val, index) => curYear - index);
    let dob = useRef(null);
    let [validDate, setValidDate] = useState(null);

    // Form and validate dob string
    useEffect(() => {
        dob.current = `${year}-${month}-${day}`;
        if((year && day && month) !== '') {
            let dateValidator = isDate(dob.current);
            if(dateValidator) {
                setValidDate(true);
            } else {
                setValidDate(false);
            }
        }
    }, [year, day, month]);

    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input 
                type="text"
                onChange={setEmail}
                value={email}
                name="email"
                id="email"
                placeholder="Eg: test@xyz.com"
                required
            />
            <label htmlFor="username">Username</label>
            <input 
                type="text"
                onChange={setUsername}
                value={username}
                name="username"
                id="username"
                placeholder="Enter Username"
                required
            />
            <label htmlFor="password">Password</label>
            <input 
                type="password"
                onChange={setPassword}
                value={password}
                name="password"
                id="password"
                placeholder="Enter Password"
                required
            />
            <label htmlFor="dob">Date Of Birth</label>
            <select name="month" id="month" onChange={setMonth} defaultValue="Month">
                <option disabled>Month</option>
                {months.map((month, i) => (
                    <option key={i} value={i < 9 ? `0${i + 1}` : i + 1}>{month}</option>
                ))}
            </select>
            <select name="day" id="day" onChange={setDay} defaultValue="Day">
                <option disabled>Day</option>
                {days}
            </select>
            <select name="year" id="year" onChange={setYear} defaultValue="Year">
                <option disabled>Year</option>
                {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                ))}
            </select>
            {(!validDate && validDate !== null) ? 'Choose a valid date' : ''}
            <button type="submit" disabled={validDate && (email && username && password) !== '' ? false : true}>Sign Up</button>
        </form>
    );
}

export default Register;