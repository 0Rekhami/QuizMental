import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/Quiz.css";
import { Link, useNavigate } from "react-router-dom";

const Quiz = () => {
  const [questions, setQuestions] = useState({});
  const [responses, setResponses] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [predictedLabel, setPredictedLabel] = useState("");
  const [labelNames, setLabelNames] = useState([]);
  const [percentages, setPercentages] = useState([]);
  const navigate = useNavigate();
  const [stateObject, setStateObject] = useState(null);
  const [showDiv1, setShowDiv1] = useState(true);
  const [showDiv2, setShowDiv2] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/questions");
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleResponseChange = (questionKey, value) => {
    setResponses({
      ...responses,
      [questionKey]: value,
    });
  };

  const handleNext = () => {
    const currentQuestionKey = Object.keys(questions)[currentQuestionIndex];
    const questionData = questions[currentQuestionKey];

    if (questionData.choices && responses[currentQuestionKey] === undefined) {
      alert("Please select an option for the current question.");
      return;
    }

    if (
      questionData.inputType === "number" &&
      (responses[currentQuestionKey] === undefined ||
        isNaN(responses[currentQuestionKey]) ||
        responses[currentQuestionKey] < questionData.minValue ||
        responses[currentQuestionKey] > questionData.maxValue)
    ) {
      alert("Please enter a valid value for the current question.");
      return;
    }

    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/submit",
        responses
      );
      const responseData = response.data;

      setPredictedLabel(responseData.predicted_label);
      setLabelNames(responseData.labelNames);
      setPercentages(responseData.percentages);

      const newStateObject = {
        predictedLabel: responseData.predicted_label,
        labelNames: responseData.labelNames,
        percentages: responseData.percentages,
      };
      

      setStateObject(newStateObject);
      setShowDiv1(false);
      setShowDiv2(true);
      console.log("Submission successful:", responseData);
    } catch (error) {
      console.error("Error submitting responses:", error);
    }
  };

  const renderQuestion = (questionKey, questionData) => {
    const isRequired = questionData.required && formSubmitted;
    return (
      <div key={questionKey}>
        <p className="question">
          <b>
            {questionData.question}{" "}
            {isRequired && <span style={{ color: "red" }}>*</span>}
          </b>
        </p>
        {questionData.choices
          ? renderRadioButtons(questionKey, questionData.choices)
          : renderInputField(questionKey, questionData, isRequired)}
      </div>
    );
  };

  const renderRadioButtons = (questionKey, choices) => {
    return (
      <div className="Radios">
        {choices.map((choice) => (
          <label key={choice.value}>
            <input
              type="radio"
              name={questionKey}
              value={choice.value}
              checked={responses[questionKey] === choice.value}
              onChange={() => handleResponseChange(questionKey, choice.value)}
            />
            {choice.label}
          </label>
        ))}
      </div>
    );
  };

  const renderInputField = (questionKey, questionData, isRequired) => {
    return (
      <input
        className="inputs"
        type={questionData.inputType}
        min={questionData.minValue}
        max={questionData.maxValue}
        value={responses[questionKey] || ""}
        onChange={(e) => handleResponseChange(questionKey, e.target.value)}
        required={isRequired} 
      />
    );
  };
  
  return (
    <div className="quiz0">
        <div className="quiz_container" style={{ display: showDiv1 ? 'block' : 'none' }} > 
          <h2>
            Question {currentQuestionIndex + 1} /{" "}
            {Object.keys(questions).length}
          </h2>
          {Object.entries(questions).map(([key, data], index) =>
            index === currentQuestionIndex ? renderQuestion(key, data) : null
          )}
          <button
            onClick={handlePrevious}
            style={{ display: currentQuestionIndex === 0 ? "none" : "initial" }}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            style={{
              display:
                currentQuestionIndex === Object.keys(questions).length - 1
                  ? "none"
                  : "initial",
            }}
          >
            Next
          </button>
          {currentQuestionIndex === Object.keys(questions).length - 1 && (
              <button onClick={handleSubmit}>Submit</button>
          )}
        </div>
        <div className="success" style={{ display: showDiv2 ? 'block' : 'none' }} >
             <h2>Submission successful!</h2>
             <button
                className="viewresult"
                onClick={() => navigate("/QuizResults", { state: stateObject })}
              >
                View Results <b>{'>'}</b>
              </button>
        </div>
     
    </div>
  );
};

export default Quiz;
