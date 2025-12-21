import React, { memo } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const DepthChart = memo(function DepthChart({ orderBook }) {
    if (!orderBook || !orderBook.asks || !orderBook.bids) return null

    // Prepare data for chart
    // We need to combine bids (reversed) and asks
    // Bids: price descending, we need ascending for x-axis?
    // Actually depth chart usually has price on X.
    // Bids on left (green), Asks on right (red).

    const bidData = [...orderBook.bids].reverse().map(b => ({
        price: parseFloat(b.price),
        bidVolume: parseFloat(b.total), // Cumulative total
        askVolume: 0,
    }))

    const askData = orderBook.asks.map(a => ({
        price: parseFloat(a.price),
        bidVolume: 0,
        askVolume: parseFloat(a.total), // Cumulative
    }))

    const data = [...bidData, ...askData]

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'rgba(4, 8, 16, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '8px 12px',
                    borderRadius: 8,
                    fontSize: 12
                }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Price: {label}</div>
                    {payload.map((entry, index) => (
                        entry.value > 0 && (
                            <div key={index} style={{ color: entry.stroke }}>
                                {entry.dataKey === 'bidVolume' ? 'Buy Vol' : 'Sell Vol'}: {entry.value.toFixed(4)}
                            </div>
                        )
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <div style={{ width: '100%', height: '100%', minHeight: 200 }}>
            <ResponsiveContainer>
                <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="bidGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00ff88" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="askGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff4466" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ff4466" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="price"
                        type="number"
                        domain={['auto', 'auto']}
                        tick={{ fontSize: 10, fill: '#666' }}
                        tickFormatter={(val) => val.toFixed(2)}
                        minTickGap={30}
                    />
                    <YAxis
                        orientation="right"
                        tick={{ fontSize: 10, fill: '#666' }}
                        width={40}
                        tickFormatter={(val) => val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val.toFixed(1)}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                    <Area
                        type="step"
                        dataKey="bidVolume"
                        stroke="#00ff88"
                        fill="url(#bidGradient)"
                        strokeWidth={2}
                        isAnimationActive={false}
                    />
                    <Area
                        type="step"
                        dataKey="askVolume"
                        stroke="#ff4466"
                        fill="url(#askGradient)"
                        strokeWidth={2}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
})

export default DepthChart
