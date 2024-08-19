import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('/server/api/test/gettests', {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        });
        setTests(response.data.test);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch tests.');
        setLoading(false);
      }
    };

    fetchTests();
    localStorage.clear("token");
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Available Tests</h2>
      <div className="row">
        {tests.length > 0 ? (
          tests.map((test) => (
            <div className="col-md-4 col-sm-6 mb-4" key={test._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{test.title}</h5>
                  <p className="card-text">{test.description}</p>
                  <a href={`/login?redirect=${test._id}`} className="btn btn-primary">
                    Start Test
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center w-100">No tests available.</div>
        )}
      </div>
    </div>
  );
};

export default Tests;
