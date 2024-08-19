import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Submit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(now.getHours() + 1, 0, 0, 0);
  const timeString = nextHour.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div className="card text-center">
        <div className="card-header">
          <h5 className="card-title">Submission Confirmation</h5>
        </div>
        <div className="card-body">
          <h5 className="card-title">Test Submitted Successfully!</h5>
          <p className="card-text">
            The result of your test will be sent to your registered email address at {timeString}.
          </p>
          <p className="card-text">
            Test ID: {id}
          </p>
          <p className="card-text">
            Redirecting in {seconds} seconds...
          </p>
        </div>
        <div className="card-footer text-muted">
          Thank you for your submission!
        </div>
      </div>
    </div>
  );
};

export default Submit;
