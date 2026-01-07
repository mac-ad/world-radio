import { useEffect } from "react";

export function useCloudflare() {
    useEffect(() => {
        const token = import.meta.env.VITE_CLOUDFLARE_BEACON;
        if (!token) return;

        const script = document.createElement("script");
        script.src = "https://static.cloudflareinsights.com/beacon.min.js";
        script.defer = true;
        script.setAttribute("data-cf-beacon", JSON.stringify({ token }));
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);
}