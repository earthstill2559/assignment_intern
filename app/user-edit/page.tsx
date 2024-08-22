"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f2f5;
`;

const Form = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 16px;

  &:hover {
    background-color: #0056b3;
  }
`;

const EditUserPage = () => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleEditUser = async () => {
    const userId = 1; // ใส่ ID ของผู้ใช้ที่ต้องการแก้ไข

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You are not authorized. Please login again.');
        return;
      }

      await axios.put(`http://iottechgroup.dyndns.biz:18180/api/user/user/${userId}/`, 
        { first_name: firstName, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('User updated successfully!');
      router.push('/');  // กลับไปยังหน้าหลักหลังจากแก้ไขผู้ใช้สำเร็จ
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('An unexpected error occurred.');
    }
  };

  return (
    <Container>
      <Form>
        <h1>Edit User</h1>
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
        <Button onClick={handleEditUser}>Update User</Button>
        <ToastContainer />
      </Form>
    </Container>
  );
};

export default EditUserPage;
