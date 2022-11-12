
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import { loginUser } from '../utils/API';
import Auth from '../utils/auth';

const Login = () => {
  const [formData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [alertShow, setAlert] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();


    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const response = await loginUser(formData);

      if (!response.ok) {
        throw new Error('It went Wrong');
      }

      const { token, user } = await response.json();
      console.log(user);
      Auth.login(token);
    } catch (err) {
      console.error(err);
      setAlert(true);
    }

    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setAlert(false)} show={alertShow} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={formData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={formData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(formData.email && formData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default Login;
