import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OTPLogin = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('email'); // email -> otp -> newUser
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        name: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState([]);

    const addDebugInfo = (message) => {
        console.log(message);
        setDebugInfo(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        addDebugInfo(`Form field ${name} changed to: ${value}`);
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const requestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        addDebugInfo('Requesting OTP...');

        try {
            const response = await axios.post('http://localhost:5000/api/request-otp', {
                email: formData.email
            });
            
            addDebugInfo('OTP request successful');
            setStep('otp');
        } catch (error) {
            addDebugInfo('Error requesting OTP: ' + error.message);
            setError(error.response?.data?.message || 'Error requesting OTP');
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        addDebugInfo('Verifying OTP...');

        try {
            const response = await axios.post('http://localhost:5000/api/verify-otp', {
                email: formData.email,
                otp: formData.otp
            });

            addDebugInfo('OTP verification response received');
            
            if (response.data.user) {
                // Store token and user data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                addDebugInfo('Login successful, redirecting...');
                navigate('/dashboard');
            } else {
                // New user needs to complete registration
                setStep('newUser');
            }
        } catch (error) {
            addDebugInfo('Error verifying OTP: ' + error.message);
            setError(error.response?.data?.message || 'Error verifying OTP');
        } finally {
            setLoading(false);
        }
    };

    const completeRegistration = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        addDebugInfo('Completing registration...');

        try {
            const response = await axios.post('http://localhost:5000/api/verify-otp', {
                email: formData.email,
                otp: formData.otp,
                name: formData.name,
                password: formData.password
            });

            addDebugInfo('Registration successful');
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (error) {
            addDebugInfo('Error completing registration: ' + error.message);
            setError(error.response?.data?.message || 'Error completing registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {step === 'email' ? 'Login with OTP' : 
                 step === 'otp' ? 'Enter OTP' : 
                 'Complete Registration'}
            </h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {step === 'email' && (
                <form onSubmit={requestOTP} className="space-y-4">
                    <div>
                        <label className="block mb-1">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded ${
                            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                    >
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                </form>
            )}

            {step === 'otp' && (
                <form onSubmit={verifyOTP} className="space-y-4">
                    <div>
                        <label className="block mb-1">Enter OTP:</label>
                        <input
                            type="text"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                            maxLength="6"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded ${
                            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                    >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                </form>
            )}

            {step === 'newUser' && (
                <form onSubmit={completeRegistration} className="space-y-4">
                    <div>
                        <label className="block mb-1">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                            minLength="6"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded ${
                            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
            )}

            <div className="mt-8">
                <h3 className="font-bold mb-2">Debug Information:</h3>
                <div className="bg-gray-100 p-4 rounded max-h-40 overflow-y-auto">
                    {debugInfo.map((info, index) => (
                        <div key={index} className="text-sm font-mono mb-1">
                            {info}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OTPLogin; 