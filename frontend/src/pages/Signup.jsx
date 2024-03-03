import axios from "axios";
import { useState } from "react";
const Signup = () => {
  const [userSignUpForm, setUserSignUpForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    password: "",
  });

  const formHandler = (e) => {
    const { name, value } = e.target;
    setUserSignUpForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  return (
    <div>
      <h1>Sign up</h1>
      <p>Enter your information to create an account</p>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log(userSignUpForm);
            axios
              .post("http://localhost:3001/api/v1/user/signup", {
                ...userSignUpForm,
              })
              .then((res) => {
                console.log(res.data);
                localStorage.setItem("token", res.data.token);
              })
              .catch((err) => {
                const data = err.response.data;
                console.log(data);
              });
          }}
        >
          <div className="py-3">
            <label htmlFor="firstName">First Name</label>
            <br />
            <input
              type="text"
              name="firstName"
              id="firstName"
              className="rounded border-2 border-blue-100"
              value={userSignUpForm.firstName}
              onChange={formHandler}
            />
          </div>
          <div className="py-3">
            <label htmlFor="lastName">Last Name</label>
            <br />
            <input
              type="text"
              name="lastName"
              id="lastName"
              className="rounded border-2 border-blue-100"
              value={userSignUpForm.lastName}
              onChange={formHandler}
            />
          </div>
          <div className="py-3">
            <label htmlFor="userName">Email</label>
            <br />
            <input
              type="email"
              name="userName"
              id="userName"
              className="rounded border-2 border-blue-100"
              value={userSignUpForm.email}
              onChange={formHandler}
            />
          </div>
          <div className="py-3">
            <label htmlFor="password">Password</label>
            <br />
            <input
              type="password"
              name="password"
              id="password"
              className="rounded border-2 border-blue-100"
              value={userSignUpForm.password}
              onChange={formHandler}
            />
          </div>
          <div className="py-3">
            <button
              type="submit"
              className="rounded border-2 bg-blue-400 text-white flex"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
