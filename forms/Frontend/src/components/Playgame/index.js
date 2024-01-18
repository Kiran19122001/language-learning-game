import { useState, useEffect } from "react";
import Axios from "axios";
import "./index.css";

const Playgame = () => {
  const [data, setData] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    getQuestions();
  }, []);

  const getQuestions = async () => {
    try {
      const response = await Axios.get("http://localhost:1000/api/questions");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleRadioChange = (questionNumber, selectedOption) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionNumber]: selectedOption,
    }));
  };

  const handleGradeButtonClick = () => {
    if (Object.keys(userAnswers).length !== data.questions.length) {
      setValidationError("Please answer all questions before grading.");
      return;
    }

    let correctCount = 0;

    data.questions.forEach((qns) => {
      const userAnswer = userAnswers[qns.questionNumber];
      if (userAnswer && userAnswer === qns.correctAnswer) {
        correctCount++;
      }
    });

    setTotalCorrect(correctCount);
    setValidationError("");
  };

  const questionsData = data.questions;

  return (
    <div>
      <h1>Playgame</h1>
      <form className="form-qns">
        <ul className="ulcontainer">
          {questionsData ? (
            questionsData.map((qns) => (
              <li key={qns.questionNumber} className="question-container">
                <div className="d-flex">
                  <p>Q.{qns.questionNumber}</p>
                  <p>{qns.question}</p>
                </div>
                <div className="options">
                  {qns.options.map((opt, index) => (
                    <label key={index} className="d-flex align-items-center">
                      <input
                        type="radio"
                        name={`question-${qns.questionNumber}`}
                        onChange={() =>
                          handleRadioChange(qns.questionNumber, opt)
                        }
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </li>
            ))
          ) : (
            <li>Loading questions...</li>
          )}
        </ul>
        {validationError && (
        <p style={{ color: "red" }}>{validationError}</p>
      )}
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleGradeButtonClick}
        >
          Grade me!
        </button>
      </form>
     
      {totalCorrect > 0 && (
        <p>Total Correct Answers: {totalCorrect}</p>
      )}
    </div>
  );
};

export default Playgame;
