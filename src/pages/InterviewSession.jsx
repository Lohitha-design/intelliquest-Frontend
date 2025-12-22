import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './InterviewSession.css';

const API_URL = process.env.REACT_APP_API_URL;

function InterviewSession() {
  const query = new URLSearchParams(useLocation().search);
  const initialRole = query.get('role');
  const navigate = useNavigate();

  const [role, setRole] = useState(initialRole || '');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [relevance, setRelevance] = useState(null);
  const [responses, setResponses] = useState([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [startSession, setStartSession] = useState(false);

  const roles = [
    'Data Analyst',
    'ML Engineer',
    'Gen AI Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Cybersecurity Analyst'
  ];

  useEffect(() => {
    if (!role || !startSession) return;

    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${API_URL}/api/interview/${role}`);
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        console.error('Error fetching interview questions:', err);
      }
    };

    fetchQuestions();
  }, [role, startSession]);

  const calculateRelevance = (user, correct) => {
    const userWords = user.toLowerCase().split(/\W+/);
    const correctWords = correct.toLowerCase().split(/\W+/);
    const matchCount = userWords.filter(word => correctWords.includes(word)).length;
    return Math.round((matchCount / correctWords.length) * 100);
  };

  const handleSubmit = () => {
    const currentQuestion = questions[currentIndex];
    const relevanceScore = calculateRelevance(userAnswer, currentQuestion.answer);

    const newResponse = {
      role,
      question: currentQuestion.question,
      userAnswer,
      correctAnswer: currentQuestion.answer,
      relevance: relevanceScore
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    localStorage.setItem('interviewResponses', JSON.stringify(updatedResponses));

    setRelevance(relevanceScore);
    setUserAnswer('');

    if (currentIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setRelevance(null);
      }, 2000);
    } else {
      setSessionComplete(true);
    }
  };

  useEffect(() => {
    if (sessionComplete && responses.length > 0) {
      fetch(`${API_URL}/api/performance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, responses })
      })
        .then(res => res.json())
        .then(data => console.log('Responses saved:', data))
        .catch(err => console.error('Save error:', err));
    }
  }, [sessionComplete, responses, role]);

  const handleRoleSelect = e => {
    setRole(e.target.value);
  };

  const handleStartInterview = () => {
    navigate(`/interview?role=${encodeURIComponent(role)}`);
    setStartSession(true);
  };

  return (
    <div className="interview-wrapper">
      <h2>Interview Session</h2>

      {!startSession ? (
        <div className="role-selector">
          <p>Please select a role to begin:</p>
          <select onChange={handleRoleSelect} value={role}>
            <option value="" disabled>Select a role</option>
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {role && (
            <button className="start-button" onClick={handleStartInterview}>
              Start Interview
            </button>
          )}
        </div>
      ) : questions.length > 0 && !sessionComplete ? (
        <div className="interview-card">
          <p><strong>Q{currentIndex + 1}:</strong> {questions[currentIndex].question}</p>

          <textarea
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
          />

          <button onClick={handleSubmit} disabled={!userAnswer.trim()}>
            Submit Answer
          </button>

          {relevance !== null && (
            <p className="relevance-score">Relevance: {relevance}%</p>
          )}
        </div>
      ) : questions.length === 0 && role ? (
        <p>Loading questions for {role}...</p>
      ) : (
        <div className="interview-complete">
          <p>✅ Interview session complete!</p>
          <p>Your responses have been saved for review.</p>
        </div>
      )}

      <button className="dashboard-button" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default InterviewSession;
