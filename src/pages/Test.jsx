import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Test.css';

function Test() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const navigate = useNavigate();

  const roles = [
    'Data Analyst',
    'ML Engineer',
    'GenAI Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Cybersecurity Analyst',
  ];

  const levels = ['Easy', 'Medium', 'Hard'];

  const handleStartTest = () => {
    navigate(
      `/questions?role=${encodeURIComponent(selectedRole)}&level=${encodeURIComponent(selectedLevel)}`
    );
  };

  return (
    <div className="test-wrapper">
      <div className="test-box">
        <h2>Take a Skill Test</h2>

        {step === 1 && (
          <button onClick={() => setStep(2)}>Choose Role</button>
        )}

        {step === 2 && (
          <>
            <h3>Select a Role</h3>
            <div className="options-grid">
              {roles.map((role) => (
                <button
                  key={role}
                  className={selectedRole === role ? 'selected' : ''}
                  onClick={() => {
                    setSelectedRole(role);
                    setStep(3);
                  }}
                >
                  {role}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h3>Select Difficulty</h3>
            <div className="options-grid">
              {levels.map((level) => (
                <button
                  key={level}
                  className={selectedLevel === level ? 'selected' : ''}
                  onClick={() => {
                    setSelectedLevel(level);
                    setStep(4);
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h3>Ready to Begin</h3>
            <p>
              Role: <strong>{selectedRole}</strong> <br />
              Level: <strong>{selectedLevel}</strong>
            </p>
            <button onClick={handleStartTest}>Take Test</button>
          </>
        )}

        {/* ✅ Back to Dashboard button */}
        <button
          className="dashboard-button"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Test;