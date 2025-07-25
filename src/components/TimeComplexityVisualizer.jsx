// components/TimeComplexityVisualizer.jsx
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TimeComplexityVisualizer() {
  const [c, setC] = useState(1);
  const [n0, setN0] = useState(1);
  const [maxN, setMaxN] = useState(100);
  const [fnExpr, setFnExpr] = useState("n");
  const [gnType, setGnType] = useState("nlogn");

  const labels = Array.from({ length: maxN }, (_, i) => i + 1);

  const parseFn = (expr, n) => {
    try {
      return Function("n", `return ${expr}`)(n);
    } catch (e) {
      return NaN;
    }
  };

  const g = (n) => {
    switch (gnType) {
      case "linear": return n;
      case "quadratic": return n * n;
      case "logn": return Math.log2(n);
      case "nlogn": return n * Math.log2(n);
      case "exponential": return Math.pow(2, n ); 
      default: return n * Math.log2(n);
    }
  };

  const f_n = labels.map((n) => parseFn(fnExpr, n));
  const c_g_n = labels.map((n) => (n >= n0 ? c * g(n) : null));

  const data = {
    labels,
    datasets: [
      {
        label: `f(n)`,
        data: f_n,
        borderColor: "#1f77b4",
        fill: false,
      },
      {
        label: `c·g(n)` + (n0 > 1 ? ` (from n ≥ ${n0})` : ""),
        data: c_g_n,
        borderColor: "#ff7f0e",
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  return (
    <div className="relative min-h-screen p-4 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-600 text-center md:text-left">Configure f(n), c and n0 for g(n)</h2>

        <div>
          <label className="block font-medium">Enter f(n) expression</label>
          <input
            type="text"
            value={fnExpr}
            onChange={(e) => setFnExpr(e.target.value)}
            placeholder="e.g., n, n*n, n*Math.log2(n)"
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block font-medium">Select g(n) type</label>
          <select
            value={gnType}
            onChange={(e) => setGnType(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="linear">g(n) = n</option>
            <option value="logn">g(n) = log₂n</option>
            <option value="nlogn">g(n) = n log₂n</option>
            <option value="quadratic">g(n) = n²</option>
            <option value="exponential">g(n) = 2ⁿ</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">c (constant multiplier)</label>
          <input
            type="range"
            min="0.5"
            max="200"
            step="0.5"
            value={c}
            onChange={(e) => setC(parseFloat(e.target.value))}
            className="w-full"
          />
          <p className="text-sm">c = {c}</p>
        </div>

        <div>
          <label className="block font-medium">n₀ (threshold)</label>
          <input
            type="range"
            min="1"
            max="50"
            step="1"
            value={n0}
            onChange={(e) => setN0(parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-sm">n₀ = {n0}</p>
        </div>

        <div>
          <label className="block font-medium">Max input size (n)</label>
          <input
            type="range"
            min="10"
            max="200"
            step="10"
            value={maxN}
            onChange={(e) => setMaxN(parseInt(e.target.value))}
            className="w-full"
          />
          <p className="text-sm">Max n = {maxN}</p>
        </div>
        <div>
          <a
            href="https://spangled-airport-56f.notion.site/Warm-up-Practice-Questions-on-Time-Complexity-Of-Algorithms-23876128a3ef80438078cfb416685265"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-lg text-blue-900 underline mt-4 bold"
          >
            📘 View Notes On Time Complexity And Asymptotic Notations
          </a>
        </div>

      </div>
      <div>
        <Line data={data} />
      </div>
      
      

      <div className="fixed bottom-6 right-6 text-base font-bold text-white bg-red-700 px-5 py-2 rounded-xl shadow-lg z-50">
        © Akash Kumar Roy
      </div>
    </div>
  );
}
