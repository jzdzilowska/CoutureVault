const devEndpoint = "http://localhost:8000/";
const prodEndpoint = "https://ilovebubbles.onrender.com/";

const isProduction = process.env.NODE_ENV === "production";
const isTest = process.env.NODE_ENV === "test";
export const endpoint = isProduction ? prodEndpoint : devEndpoint;
