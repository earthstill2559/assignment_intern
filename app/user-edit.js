import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';

export default function UserEdit() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`YOUR_API_URL_HERE/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setName(response.data.name);
        setEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to load user data.');
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`YOUR_API_URL_HERE/${id}`, { name, email }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push('/');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user.');
    }
  };

  return (
    <div>
      <h2>Edit User</h2>
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
      <button onClick={handleSubmit}>Update</button>
      <ToastContainer />
    </div>
  );
}
