import { NextResponse } from "next/server";
import { Resend } from "resend";
import twilio from "twilio";

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json();

    if (type === "twilio") {
      const client = twilio(data.twilio_sid, data.twilio_token);
      // Try to fetch account info to verify keys
      await client.api.v2010.accounts(data.twilio_sid).fetch();
      return NextResponse.json({ success: true });
    }

    if (type === "resend") {
      const resend = new Resend(data.resend_api_key);
      // Try to fetch API keys list to verify key
      const { error } = await resend.apiKeys.list();
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Invalid type" });
  } catch (err: any) {
    console.error("Verification error:", err);
    return NextResponse.json({ 
      success: false, 
      message: err.message || "Invalid Credentials" 
    });
  }
}
