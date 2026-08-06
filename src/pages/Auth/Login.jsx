import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Form from "../../components/Form/Form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { formContainsEmptyValues } from "../../utils/validation";
import { parseError } from "../../utils/helperMethods";
import { notifyError } from "../../utils/toastMethods";
import { TOAST_POSITIONS } from "../../utils/constants";
import * as api from "../../api/authentication";

const { TOP_CENTER } = TOAST_POSITIONS;

const Login = ({ isLoading, setIsLoading }) => {
  const { setIsLoggedIn, setUser } = useAuth();
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const handleSubmit = () => {
    if (!formContainsEmptyValues(loginForm)) {
      setIsLoading(true);
      api
        .login(loginForm)
        .then((data) => {
          setIsLoggedIn(true);
          setUser(data.user);
        })
        .catch((err) => notifyError(parseError(err), TOP_CENTER))
        .finally(() => setIsLoading(false));
    }
  };

  const handleChange = (e) =>
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  return (
    <Form id="login-form">
      <TextField
        id="login-email"
        label="Email Address"
        type="email"
        placeholder="Email"
        name="email"
        value={loginForm.email}
        onChange={handleChange}
        inputProps={{ maxLength: 150 }}
        fullWidth
        margin="normal"
        sx={{ backgroundColor: "white" }}
      />

      <TextField
        id="login-password"
        label="Password"
        type="password"
        placeholder="Password"
        name="password"
        value={loginForm.password}
        onChange={handleChange}
        inputProps={{ maxLength: 255 }}
        fullWidth
        margin="normal"
        sx={{ backgroundColor: "white" }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={isLoading}
        type="button"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        {isLoading ? <CircularProgress size={18} color="inherit" /> : "Login"}
      </Button>
    </Form>
  );
};

export default Login;
