import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import './Test.css';

const shuffleArray = (array) => {
    let shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const Test = ({ test }) => {
    const [timeLeft, setTimeLeft] = useState(test.time || 3600);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [questionno, setQuestionno] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [hasPermissions, setHasPermissions] = useState(false);
    const [questions, setQuestions] = useState([]);
    const { id } = useParams();
    const [loading, setloading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        // Shuffle questions when component mounts
        setQuestions(shuffleArray(test.questions));
    }, [test.questions]);

    const handleOptionSelect = (questionId, option) => {
        setSelectedOptions(prev => ({
            ...prev,
            [questionId]: {
                option,
                savedAt: new Date()
            }
        }));
    };

    const handleQuestionClick = (index) => {
        setQuestionno(index);
    };

    const handleClearResponse = () => {
        setSelectedOptions(prev => {
            const newOptions = { ...prev };
            delete newOptions[questions[questionno]?._id];
            return newOptions;
        });
    };

    const requestPermissions = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setHasPermissions(true);
            setloading(false);
        } catch (err) {
            alert('You need to grant permission to access camera and microphone to attempt this test.');
            window.location.reload();
        }
    };

    useEffect(() => {
        requestPermissions();
    }, []);

    const handleSubmit = async () => {
        try {
            const formattedSelections = Object.keys(selectedOptions).map(questionId => ({
                questionId,
                option: selectedOptions[questionId].option,
                savedAt: selectedOptions[questionId].savedAt,
            }));

            const res = await axios.post("/server/api/test/submittest", {
                testId: id,
                selections: formattedSelections
            }, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            });

            localStorage.clear("token");
            navigate(`/submit/${id}`);

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
    };

    useEffect(() => {
        const calculateTime = (seconds) => {
            const hrs = Math.floor(seconds / 3600);
            const mins = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            setHours(hrs);
            setMinutes(mins);
            setSeconds(secs);
        };

        calculateTime(timeLeft);

        if (timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);

            return () => clearTimeout(timer);
        } else {
            handleSubmit(); // Auto-submit when time runs out
        }
    }, [timeLeft]);

    const currentQuestion = questions[questionno];

    if (loading) return <div className='d-flex justify-content-center align-items-center' style={{ height: "90vh" }}><h1>Loading...</h1></div>;

    return (
        <div className='container'>
            {hasPermissions && (
                <div className='row'>
                    <div className='col-md-8 d-flex flex-column'>
                        <div className='card'>
                            <div className='card-header text-center'>
                                <h1 className="display-4">{test.title}</h1>
                            </div>
                            <div className='card-body' style={{ height: "78vh", overflowY: "auto" }}>
                                <div className="mt-3">
                                    {currentQuestion && (
                                        <>
                                            <h4>Question {questionno + 1}: {currentQuestion.question}</h4>
                                            {currentQuestion.options.map((option, index) => (
                                                <div key={index} className='form-check mt-2'>
                                                    <input
                                                        className='form-check-input'
                                                        type="radio"
                                                        name={`question-${currentQuestion._id}`}
                                                        checked={selectedOptions[currentQuestion._id]?.option === option}
                                                        onChange={() => handleOptionSelect(currentQuestion._id, option)}
                                                    />
                                                    <label className='form-check-label'>
                                                        {option}
                                                    </label>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className='mt-auto d-flex justify-content-between card-footer'>
                                <button className='btn btn-primary' disabled={questionno === 0} onClick={() => setQuestionno(questionno - 1)}>Previous</button>
                                <button className='btn btn-primary' disabled={questionno === questions.length - 1} onClick={() => setQuestionno(questionno + 1)}>Next</button>
                                <button className='btn btn-danger' disabled={!selectedOptions[currentQuestion?._id]} onClick={handleClearResponse}>Clear Response</button>
                                <button className='btn btn-success' onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4'>
                        <div className='card text-center h-25'>
                            <div className='card-header'>
                                <h3>Time Left</h3>
                            </div>
                            <div className='card-body'>
                                <div className='d-flex justify-content-around'>
                                    <div>
                                        <h5>{String(hours).padStart(2, '0')}</h5>
                                        <p>Hours</p>
                                    </div>
                                    <div>
                                        <h5>{String(minutes).padStart(2, '0')}</h5>
                                        <p>Minutes</p>
                                    </div>
                                    <div>
                                        <h5>{String(seconds).padStart(2, '0')}</h5>
                                        <p>Seconds</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='card mt-3'>
                            <div className='card-header'>
                                <h5 className="card-title text-center">Questions</h5>
                            </div>
                            <div className='card-body' style={{ maxHeight: '120px', overflowY: 'scroll' }}>
                                <div className='d-flex flex-wrap justify-content-evenly'>
                                    {questions.map((question, index) => (
                                        <button
                                            key={question._id}
                                            onClick={() => handleQuestionClick(index)}
                                            className={`btn mt-1 me-1 btn-${index === questionno ? 'primary' : (selectedOptions[question._id] ? 'success' : 'danger')}`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='card mt-3'>
                            <div className='card-header m-0'>
                                <h5 className="card-title text-center">Camera</h5>
                            </div>
                            <div className='card-body'>
                                <div className='d-flex justify-content-center'>
                                    <Webcam width="200px" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Test;
