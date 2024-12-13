import { NextResponse } from "next/server";

const withCORS = async (response: NextResponse) => {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-app-name");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
};
export default withCORS;

