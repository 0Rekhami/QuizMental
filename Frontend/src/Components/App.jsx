import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages principales
import Home from './Home';
import Quiz from './Quiz';
import IntQuiz from './IntroductionQuiz';
import QuizResults from './QuizResults';

// Community Support (si tu veux les garder)
import CommunitySupport from './CommunitySupport';
import Introduction from './Introductions';
import Share from './Share Experiences';
import Askquestion from './Ask Questions';
import Support from './Support Others';

const App = () => {
  return (
    <Router>
      <Routes>

        {/* Pages principales */}
        <Route path="/" element={<Home />} />
        <Route path="/IntQuiz" element={<IntQuiz />} />
        <Route path="/Quiz" element={<Quiz />} />
        <Route path="/QuizResults" element={<QuizResults />} />

        {/* Community Support */}
        {/* <Route path="/CommunitySupport" element={<CommunitySupport />} />
        <Route path="/CommunitySupport/Introductions" element={<Introduction />} />
        <Route path="/CommunitySupport/Share Experiences" element={<Share />} />
        <Route path="/CommunitySupport/Ask Questions" element={<Askquestion />} />
        <Route path="/CommunitySupport/Support Others" element={<Support />} /> */}

      </Routes>
    </Router>
  );
};

export default App;
