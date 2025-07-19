import React, { useState } from 'react';
import axios from 'axios';

const EmailTest = () => {
    const [formData, setFormData] = useState({
        to: '',
        subject: '',
        text: '',
        html: ''
    });
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        addDebugInfo('Starting email send process...');

        try {
            addDebugInfo('Sending request to backend...');
            const response = await axios.post('http://localhost:5000/api/email/test-email', formData);
            
            addDebugInfo('Response received from server:');
            addDebugInfo(JSON.stringify(response.data, null, 2));
            
            setStatus({
                type: 'success',
                message: 'Email sent successfully!',
                details: response.data
            });
        } catch (error) {
            addDebugInfo('Error occurred:');
            addDebugInfo(error.message);
            if (error.response) {
                addDebugInfo('Error response data:');
                addDebugInfo(JSON.stringify(error.response.data, null, 2));
            }
            
            setStatus({
                type: 'error',
                message: 'Failed to send email',
                details: error.response?.data || error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Email Test Component</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1">To:</label>
                    <input
                        type="email"
                        name="to"
                        value={formData.to}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                
                <div>
                    <label className="block mb-1">Subject:</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                
                <div>
                    <label className="block mb-1">Text:</label>
                    <textarea
                        name="text"
                        value={formData.text}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        rows="3"
                    />
                </div>
                
                <div>
                    <label className="block mb-1">HTML:</label>
                    <textarea
                        name="html"
                        value={formData.html}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        rows="3"
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded ${
                        loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                    } text-white`}
                >
                    {loading ? 'Sending...' : 'Send Test Email'}
                </button>
            </form>

            {status && (
                <div className={`mt-4 p-4 rounded ${
                    status.type === 'success' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                    <h3 className="font-bold">{status.message}</h3>
                    <pre className="mt-2 text-sm">
                        {JSON.stringify(status.details, null, 2)}
                    </pre>
                </div>
            )}

            <div className="mt-8">
                <h3 className="font-bold mb-2">Debug Information:</h3>
                <div className="bg-gray-100 p-4 rounded max-h-60 overflow-y-auto">
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

export default EmailTest; 