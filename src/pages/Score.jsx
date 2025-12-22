import { useLocation, useNavigate } from 'react-router-dom';
import './Score.css';

function Score() {
  const { state } = useLocation();
  const { role, level, score, total, userAnswers, questions } = state || {};
  const navigate = useNavigate();

  const incorrect = questions.filter((q, i) => userAnswers[i] !== q.answerIndex);

  return (
    <div className="score-wrapper">
      <h2>Quiz Results</h2>
      <p><strong>Role:</strong> {role}</p>
      <p><strong>Level:</strong> {level}</p>
      <p><strong>Score:</strong> {score * 10} / {total * 10}</p>
      <p>{score >= total / 2 ? '🎉 Great job!' : '📚 Keep practicing!'}</p>

      {incorrect.length > 0 && (
        <div className="review-section">
          <h3>Review Incorrect Answers</h3>
          {incorrect.map((q, i) => {
            const index = questions.indexOf(q);
            return (
              <div key={i} className="review-card">
                <p><strong>Q{index + 1}:</strong> {q.question}</p>
                <p><span className="label">Your answer:</span> {q.options[userAnswers[index]] || 'No answer'}</p>
                <p><span className="label">Correct answer:</span> {q.options[q.answerIndex]}</p>
              </div>
            );
          })}
        </div>
      )}

      <button className="dashboard-button" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default Score;