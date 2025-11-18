import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function EmotionCharts({ results }) {

  const emotionScores = {};
  results.forEach((r) => {
    Object.entries(r.emotions).forEach(([emotion, value]) => {
      emotionScores[emotion] = (emotionScores[emotion] || 0) + value;
    });
  });

  const data = Object.entries(emotionScores)
    .map(([emotion, value]) => ({ name: emotion, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  const COLORS = ["#6a11cb", "#2575fc", "#ff6b6b", "#00b894", "#ffeaa7", "#fd79a8", "#74b9ff"];

  return (
    <div className="charts">
      <div className="chart-box">
        <h3>Emotion Distribution (Top 7)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-box">
        <h3>Emotion Intensity</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#2575fc" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
