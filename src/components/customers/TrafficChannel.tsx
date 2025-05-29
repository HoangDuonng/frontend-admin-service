'use client';

import React, { useState } from 'react';
import Card from '@/components/card';
import Dropdown from '@/components/dropdown';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { useTheme } from 'next-themes';

const intervals = ['Last 7 days', 'This month', 'All time'];

const legend = [
    {
        title: 'Direct',
        color: '#2A85FF',
    },
    {
        title: 'Search',
        color: '#FFBC99',
    },
    {
        title: 'Market',
        color: '#B1E5FC',
    },
    {
        title: 'Social media',
        color: '#CABDFF',
    },
    {
        title: 'Other',
        color: '#FFD88D',
    },
];

const data = [
    {
        name: '22',
        direct: 22,
        search: 3,
        market: 4,
        'social media': 8,
        other: 5,
    },
    {
        name: '23',
        direct: 12,
        search: 8,
        market: 5,
        'social media': 2,
        other: 10,
    },
    {
        name: '24',
        direct: 18,
        search: 4,
        market: 9,
        'social media': 4,
        other: 7,
    },
    {
        name: '25',
        direct: 10,
        search: 10,
        market: 5,
        'social media': 5,
        other: 2,
    },
    {
        name: '26',
        direct: 21,
        search: 5,
        market: 4,
        'social media': 8,
        other: 5,
    },
    {
        name: '27',
        direct: 17,
        search: 8,
        market: 4,
        'social media': 8,
        other: 12,
    },
    {
        name: '28',
        direct: 12,
        search: 8,
        market: 5,
        'social media': 2,
        other: 10,
    },
];

const TrafficChannel = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [sorting, setSorting] = useState(intervals[0]);

    return (
        <Card
            title="Traffic channel"
            classTitle="title-purple"
            head={
                <Dropdown
                    value={sorting}
                    setValue={setSorting}
                    options={intervals}
                    small
                />
            }
        >
            <div className="w-auto h-[320px] -ml-[35px] -mb-2.5">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={data}
                        margin={{
                            top: 0,
                            right: 0,
                            left: 0,
                            bottom: 0,
                        }}
                        barSize={46}
                        barGap={8}
                    >
                        <CartesianGrid
                            strokeDasharray="none"
                            stroke={isDark ? '#272B30' : '#EFEFEF'}
                            vertical={false}
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fontWeight: '500', fill: '#6F767E' }}
                            padding={{ left: 10 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fontWeight: '500', fill: '#6F767E' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#272B30',
                                borderColor: 'rgba(255, 255, 255, 0.12)',
                                borderRadius: 8,
                                boxShadow:
                                    '0px 4px 8px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.1), inset 0px 0px 1px #000000',
                            }}
                            labelStyle={{ fontSize: 12, fontWeight: '500', color: '#fff' }}
                            itemStyle={{
                                padding: 0,
                                textTransform: 'capitalize',
                                fontSize: 12,
                                fontWeight: '600',
                                color: '#fff',
                            }}
                            cursor={{ fill: '#f3f2f3' }}
                        />
                        <Bar dataKey="direct" stackId="a" fill="#2A85FF" />
                        <Bar dataKey="search" stackId="a" fill="#FFBC99" />
                        <Bar dataKey="market" stackId="a" fill="#B1E5FC" />
                        <Bar dataKey="social media" stackId="a" fill="#CABDFF" />
                        <Bar dataKey="other" stackId="a" fill="#FFD88D" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-8 md:hidden">
                {legend.map((x, index) => (
                    <div key={index} className="flex items-center text-sm font-bold">
                        <div
                            className="w-4 h-4 mr-2 rounded"
                            style={{ backgroundColor: x.color }}
                        />
                        {x.title}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default TrafficChannel; 