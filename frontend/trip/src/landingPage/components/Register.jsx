import '../styles/register.css'
import { useState, useEffect, useRef } from 'react'
import { Country, State, City } from 'country-state-city'
import Aos from 'aos'
import { addUser } from '../services/reg_service'

import { useNavigate } from 'react-router-dom'

export default function Register({ setUserInfo }) {
  const [countries] = useState(Country.getAllCountries());
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countrySelected, setCountrySelected] = useState(false);
  const [states, setStates] = useState([]);
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [algerianPhoneValid, setAlgerianPhoneValid] = useState(false);
  const [pwd, setPwd] = useState('');
  const [validePwd, setValidePwd] = useState(true);
  const [confirmPwd, setConfirmPwd] = useState('');
  const [valideConfirmPassword, setValideConfirmPassword] = useState(true);

  const navigate = useNavigate();

  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    country: '',
    state: '',
    currency: '',
    phone_num: '',
    password: ''
  });

  const pwdRef = useRef(null);
  const currentPwdRef = useRef(null);
  const phoneNumRef = useRef(null);

  const enterPhoneNum = (e) => {
    const input = e.target.value.replace(/\D/g, '');
    setPhoneNum(input);

    if (selectedCountry?.isoCode === 'DZ') {
      if (input.length === 9 && (input.startsWith('5') || input.startsWith('6') || input.startsWith('7'))) {
        setAlgerianPhoneValid(true);
        setUser(prev => ({ ...prev, phone_num: `+${phoneCode} ${input}` }));
      } else {
        setAlgerianPhoneValid(false);
      }
    }
  };

  const handelCountryChange = (country) => {
    setSelectedCountry(country);
    setCountrySelected(true);
    setStates(State.getStatesOfCountry(country.isoCode));
    setPhoneCode(country.phonecode || '');

    setUser(prev => ({
      ...prev,
      country: country.name,
      currency: country.currency
    }));
  };

  const checkFnameValidation = (value) => {
    const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
    setUser(prev => ({ ...prev, first_name: lettersOnly }));
  };

  const checkLnameValidation = (e) => {
    const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setUser(prev => ({ ...prev, last_name: lettersOnly }));
  };

  const handelPasswordChange = (e) => {
    const input = e.target.value;
    setValidePwd(input.length >= 8);
    setPwd(input);
  };

  function handelConfirmPasswordChange(e) {
    const input = e.target.value;
    setConfirmPwd(input);
    setValideConfirmPassword(input === pwd);
    setUser(prev => ({ ...prev, password: input }));
  }

  useEffect(() => {
    setValideConfirmPassword(confirmPwd === pwd);
  }, [confirmPwd, pwd]);

  const handelSubmit = async (e) => {
    e.preventDefault();

    if (!algerianPhoneValid) {
      phoneNumRef.current.style.display = 'flex';
      alert('⚠️ Please fix phone number validation.');
      return;
    }
    phoneNumRef.current.style.display = 'none';

    if (!validePwd) {
      pwdRef.current.style.display = 'flex';
      alert('⚠️ Password must be at least 8 characters.');
      return;
    }
    pwdRef.current.style.display = 'none';

    if (!valideConfirmPassword) {
      currentPwdRef.current.style.display = 'flex';
      alert('⚠️ Passwords do not match.');
      return;
    }
    currentPwdRef.current.style.display = 'none';

    if (!countrySelected) {
      alert('⚠️ Please select a country.');
      return;
    }

    try {
      const data = await addUser(user);

      if (data && data.user) {
        const u = data.user;
        const uObj = { UserName: u.first_name || u.email, UserType: u.role || 'user', ...u };
        localStorage.setItem('FT_user', JSON.stringify(uObj));
        if (typeof setUserInfo === 'function') setUserInfo(uObj);
      }

      alert('✅ Account created successfully!');

      setUser({
        first_name: '',
        last_name: '',
        email: '',
        country: '',
        state: '',
        currency: '',
        phone_num: '',
        password: ''
      });
      setPwd('');
      setConfirmPwd('');
      setPhoneNum('');
      setSelectedCountry(null);
      setCountrySelected(false);

      navigate('/Home');

    } catch (error) {
      alert('❌ Error creating account: ' + error.message);
    }
  };

  useEffect(() => {
    Aos.init({ duration: 1700 })
  }, []);

  return (
    <div className='reg-container'>
      <div data-aos='zoom-in' className='register-page'>
        <h1>
          Welcome In Travel<span>W</span>Us
        </h1>

        <form className='register-form' onSubmit={handelSubmit} method='POST'>
          <div className='first-sec'>
            <label>First Name
              <input
                value={user.first_name}
                onChange={(e) => checkFnameValidation(e.target.value)}
                type='text'
                placeholder='first name...'
                required
              />
            </label>

            <label>Last Name
              <input
                onChange={checkLnameValidation}
                value={user.last_name}
                type='text'
                placeholder='last name...'
                required
              />
            </label>

            <label>Email
              <input
                type='email'
                value={user.email}
                onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
                placeholder='email...'
                required
              />
            </label>

            <label>Country
              <select
                required
                value={selectedCountry?.isoCode || ''}
                onChange={(e) => {
                  const country = countries.find((c) => c.isoCode === e.target.value);
                  if (country) handelCountryChange(country);
                }}
              >
                <option value=''>Select Country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
            </label>

            <label>State
              <select
                required
                disabled={!countrySelected}
                value={user.state}
                onChange={(e) => setUser(prev => ({ ...prev, state: e.target.value }))}
              >
                <option value=''>Select State</option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className='separate-line'></div>

          <div className='second-sec'>
            <label>Currency
              <select
                required
                value={user.currency}
                onChange={(e) => setUser(prev => ({ ...prev, currency: e.target.value }))}
              >
                <option value=''>Select Currency</option>
                {countries.map((ctr) => (
                  <option key={ctr.isoCode} value={ctr.currency}>
                    {ctr.currency}
                  </option>
                ))}
              </select>
            </label>

            <label className='phon'>Phone Number
              <div>
                <select
                  value={phoneCode}
                  disabled
                  className='phone-first-sec'
                >
                  <option value=''></option>
                  {countries.map((ctr) => (
                    <option key={ctr.isoCode} value={ctr.phonecode}>
                      + {ctr.phonecode}
                    </option>
                  ))}
                </select>
                <input
                  placeholder='phone number...'
                  onChange={enterPhoneNum}
                  value={phoneNum}
                  type='tel'
                  className='phone-second-sec'
                  required
                />
              </div>
              <span ref={phoneNumRef} className="error-msg" style={{ display: 'none' }}>
                You must enter 9 digits beginning with either 5 or 6 or 7 !!!
              </span>
            </label>

            <label> Password
              <input
                value={pwd}
                type='password'
                onChange={handelPasswordChange}
                placeholder='password...'
                required
              />
              <p ref={pwdRef} className='error-msg' style={{ display: 'none' }}>
                You must enter at least 8 characters here !
              </p>
            </label>

            <label> Confirm Password
              <input
                value={confirmPwd}
                type='password'
                onChange={handelConfirmPasswordChange}
                placeholder='Confirm password...'
                required
              />
              <p ref={currentPwdRef} className='error-msg' style={{ display: 'none' }}>
                You must enter the same password as before !
              </p>
            </label>

            <button type='submit'>Create Account</button>
          </div>
        </form>
      </div>
    </div>
  )
}