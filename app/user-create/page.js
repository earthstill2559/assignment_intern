"use client";

import axios from 'axios';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import { useState } from 'react';

export default function UserCreate() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter( );

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://iottechgroup.dyndns.biz:18180/api/user/user', { name, email }, {
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
