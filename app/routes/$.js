import { json } from "@remix-run/node";
import fetch from "node-fetch";

export async function loader({ request, params }) {
  const path = params["*"];
  const targetUrl = `https://cdn.jsdelivr.net/gh/geeklinux-io/${path}`;
  
  try {
    const startTime = Date.now();
    const response = await fetch(targetUrl);
    if (!response.ok) {
      return json({ error: "File not found" }, { status: 404 });
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const upstreamTime = Date.now() - startTime;
    return new Response(arrayBuffer, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
        "x-envoy-upstream-service-time": upstreamTime.toString(),
        "x-envoy-upstream-healthchecked-cluster": "hkg",
        "x-envoy-expected-rq-timeout-ms": "5000"
      },
    });
  } catch (error) {
    return json({ error: "Proxy error" }, { status: 500 });
  }
}
