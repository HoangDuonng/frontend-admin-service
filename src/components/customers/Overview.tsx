'use client';

import React, { useState } from 'react';
import Card from '@/components/card';
import Dropdown from '@/components/dropdown';
import Users from '@/components/user';
// import Balance from '@/components/Balance';
import Chart from '@/components/customers/Chart';

const intervals = ['Last 28 days', 'Last 14 days', 'Last 7 days'];

const Overview = () => {
    const [sorting, setSorting] = useState(intervals[0]);

    return (
        <Card
            title="Total customers"
            classTitle="title-red"
            head={
                <Dropdown
                    value={sorting}
                    setValue={setSorting}
                    options={intervals}
                    small
                />
            }
        >
            <div className="flex flex-col">
                <div className="mb-8 md:mb-6 text-center">
                    <div className="text-2xl font-bold mb-1">1,509 customers</div>
                    <div className="flex items-center justify-center text-sm font-bold text-gray-500">
                        {/* <Balance value="37.8" background /> */} vs. Sep 8, 2021
                    </div>
                </div>
                <Chart />
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 md:mt-6 md:pt-6">
                    <Users />
                </div>
            </div>
        </Card>
    );
};

export default Overview; 
