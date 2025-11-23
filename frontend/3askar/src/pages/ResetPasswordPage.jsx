import React, {useState, useEffect} from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const isValueEmpty = (value) => {
  if (typeof value === "string") return value.trim() === "";
  return !value;
};

const strongPasswordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const isStrongPassword = (value) => {
  if (typeof value !== "string") return false;
  return strongPasswordRegex.test(value);
};

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const getPasswordErrorMessage = () => {
    if (!showErrors) return "";
    if (isValueEmpty(newPassword)) return "Required";
    if (!isStrongPassword(newPassword)) {
      return "Use 8+ characters with upper, lower, number, and symbol.";
    }
    return "";
  };

  const getConfirmPasswordErrorMessage = () => {
    if (!showErrors) return "";
    if (isValueEmpty(confirmPassword)) return "Required";
    if (newPassword !== confirmPassword) return "Passwords do not match";
    return "";
  };

  const passwordErrorMessage = getPasswordErrorMessage();
  const confirmPasswordErrorMessage = getConfirmPasswordErrorMessage();

  // Redirect to login after successful password reset
  useEffect(() => {
    if (message && !error && !isSubmitting) {
      const timer = setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000); // 2 second delay to show success message
      return () => clearTimeout(timer);
    }
  }, [message, error, isSubmitting, navigate]);

  const handleResetPassword = async () => {
    setShowErrors(true);
    setError('');
    setMessage('');

    if (isValueEmpty(newPassword) || isValueEmpty(confirmPassword)) {
      setError('Please fill in both password fields.');
      return;
    }

    if (!isStrongPassword(newPassword)) {
      setError('Password must include upper/lower case letters, a number, a symbol, and be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch(`${API_URL}/auth/reset-password`, { //send data to backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const text = await res.text();

      if (!res.ok) {
        setError(text || 'Failed to reset password.');
      } else {
        setMessage(text || 'Password reset successfully. You can now sign in.');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {           // always stop the loading state
      setIsSubmitting(false);
    }
  };



  console.log("Token from URL:", token); //just to verify

  return(
    <Box
      sx={{minHeight: '100vh', display: 'grid', justifyContent: 'center', bg: '#f5f5f5'}}
    >
      

        <Paper sx={{ width: '10.6cm', p: 4, borderRadius: 2, height: 'fit-content' }} elevation={3}>
        <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
          Reset your password
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          Enter a new password for your account.
        </Typography>

        <TextField
          label="New password"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={Boolean(passwordErrorMessage)}
          helperText={passwordErrorMessage || " "}
        />

        <TextField
          label="Confirm new password"
          type="password"
          fullWidth
          sx={{ mb: 2 }}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={Boolean(confirmPasswordErrorMessage)}
          helperText={confirmPasswordErrorMessage || " "}
        />

        <Button
          variant="contained"
          sx={{ textTransform: 'none' }}
          onClick={handleResetPassword}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save password'}
        </Button>

        {message && (
          <Typography sx={{ mt: 2, color: 'green' }}>{message}</Typography>
        )}
        {error && (
          <Typography sx={{ mt: 2, color: 'red' }}>{error}</Typography>
        )}
      


      </Paper>
    </Box>
  );
}