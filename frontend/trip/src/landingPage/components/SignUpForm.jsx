import '../styles/header&signUp.css'
import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';


function SignUpForm({ formAppearing, InContent, SetUserInfo, SetLoggedIn }) {
  const [emailAppear, setEmailAppear] = useState(false);

  const emailInput = useRef();
  const PasswordInput = useRef();

  async function submitForm(e) {
    e.preventDefault();

    const email = emailInput.current?.value?.trim() || '';
    const Password = PasswordInput.current?.value || '';

    setEmailAppear(true);

    try {
      const resp = await fetch('https://full-trip.onrender.com/Kad_Be/routes/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password: Password })
      });

      if (resp.ok) {
        const user = await resp.json();
        SetLoggedIn(true);
        const uObj = { UserName: user.first_name, UserType: user.user_type || 'user', ...user };
        SetUserInfo(uObj);
        localStorage.setItem('FT_user', JSON.stringify(uObj));
        formAppearing(false);
        return;
      }

      if (resp.status === 401) {
        alert('Wrong Email or Password');
        return;
      }

      let respText = '';
      respText = await resp.text();
      console.warn('Server login endpoint returned non-OK status; falling back to local users file', { status: resp.status, body: respText });
    } catch (err) {
      console.warn('Login request failed, falling back to local users file', err);
    }

    const usersList = InContent;
    const foundUser = usersList?.users?.find(u => u.email === email && u.password === Password);

    if (foundUser) {
      SetLoggedIn(true);
      const uObj = { UserName: foundUser.username, UserType: foundUser.user_type, email: foundUser.email };
      SetUserInfo(uObj);
      localStorage.setItem('FT_user', JSON.stringify(uObj));
      formAppearing(false);
      return;
    }

    alert('Wrong Email or Password');
  }

  function goBack(e) {
    e.preventDefault();
    formAppearing(false);
  }

  return (
    <>
      <form
        className='submit-form'
        onSubmit={submitForm}>
        <button
          type='button'
          name='go-back'
          onClick={goBack}>
          <i className='bx  bx-x'  ></i>
        </button>
        <div
          className='sign-head'>
          Welcome
        </div>
        <p>If you are not registered yet, you can click here to register:</p>
        <Link to={'/register'}>
          register!
        </Link>
        <label htmlFor='email' >email
          <input
            ref={emailInput}
            id='email'
            type='email'
            placeholder='example@gmail.com'
            required /></label>
        <label htmlFor='password'>Password
          <input
            ref={PasswordInput}
            id='paswd'
            type='password'
            placeholder='Password' required />
        </label>
        <button type='submit' name='submit'>Log In</button>
      </form>
    </>
  );
}

export default SignUpForm;
