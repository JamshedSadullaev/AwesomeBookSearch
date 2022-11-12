import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import { createUser } from '../utils/API';
import Auth from '../utils/auth';

const Signup = () => {

  const [userFormData, setData] = useState({ username: '', email: '', password: '' });

  const [validated] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setData({ ...userFormData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();


    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const response = await createUser(userFormData);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { token, user } = await response.json();
      console.log(user);
      Auth.login(token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>

      <Form noValidate validated={validated} onSubmit={handleSubmit}>

        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          It went wrong
        </Alert>

        <Form.Group>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInput}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
            name='email'
            onChange={handleInput}
            value={userFormData.email}
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
            onChange={handleInput}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required</Form.Control.Feedback>
        </Form.Group>
        <Button
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default Signup;
