import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';

export default function UserCreate() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('YOUR_API_URL_HERE', { name, email }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push('/');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user.');
    }
  };

  return (
    <div>
      <h2>Create User</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSubmit}>Create</button>
      <ToastContainer />
    </div>
  );
}
