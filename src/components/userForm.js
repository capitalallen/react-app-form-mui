import React, { useState, useEffect } from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem,Snackbar,Alert,CircularProgress } from '@mui/material';

const UserForm = () => {
    // State for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [occupation, setOccupation] = useState('');
    const [location, setLocation] = useState('');
    const [occupationData, setOccupationData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for form errors
    const [errors, setErrors] = useState({
        name: false,
        email: false,
        password: false,
        occupation: false,
        location: false,
    });
    // Function to handle form submission
    const handleSubmit = () => {
        const data = { name, email, password, occupation, state: location };
        setIsSubmitting(true);

        fetch('https://frontend-take-home.fetchrewards.com/form', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                setIsSubmitting(false);
                if (response.status === 201) {
                    setIsSuccess(true);
                } else {
                    setErrorMessage(response.json());
                }
            }).catch((error) => {
                setErrorMessage(error);
                setIsSubmitting(false);
                // Handle error, e.g. display an error message
            });
    };

    // Disable the submit button if any input field is empty
    const isDisabled = !(
        name.trim() &&
        email.trim() && email.includes("@") &&
        password.trim() &&
        occupation.trim() &&
        location.trim()
    );

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setIsSuccess(false);
      };

    useEffect(() => {
        fetch('https://frontend-take-home.fetchrewards.com/form')
            .then((response) => response.json())
            .then((data) => {
                setOccupationData(data.occupations);
                setLocationData(data.states);
            })
    }, []);
    return (
        <form onSubmit={handleSubmit}>
            <TextField
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                margin="normal"
                error={errors.name}
                helperText={errors.name ? 'Name is required' : ''}
            />
            <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                margin="normal"
                error={errors.email}
                helperText={errors.email ? 'Email is required' : ''}
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                margin="normal"
                error={errors.password}
                helperText={errors.password ? 'Password is required' : ''}
            />
            <FormControl fullWidth margin="normal" error={errors.occupation}>
                <InputLabel>Occupation</InputLabel>
                <Select
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    required
                >
                    {occupationData ? occupationData.map(occupation => {
                        return <MenuItem value={occupation} key={occupation}>{occupation}</MenuItem>
                    }) : null}
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" error={errors.location}>
                <InputLabel>State</InputLabel>
                <Select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                >
                    {locationData ? locationData.map(loc => {
                        return <MenuItem value={loc.name} key={loc.name} >{loc.name}</MenuItem>
                    }) : null}
                </Select>
            </FormControl>
            <Snackbar
                open={isSuccess}
                autoHideDuration={6000}
                onClose={handleClose}
                message="User created successfully!"
            />
            {errorMessage!==''?<Alert severity='='error>{errorMessage}</Alert>:null}
            {isSubmitting?<CircularProgress />: null}
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting || isDisabled} onClick={() => {
                handleSubmit()
            }}>
                Create User
            </Button>
        </form>
    );
};

export default UserForm;
