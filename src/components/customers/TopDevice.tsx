'use client';

import React from 'react';
import Card from '@/components/card';
import Icon from '@/components/icon';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const legend = [
    {
        title: 'Mobile',
        percent: 20,
        icon: 'mobile',
        fill: '#8E59FF',
    },
    {
        title: 'Tablet',
        percent: 5,
        icon: 'tablet',
        fill: '#83BF6E',
    },
    {
        title: 'Desktop',
        percent: 75,
        icon: 'desktop',
        fill: '#2A85FF',
    },
];

const data = [
    { name: 'Mobile', value: 340 },
    { name: 'Tablet', value: 85 },
    { name: 'Desktop', value: 1275 },
];
const COLORS = ['#8E59FF', '#83BF6E', '#2A85FF'];

const TopDevice = () => {
    return (
        <Card title="Top device" classTitle="title-blue">
            <div className="w-auto h-[230px] xl:-ml-3 lg:max-w-[310px] lg:mx-auto md:pl-2.5">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={400} height={400}>
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
                        />
                        <Pie
                            data={data}
                            cx={140}
                            cy={110}
                            innerRadius={88}
                            outerRadius={110}
                            fill="#8884d8"
                            paddingAngle={1}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-8">
                {legend.map((x, index) => (
                    <div key={index} className="text-center">
                        <Icon category="interface" name={x.icon} size="24" fill={x.fill} />
                        <div className="text-sm font-medium text-gray-500 mt-3">{x.title}</div>
                        <div className="text-2xl font-bold">{x.percent}%</div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default TopDevice; 
