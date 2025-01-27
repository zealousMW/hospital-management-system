"use client";
import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  ArcElement,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

export function NonCommunicableDiseaseChart() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    ArcElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Non-Communicable Disease Visits",
        data: [45, 60, 55, 70, 65, 80, 90, 75, 85, 95, 100, 110], // Example data
        backgroundColor: "#4CAF50",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Non-Communicable Disease Visits",
      },
    },
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Non-Communicable Disease Visits
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
}

export function InpatientChart() {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"], // Time labels
    datasets: [
      {
        label: "Inpatients", // Dataset label
        data: [30, 45, 50, 40, 60, 75, 90], // Number of inpatients
        fill: false, // No fill under the line
        borderColor: "rgba(75, 192, 192, 1)", // Line color
        tension: 0.1, // Line smoothness
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Inpatient Statistics Over Time", // Chart title
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months", // X-axis label
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Inpatients", // Y-axis label
        },
        beginAtZero: true, // Start Y-axis from zero
      },
    },
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">In Patients Visits</h2>
      <Line data={data} options={options} />
    </div>
  );
}

export function InpatientsAndOutpatientsChart() {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"], // Time labels
    datasets: [
      {
        label: "Inpatients",
        data: [30, 45, 50, 40, 60, 75, 90],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
      {
        label: "Outpatients",
        data: [20, 35, 40, 60, 80, 65, 85],
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.1,
      },
    ],
  };

  // Define options with correct types for the tooltip.mode field
  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Inpatient vs Outpatient Statistics Over Time", // Chart title
      },
      tooltip: {
        mode: "index" as const, // Ensure 'index' is treated as a valid literal type
        intersect: false,
      },
    },
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "Months", // X-axis label
        },
      },
      y: {
        type: "linear",
        title: {
          display: true,
          text: "Number of Patients", // Y-axis label
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Tracking Inpatient vs Outpatient Visits
      </h2>
      <Line data={data} options={options} />
    </div>
  );
}

export function RevenueExpensesChart() {
  const data = {
    labels: ["January", "February", "March", "April"], // Months
    datasets: [
      {
        label: "Revenue",
        data: [50000, 60000, 65000, 70000], // Revenue data for each month
        fill: false, // No fill beneath the line
        borderColor: "rgba(75, 192, 192, 1)", // Line color for Revenue
        tension: 0.1, // Controls the curve of the line
      },
      {
        label: "Expenses",
        data: [40000, 45000, 50000, 52000], // Expenses data for each month
        fill: false, // No fill beneath the line
        borderColor: "rgba(255, 99, 132, 1)", // Line color for Expenses
        tension: 0.1, // Controls the curve of the line
      },
    ],
  };

  // Optional: Chart options for customizing appearance
  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      title: {
        display: true, // Display chart title
        text: "Revenue and Expenses Over Time",
      },
      tooltip: {
        mode: "index", // Tooltip mode to show values when hovering over a point
        intersect: false, // Show tooltip even when not exactly on the line
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months", // X-axis title
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount in USD", // Y-axis title
        },
        beginAtZero: true, // Start Y-axis at zero
      },
    },
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Revenue and Expenses Chart</h2>
      <Line data={data} options={options} />
    </div>
  );
}

export function ERVisitsChart() {
  const data = {
    labels: ["Minor", "Moderate", "Severe", "Critical"], // Severity categories
    datasets: [
      {
        label: "ER Visits by Severity",
        data: [100, 80, 60, 120], // Number of visits for each severity level
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)", // Minor severity color
          "rgba(255, 159, 64, 0.5)", // Moderate severity color
          "rgba(153, 102, 255, 0.5)", // Severe severity color
          "rgba(255, 99, 132, 0.5)", // Critical severity color
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Optional: Chart options for customizing appearance
  const options: ChartOptions<"pie"> = {
    responsive: true, // Make the chart responsive to window resizing
    plugins: {
      tooltip: {
        enabled: true, // Enable tooltip for hover interaction
      },
      legend: {
        position: "top", // Position the legend at the top
        labels: {
          boxWidth: 20, // Customize the size of the legend boxes
        },
      },
    },
  };

  return (
    <div style={{ width: "50%", height: "300px", margin: "0 auto" }}>
      <h2 className="text-xl font-bold mb-4">
        Emergency Room Visits by Severity
      </h2>
      <Pie data={data} options={options} />
    </div>
  );
}
