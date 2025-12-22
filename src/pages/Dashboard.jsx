import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h3>IntelliQuest</h3>
        <ul>
          <li onClick={() => navigate('/interview')}>Interview Sessions</li>
          <li onClick={() => navigate('/test')}>Tests</li>
          <li onClick={() => navigate('/performance')}>Performance</li>
        </ul>
      </aside>

      <main className="main-content">
        <section className="hero">
          <h1>Welcome to IntelliQuest</h1>
          <p>
            IntelliQuest is your personal learning and assessment companion — designed to help you
            prepare for interviews, take smart tests, and track your performance with clarity.
          </p>
        </section>

        <section className="features">
          <h2>Why IntelliQuest?</h2>
          <ul>
            <li>🎯 Practice real-world interview questions</li>
            <li>🧠 Take adaptive tests tailored to your skill level</li>
            <li>📊 Get performance insights to improve faster</li>
          </ul>
        </section>

        <section className="coming-soon">
          <h2>Coming Soon</h2>
          <p>
            We’re building modules that simulate live interviews, generate custom quizzes, and
            visualize your growth — all in one place.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;