"use client";

import Card from "@/components/card";
import React from "react";

interface OverviewCardsClientProps {
    userCount?: number;
    hotelCount: number;
    tourCount: number;
    bannerCount: number;
    roleCount: number;
    permissionCount: number;
}

const OverviewCardsClient: React.FC<OverviewCardsClientProps> = ({ userCount, hotelCount, tourCount, bannerCount, roleCount, permissionCount }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {userCount !== undefined && <Card title="Tổng user" className="text-center">{userCount}</Card>}
            <Card title="Tổng khách sạn" className="text-center">{hotelCount}</Card>
            <Card title="Tổng tour" className="text-center">{tourCount}</Card>
            <Card title="Tổng banner" className="text-center">{bannerCount}</Card>
            <Card title="Tổng role" className="text-center">{roleCount}</Card>
            <Card title="Tổng permission" className="text-center">{permissionCount}</Card>
        </div>
    );
};

export default OverviewCardsClient; 
