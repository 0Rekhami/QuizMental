import React, { useEffect } from 'react';
import '../Styles/Quiz.css';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryLabel } from 'victory';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Image1 from "../Images/mental-health-icon-logo-awareness-vector-28590941-removebg-preview.png";
import out from "../Images/icons/logout.png";
import out2 from "../Images/icons/profile.png";

import im1 from "../Images/depression.jpg";
import im2 from "../Images/bipolar2.jpg";
import im3 from "../Images/bipolar1.png";

const QuizResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (!location.state) {
      navigate("/Home"); 
    }
  }, [location.state, navigate]);

  if (!location.state) {
    return null; 
  }
  const { predictedLabel, labelNames, percentages } = location.state;

  const labelNamesArray = Object.values(labelNames);

  const labelDefinitions = [
    { 
      label: "Depression", 
      definition: "Depression is a mood disorder that causes a persistent feeling of sadness and loss of interest. It affects how you feel, think, and handle daily activities. Symptoms may include feelings of sadness, hopelessness, irritability, and changes in appetite or sleep patterns. Depression can vary in severity and may require treatment such as therapy, medication, or a combination of both. It's important to seek help from a mental health professional if you're experiencing symptoms of depression.",
      latestStudies: [
        "A recent study published in the Journal of Clinical Psychiatry found that a combination of cognitive-behavioral therapy and antidepressant medication was more effective in treating severe depression than either treatment alone.",
        "Another study published in JAMA Psychiatry suggested a link between inflammation and depression, indicating potential new avenues for treatment targeting the immune system."
      ],
      image: im1 
    },
    { 
      label: "Bipolar Type-1", 
      definition: "Bipolar Type-1 disorder, formerly known as manic depression, is a mental health condition characterized by periods of extreme mood swings that include emotional highs (mania or hypomania) and lows (depression). Manic episodes may involve feelings of euphoria, increased energy, and impulsivity, while depressive episodes may involve feelings of sadness, hopelessness, and low energy. Bipolar Type-1 disorder can significantly impact daily functioning and may require treatment with mood stabilizers, therapy, and lifestyle changes. Without proper management, bipolar Type-1 disorder can lead to problems in relationships, work, and other areas of life.",
      latestStudies: [
        "Recent research published in the American Journal of Psychiatry identified specific genetic markers associated with bipolar disorder, potentially leading to more targeted treatments.",
        "A study published in Molecular Psychiatry suggested that omega-3 fatty acids may help reduce symptoms of depression and mania in individuals with bipolar disorder."
      ],
      image: im2 
    },
    { 
      label: "Bipolar Type-2", 
      definition: "Bipolar Type-2 disorder is a subtype of bipolar disorder characterized by recurrent depressive episodes and hypomanic episodes, but not the full-blown manic episodes that are typical of Bipolar Type-1 disorder. Hypomanic episodes involve milder symptoms of mania, such as increased energy, creativity, and productivity, without severe impairment in functioning. Bipolar Type-2 disorder can still have a significant impact on daily life and may require treatment with mood stabilizers, therapy, and lifestyle adjustments. It's important for individuals with Bipolar Type-2 disorder to work closely with a mental health professional to manage symptoms and prevent relapses.",
      latestStudies: [
        "A study published in Bipolar Disorders found evidence supporting the effectiveness of mindfulness-based interventions in reducing depressive symptoms and improving overall quality of life in individuals with bipolar disorder.",
        "Research published in the Journal of Affective Disorders suggested a potential role for certain dietary interventions, such as the Mediterranean diet, in reducing the risk of mood episodes in individuals with bipolar disorder."
      ],
      image: im3 
    }
  ];
  
  

  const data = labelNamesArray.map((label, index) => ({
    label: label,
    value: percentages[index],
  }));
  const matchingDefinition = labelDefinitions.find(item => item.label === predictedLabel);
  return (
    <>
 <div className="nav_container nav_container3">
           <nav>
             <div className="listdiv1">
               <ul className="unlist1 unlist">
                 <li><a><Link to='/'>Home</Link></a></li>
                 {/* <li><a href="">Services</a></li> */}
               </ul>
             </div>
             {/* <div>
               <img className="logo" src={Image1}
                 alt="" />
             </div> */}
             <div className="listdiv2">
               {/* <ul className="unlist1 listo listo2">
                 <li className="unlist A logout"><Link to="/"><img src={out}/></Link></li>
                 <li className="Sign-up USER"><Link to="/"><img src={out2}/></Link></li>
               </ul> */}
             </div>
           </nav>
         </div>
    <div className='Quizresult'>
      <div className='result'>
        
        <div className='chart'>
        <VictoryChart 
          domainPadding={20}
          animate={{ duration: 500 }}
        >
          <VictoryAxis
            tickValues={labelNamesArray.map((_, index) => index + 1)}
            tickFormat={labelNamesArray}
            style={{
              tickLabels: { fontSize: 8, angle: -45 },
            }}
          />
          <VictoryAxis dependentAxis />
          <VictoryBar
            data={data}
            x="label"
            y="value"
            style={{
              data: { fill: 'teal' },
            }}
          />
        </VictoryChart>
        </div>
        <h2>Predicted Mental state : {predictedLabel}</h2>
        <div className='DefinitionCard'>
         {matchingDefinition && (
        <div>
          <h3>What is {predictedLabel}?</h3>
          <div className='flexx'>
                      <img className='im' src={matchingDefinition.image} alt="" />
          <p>{matchingDefinition.definition}</p>
          </div>

          <h4>Latest Studies:</h4>
          
            {matchingDefinition.latestStudies.map((study, index) => (
              
              <p>{study}</p>
            ))}
          
        </div>
      )}
    </div>

      </div>
    </div>
    </>
  );
};

export default QuizResults;
