"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

// สไตล์สำหรับ Container
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f9;
`;

// สไตล์สำหรับ Form
const Form = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

// สไตล์สำหรับ Input
const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

// สไตล์สำหรับ Button
const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const CreateUserPage = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleCreateUser = async () => {
    if (!firstName || !email || !password) {
      toast.error('Please provide name, email, and password.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You are not authorized. Please login again.');
        return;
      }

      const response = await axios.post('http://iottechgroup.dyndns.biz:18180/api/user/user/',
        { first_name: firstName, email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success('User created successfully!');
        router.push('/');  // กลับไปยังหน้าหลักหลังจากเพิ่มผู้ใช้สำเร็จ
      } else {
        toast.error('Failed to create user.');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
        if (error.response) {
          const errorMessage = error.response.data.detail || error.response.data.message || 'An error occurred';
          toast.error('Error: ' + errorMessage);
        } else if (error.request) {
          toast.error('No response from server. Please try again later.');
        } else {
          toast.error('Error: ' + error.message);
        }
      } else {
        console.error('Unexpected error details:', error);
        toast.error('An unexpected error occurred.');
      }
    }
  };

  return (
    <Container>
      <Form>
        <h1>Create New User</h1>
        <Input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleCreateUser}>Create User</Button>
        <ToastContainer />
      </Form>
    </Container>
  );
};

export default CreateUserPage;
