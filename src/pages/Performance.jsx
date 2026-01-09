import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import './Performance.css';

const API_URL = process.env.REACT_APP_API_URL;

function Performance() {
  const [chartData, setChartData] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [improvements, setImprovements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        // ✅ Get userId dynamically (adjust based on your auth setup)
        const userId = localStorage.getItem('userId') || 'demo123';

        console.log("Fetching performance for userId:", userId);

        const res = await fetch(`${API_URL}/api/performance/${userId}`);
        const data = await res.json();

        console.log("Performance API data:", data);

        // Merge sessions and skills by date
        const combinedMap = new Map();

        (data.sessions || []).forEach(session => {
          const key = session.date;
          combinedMap.set(key, {
            date: key,
            avgRelevance: session.avgRelevance
          });
        });

        (data.skills || []).forEach(skill => {
          const key = skill.date;
          const existing = combinedMap.get(key) || { date: key };
          existing.skillScore = skill.score;
          combinedMap.set(key, existing);
        });

        const mergedData = Array.from(combinedMap.values()).sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        console.log("Merged chart data:", mergedData);

        setChartData(mergedData);
        setStrengths(data.strengths || []);
        setImprovements(data.improvements || []);
      } catch (err) {
        console.error('Error fetching performance:', err);
      }
    };

    fetchPerformance();
  }, []);

  return (
    <div className="performance-wrapper">
      <h2>📈 Your Growth Over Time</h2>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="avgRelevance"
              stroke="#00BFA6"
              name="Interview Relevance"
            />
            <Line
              type="monotone"
              dataKey="skillScore"
              stroke="#FF6F61"
              name="Skill Test Score"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No performance data available yet.</p>
      )}

      <div className="summary-section">
        <h3>✅ Strengths</h3>
        <ul>
          {strengths.map((s, i) => (
            <li key={i}>🟢 {s}</li>
          ))}
        </ul>

        <h3>⚠️ Areas to Improve</h3>
        <ul>
          {improvements.map((i, j) => (
            <li key={j}>🔴 {i}</li>
          ))}
        </ul>
      </div>

      <button className="dashboard-button" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
}

export default Performance;