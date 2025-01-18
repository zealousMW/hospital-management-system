"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

// Generate realistic hospital data patterns
const generateHospitalData = () => {
  const basePatients = 150 // Base number of patients
  interface SeasonalFactor {
    [key: number]: number;
  }

  const seasonalFactor = (month: number): number => {
    // Winter months (Dec-Feb) have higher numbers
    // Summer months (Jun-Aug) have lower numbers
    const seasonality: SeasonalFactor = {
      0: 1.3,  // Jan
      1: 1.2,  // Feb
      2: 1.1,  // Mar
      3: 1.0,  // Apr
      4: 0.9,  // May
      5: 0.8,  // Jun
      6: 0.7,  // Jul
      7: 0.8,  // Aug
      8: 0.9,  // Sep
      9: 1.0,  // Oct
      10: 1.1, // Nov
      11: 1.4  // Dec
    }
    return seasonality[month];
  }

  return Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2024, i).toLocaleString('default', { month: 'short' })
    const randomVariation = 0.9 + Math.random() * 0.2 // Random variation between 0.9 and 1.1
    const total = Math.floor(basePatients * seasonalFactor(i) * randomVariation)
    
    return {
      name: month,
      inpatients: total,
      outpatients: Math.floor(total * 2.5 * randomVariation),
      emergency: Math.floor(total * 0.4 * randomVariation)
    }
  })
}

const data = generateHospitalData()

export function PatientChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="inpatients"
          fill="#2563eb"
          radius={[4, 4, 0, 0]}
          name="Inpatients"
          stackId="a"
        />
        <Bar
          dataKey="outpatients"
          fill="#7c3aed"
          radius={[4, 4, 0, 0]}
          name="Outpatients"
          stackId="a"
        />
        <Bar
          dataKey="emergency"
          fill="#dc2626"
          radius={[4, 4, 0, 0]}
          name="Emergency"
          stackId="a"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}