'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartData {
  time: string
  responseTime: number
  status: number
}

interface StatusChartProps {
  data: ChartData[]
  websiteName: string
}

export default function StatusChart({ data, websiteName }: StatusChartProps) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
        No historical data available yet. Check the website multiple times to see trends.
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '300px', marginTop: '1rem' }}>
      <ResponsiveContainer>
        <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                      <XAxis 
                        dataKey="time" 
                        stroke="var(--text-secondary)"
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        stroke="var(--text-secondary)"
                        label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }}
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--card-bg)', 
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          boxShadow: 'var(--shadow-md)',
                          color: 'var(--text-primary)'
                        }}
                        formatter={(value: number) => [`${value}ms`, 'Response Time']}
                      />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="responseTime" 
            stroke="#667eea" 
            strokeWidth={2}
            dot={{ fill: '#667eea', r: 4 }}
            activeDot={{ r: 6 }}
            name="Response Time"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

