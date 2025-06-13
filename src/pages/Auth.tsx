
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new sign-in page
    navigate('/sign-in', { replace: true });
  }, [navigate]);
  
  return null;
}
