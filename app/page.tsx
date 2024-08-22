"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  date_joined: string;
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f2f5;
`;

const LoginForm = styled.div`
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
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

  &:hover {
    background-color: #0056b3;
  }
`;

const UserListContainer = styled.div`
  width: 80%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const UserCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const UserName = styled.h3`
  margin: 10px 0;
`;

const UserEmail = styled.p`
  margin: 5px 0;
  color: #555;
`;

const ActionButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #0056b3;
  }

  &:last-child {
    background-color: #dc3545;
    margin-left: 10px;

    &:hover {
      background-color: #c82333;
    }
  }
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://iottechgroup.dyndns.biz:18180/api/token/', {
        username: email,
        password: password,
      });

      if (response.data.access) {
        localStorage.setItem('token', response.data.access);
        setIsLoggedIn(true);
        fetchUsers(response.data.access);  // Fetch users after login
      } else {
        toast.error('Login failed!');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error);
        if (error.response) {
          toast.error('Error: ' + error.response.data.message);
        } else if (error.request) {
          toast.error('No response from server. Please try again later.');
        } else {
          toast.error('Error: ' + error.message);
        }
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  const fetchUsers = async (token: string) => {
    try {
      const response = await axios.get('http://iottechgroup.dyndns.biz:18180/api/user/user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.results);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load user data.');
    }
  };

  const handleEdit = () => {
    router.push('/user-edit');
  };
  

  const handleDelete = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.delete(`http://iottechgroup.dyndns.biz:18180/api/user/user/${userId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(users.filter((user) => user.id !== userId));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user.');
    }
  };

  const handleAddUser = () => {
    router.push('/user-create'); 
  };

  if (!isLoggedIn) {
    return (
      <Container>
        <LoginForm>
          <h2>Login</h2>
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
          <Button onClick={handleLogin}>Login</Button>
          <ToastContainer />
        </LoginForm>
      </Container>
    );
  } else {
    return (
      <Container>
        <h2>User List</h2>
        <Button onClick={handleAddUser} style={{ marginBottom: '20px' }}>Add User</Button> {/* เพิ่มปุ่ม Add User */}
        <UserListContainer>
          {users.map((user) => (
            <UserCard key={user.id}>
              <UserName>{user.first_name} {user.last_name}</UserName>
              <UserEmail>{user.email}</UserEmail>
              <div>
              <ActionButton onClick={handleEdit}>Edit</ActionButton>
                <ActionButton onClick={() => handleDelete(user.id)}>Delete</ActionButton>
              </div>
            </UserCard>
          ))}
        </UserListContainer>
        <ToastContainer />
      </Container>
    );
  }
}
