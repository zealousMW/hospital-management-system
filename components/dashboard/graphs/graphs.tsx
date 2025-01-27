"use client";
import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

export function NonCommunicableDiseaseChart() {
  const data = [
    { name: "January", visits: 45 },
    { name: "February", visits: 60 },
    { name: "March", visits: 55 },
    { name: "April", visits: 70 },
    { name: "May", visits: 65 },
    { name: "June", visits: 80 },
    { name: "July", visits: 90 },
    { name: "August", visits: 75 },
    { name: "September", visits: 85 },
    { name: "October", visits: 95 },
    { name: "November", visits: 100 },
    { name: "December", visits: 110 },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Non-Communicable Disease Visits</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="visits" fill="#4CAF50" name="Non-Communicable Disease Visits" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function InpatientChart() {
  const data = [
    { name: "January", inpatients: 30 },
    { name: "February", inpatients: 45 },
    { name: "March", inpatients: 50 },
    { name: "April", inpatients: 40 },
    { name: "May", inpatients: 60 },
    { name: "June", inpatients: 75 },
    { name: "July", inpatients: 90 },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">In Patients Visits</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" label={{ value: "Months", position: "bottom" }} />
          <YAxis label={{ value: "Number of Inpatients", angle: -90, position: "left" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="inpatients" stroke="rgb(75, 192, 192)" name="Inpatients" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function InpatientsAndOutpatientsChart() {
  const data = [
    { name: "January", inpatients: 30, outpatients: 20 },
    { name: "February", inpatients: 45, outpatients: 35 },
    { name: "March", inpatients: 50, outpatients: 40 },
    { name: "April", inpatients: 40, outpatients: 60 },
    { name: "May", inpatients: 60, outpatients: 80 },
    { name: "June", inpatients: 75, outpatients: 65 },
    { name: "July", inpatients: 90, outpatients: 85 },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tracking Inpatient vs Outpatient Visits</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="inpatients" stroke="rgb(75, 192, 192)" name="Inpatients" />
          <Line type="monotone" dataKey="outpatients" stroke="rgb(255, 99, 132)" name="Outpatients" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueExpensesChart() {
  const data = [
    { name: "January", revenue: 50000, expenses: 40000 },
    { name: "February", revenue: 60000, expenses: 45000 },
    { name: "March", revenue: 65000, expenses: 50000 },
    { name: "April", revenue: 70000, expenses: 52000 },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Revenue and Expenses Chart</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="rgb(75, 192, 192)" name="Revenue" />
          <Line type="monotone" dataKey="expenses" stroke="rgb(255, 99, 132)" name="Expenses" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ERVisitsChart() {
  const data = [
    { name: "Minor", value: 100 },
    { name: "Moderate", value: 80 },
    { name: "Severe", value: 60 },
    { name: "Critical", value: 120 },
  ];

  const COLORS = [
    "rgb(75, 192, 192)",
    "rgb(255, 159, 64)",
    "rgb(153, 102, 255)",
    "rgb(255, 99, 132)",
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Emergency Room Visits by Severity</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
