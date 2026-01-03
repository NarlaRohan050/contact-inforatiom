import { useState, useEffect } from 'react';

function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [contacts, setContacts] = useState([]);
  const [submitStatus, setSubmitStatus] = useState('');

  // Fetch contacts when app loads
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('https://contact-inforatiom.onrender.com/api/contacts');
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (err) {
      console.error('Failed to fetch contacts');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!form.phone.trim()) newErrors.phone = 'Phone is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await fetch('https://contact-inforatiom.onrender.com/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });

        const result = await res.json();

        if (res.ok) {
          setForm({ name: '', email: '', phone: '', message: '' });
          setSubmitStatus('✅ Contact saved successfully!');
          setTimeout(() => setSubmitStatus(''), 3000);
          fetchContacts(); // Refresh list
        } else {
          alert('Error: ' + (result.error || 'Failed to save contact'));
        }
      } catch (err) {
        alert('❌ Network error. Please check your internet connection.');
      }
    }
  };

  const isFormValid = () => {
    return (
      form.name.trim() &&
      form.phone.trim() &&
      /^\S+@\S+\.\S+$/.test(form.email)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
          Contact Manager
        </h1>

        {submitStatus && (
          <div className="mb-5 p-3 bg-green-100 text-green-800 rounded text-center">
            {submitStatus}
          </div>
        )}

        <div className="bg-white p-5 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Add New Contact</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
                  errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Message */}
            <div>
              <textarea
                name="message"
                placeholder="Message (Optional)"
                value={form.message}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              disabled={!isFormValid()}
              className={`w-full py-2 px-4 rounded font-medium transition ${
                isFormValid()
                  ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Contact
            </button>
          </form>
        </div>

        {/* Contacts List */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Saved Contacts</h2>
          {contacts.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No contacts yet.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {contacts.map((contact) => (
                <div key={contact._id} className="p-3 border border-gray-200 rounded bg-gray-50">
                  <div className="font-medium text-gray-800">{contact.name}</div>
                  <div className="text-sm text-gray-600">{contact.email} | {contact.phone}</div>
                  {contact.message && (
                    <div className="mt-1 text-sm italic text-gray-700">“{contact.message}”</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;