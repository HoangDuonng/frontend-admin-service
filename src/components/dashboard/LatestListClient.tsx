"use client";

import React from "react";
import Card from "@/components/card";

interface LatestListClientProps {
    latestUsers?: any[];
    latestHotels: any[];
    latestTours: any[];
}

const itemClass =
    "px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors cursor-pointer text-base text-gray-700 dark:text-gray-200";

const LatestListClient: React.FC<LatestListClientProps> = ({ latestUsers, latestHotels, latestTours }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {latestUsers && (
                <Card title="User mới nhất">
                    <ul className="space-y-1">
                        {latestUsers.map(u => (
                            <li key={u._id || u.id} className={itemClass}>
                                {u.name || u.username || u.email}
                            </li>
                        ))}
                    </ul>
                </Card>
            )}
            <Card title="Khách sạn mới nhất">
                <ul className="space-y-1">
                    {latestHotels.map(h => (
                        <li key={h._id || h.document_id} className={itemClass}>
                            {h.displayName}
                        </li>
                    ))}
                </ul>
            </Card>
            <Card title="Tour mới nhất">
                <ul className="space-y-1">
                    {latestTours.map(t => (
                        <li key={t._id || t.tourId} className={itemClass}>
                            {t.title}
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export default LatestListClient; 
