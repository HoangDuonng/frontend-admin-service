"use client";

import React from "react";
import Card from "@/components/card";
import Chart from "@/components/Overview/chart";

interface DashboardChartsClientProps {
    userChartData?: { name: string; value: number }[];
    hotelChartData: { name: string; value: number }[];
    tourChartData: { name: string; value: number }[];
}

const DashboardChartsClient: React.FC<DashboardChartsClientProps> = ({ userChartData, hotelChartData, tourChartData }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userChartData && <Card title="User theo tháng"><Chart data={userChartData} /></Card>}
            <Card title="Khách sạn theo tháng"><Chart data={hotelChartData} /></Card>
            <Card title="Tour theo tháng"><Chart data={tourChartData} /></Card>
        </div>
    );
};

export default DashboardChartsClient; 
