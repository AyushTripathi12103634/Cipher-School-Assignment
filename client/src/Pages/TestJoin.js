import React, { useEffect, useState } from 'react';
import TestScreen from './Test';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TestJoin = () => {
    const [test, setTest] = useState();
    const [start, setStart] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            toast.error('Login to attempt the test!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            navigate(`/login?redirect=${id}`);
        }
    }, [id, navigate]);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const res = await axios.get(`/server/api/test/gettest/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                });
                setTest(res.data.test);
                toast.success(`${res.data.message}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
            } catch (error) {
                toast.error(`${error.response.data.message}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
            }
        }
        if (localStorage.getItem("token")) fetchTest();
    }, [id]);

    // console.log(test)

    if (!test) return <h1 className="text-center my-5">Loading...</h1>;

    if (!start) return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card shadow-lg" style={{ width: '20em' }}>
                <div className="card-body text-center">
                    <h1 className="display-4">{test.title}</h1>
                </div>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item text-center">
                        <strong>Description:</strong> {test.descriptions}
                    </li>
                    <li className="list-group-item text-center">
                        <strong>Time:</strong> {test.time ? test.time : "60"} minutes
                    </li>
                    <li className="list-group-item text-center">
                        <strong>Questions:</strong> {test.questions.length}
                    </li>
                </ul>
                <div className="card-body text-center">
                    <button className="btn btn-primary btn-lg mt-3" onClick={() => setStart(true)}>Start Test</button>
                </div>
            </div>
        </div>
    );

    if (start) {
        return <TestScreen test={test} />;
    }
};

export default TestJoin;
