"use client";

import { useEffect, useState } from "react";
// import Modal from "@/components/Tour/Modal";

declare global {
    interface Window {
        embedpano?: any;
        removepano?: any;
    }
}

interface TourViewerProps {
    xmlUrl: string;
    jsUrl: string;
    baseUrl: string;
    webvrUrl: string;
    webvrJsUrl: string;
    onClose: () => void;
}

export default function TourViewer({ xmlUrl, jsUrl, baseUrl, webvrUrl, webvrJsUrl, onClose }: TourViewerProps) {
    const [embedError, setEmbedError] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        let tries = 0;
        function tryEmbed() {
            const el = document.getElementById('pano-viewer');
            if (el) {
                // Load main tour js
                const script1 = document.createElement("script");
                script1.src = jsUrl;
                script1.async = true;
                document.body.appendChild(script1);

                // Load webvr plugin js
                const script2 = document.createElement("script");
                script2.src = webvrJsUrl;
                script2.async = true;
                document.body.appendChild(script2);

                script1.onload = () => {
                    if (window.embedpano) {
                        window.embedpano({
                            swf: null,
                            xml: xmlUrl,
                            target: "pano-viewer",
                            base: baseUrl,
                            html5: "only",
                            id: "krpano-tour"
                        });
                    }
                };
                return () => {
                    script1.remove();
                    script2.remove();
                    if (window.removepano) window.removepano("krpano-tour");
                };
            } else if (tries < 50) {
                tries++;
                timeout = setTimeout(tryEmbed, 100);
            } else {
                setEmbedError(true);
            }
        }
        tryEmbed();
        return () => clearTimeout(timeout);
    }, [xmlUrl, jsUrl, baseUrl, webvrUrl, webvrJsUrl]);

    return (
        // <Modal onClose={onClose}>
        //     <div id="pano-viewer" style={{ width: '80vw', height: '80vh', maxWidth: '100vw', maxHeight: '100vh', overflow: 'hidden', margin: 'auto' }} />
        // </Modal>
        <div id="pano-viewer" style={{ width: '100%', height: '100%' }}>
            {embedError && (
                <div className="text-red-500 text-center mt-4">
                    Lỗi trong quá trình tải lên preview tour. Vui lòng thử lại!
                </div>
            )}
        </div>
    );
} 
