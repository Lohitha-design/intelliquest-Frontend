import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Questions.css';

const API_URL = process.env.REACT_APP_API_URL;

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const query = new URLSearchParams(useLocation().search);
  const role = query.get('role');
  const level = query.get('level');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/questions/quiz?role=${role}&level=${level}&count=10`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setQuestions(data);
        } else {
          setQuestions([]);
          setError('Unexpected response format. No questions found.');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [role, level]);

  const handleOptionClick = (qIndex, optIndex) => {
    setUserAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmit = async () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.answerIndex) score++;
    });

    try {
      // Example: get userId from localStorage or context
      const userId = localStorage.getItem('userId') || 'demoUser';

      // Send responses to backend
      await fetch(`${API_URL}/api/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          role,
          level,
          score,
          total: questions.length,
          answers: questions.map((q, i) => ({
            question: q.question,
            userAnswer: q.options[userAnswers[i]],
            correctAnswer: q.options[q.answerIndex],
            relevance: userAnswers[i] === q.answerIndex ? 100 : 0
          }))
        })
      });
    } catch (err) {
      console.error('Error saving responses:', err);
      alert('Failed to save your quiz results.');
    }

    // Navigate to score page
    navigate('/score', {
      state: { role, level, score, total: questions.length, userAnswers, questions }
    });
  };

  return (
    <div className="questions-wrapper">
      <h2>{role} Test ({level})</h2>

      {loading && <p>Loading questions...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && questions.length === 0 && (
        <div className="empty-state">
          <p>No questions available for this role and level yet.</p>
          <p>Please check back later or try a different combination.</p>
        </div>
      )}

      {!loading && !error && questions.length > 0 && (
        <>
          {questions.map((q, i) => (
            <div key={i} className="question-card">
              <p><strong>Q{i + 1}:</strong> {q.question}</p>
              <ul>
                {q.options.map((opt, idx) => (
                  <li
                    key={idx}
                    className={userAnswers[i] === idx ? 'selected' : ''}
                    onClick={() => handleOptionClick(i, idx)}
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={Object.keys(userAnswers).length < questions.length}
          >
            Submit Quiz
          </button>
        </>
      )}
    </div>
  );
}

export default Questions;