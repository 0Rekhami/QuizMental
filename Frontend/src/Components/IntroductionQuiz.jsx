import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/IntQuiz.css';

const IntroductionPage = ({ onStartQuiz }) => {
  return (
    <div className='wrapper'>
    <div className="introduction-page">
      <h1>Welcome to the Quiz!</h1>
      <p>Welcome to our mental health assessment quiz. This quiz is designed to analyze
         various aspects of your mental well-being based on the data you provide.
          Our aim is to help you gain insights into your mental health status. 
          By answering the questions honestly, you'll assist our system in determining 
          whether you fall into one of the four categories: normal, experiencing symptoms
           of depression, showing signs of bipolar disorder type 1 or 2, or exhibiting symptoms
            of anxiety. Your responses will be carefully evaluated to provide you with a better
             understanding of your mental health condition. Remember, the more truthful and accurate
              your responses are, the more accurate the assessment will be. Let's get started on the
               journey to better mental health!</p>
      <Link to = '/Quiz'> <button onClick={onStartQuiz}>Start Quiz <b>{'>'}</b> </button></Link>
    </div>
    </div>
  );
};

export default IntroductionPage;
