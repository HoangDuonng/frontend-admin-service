"use client";

import { useEffect, useState } from "react";
import { getTourDetail } from '@/services/tourService';
import TourViewer from "./TourViewer";
import { Tour } from "@/types/tour";
import { env } from '@/env.mjs';
import Loading from '@/app/loading';

export default function TourDetailClient({
    tourId,
}: {
    tourId: string;
}) {
    const [tour, setTour] = useState<Tour | null>(null);
    // const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        getTourDetail(tourId)
            .then(setTour)
            .catch((e) => setError(e.message));
    }, [tourId]);

    if (error) return <div className="text-red-500 mb-4">{error}</div>;
    if (!tour) return <Loading />;

    const base = `${env.NEXT_PUBLIC_FILE_API_URL}/static_files/${tour.storageSubPath.replace(/\\/g, "/")}`;
    const xmlUrl = `${base}/tour.xml`;
    const jsUrl = `${base}/tour.js`;
    const webvrUrl = `${base}/plugins/webvr.xml`;
    const webvrJsUrl = `${base}/plugins/webvr.js`;

    return (
        <TourViewer xmlUrl={xmlUrl} jsUrl={jsUrl} baseUrl={base} webvrUrl={webvrUrl} webvrJsUrl={webvrJsUrl} onClose={() => { }} />
    );
}
