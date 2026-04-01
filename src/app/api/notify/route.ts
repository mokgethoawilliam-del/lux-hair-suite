import { NextResponse } from "next/server";
import { Resend } from "resend";
import twilio from "twilio";
import { supabase } from "@/lib/supabase"; // Use server-side admin client if possible, but we'll use the browser client for now if it works

export async function POST(req: Request) {
  try {
    const { bookingId, type = "booking" } = await req.json();

    // 1. Fetch Booking Details
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select(`
        *,
        products (name, price)
      `)
      .eq("id", bookingId)
      .single();

    if (bookingError || !booking) throw new Error("Booking not found");

    // 2. Fetch Comms Keys
    const { data: settings, error: settingsError } = await supabase
      .from("app_settings")
      .select("*")
      .eq("site_id", booking.site_id);

    if (settingsError) throw settingsError;

    const keys = settings.reduce((acc: any, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    const { twilio_sid, twilio_token, twilio_from, resend_api_key, store_name = "Kagiso Hair Suite" } = keys;

    const results = { sms: false, email: false };

    // 3. Send SMS (Twilio)
    if (twilio_sid && twilio_token && twilio_from && booking.customer_phone) {
      try {
        const client = twilio(twilio_sid, twilio_token);
        await client.messages.create({
          body: `Hi ${booking.customer_name}, your booking for ${booking.products?.name} at ${store_name} is confirmed for ${new Date(booking.slot_start).toLocaleString()}. See you then!`,
          from: twilio_from,
          to: booking.customer_phone.startsWith("+") ? booking.customer_phone : `+${booking.customer_phone}`
        });
        results.sms = true;
      } catch (err) {
        console.error("SMS Error:", err);
      }
    }

    // 4. Send Email (Resend)
    if (resend_api_key && booking.customer_email) {
      try {
        const resend = new Resend(resend_api_key);
        await resend.emails.send({
          from: `${store_name} <onboarding@resend.dev>`, // Resend requires domain verification for custom identities
          to: booking.customer_email,
          subject: `Booking Confirmed: ${booking.products?.name}`,
          html: `
            <div style="font-family: sans-serif; color: #333;">
              <h1 style="color: #6366f1;">Booking Confirmed</h1>
              <p>Hi <strong>${booking.customer_name}</strong>,</p>
              <p>Your appointment for <strong>${booking.products?.name}</strong> has been successfully scheduled.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p><strong>Date & Time:</strong> ${new Date(booking.slot_start).toLocaleString()}</p>
              <p><strong>Location:</strong> ${store_name}</p>
              <br />
              <p>Thank you for choosing us!</p>
            </div>
          `
        });
        results.email = true;
      } catch (err) {
        console.error("Email Error:", err);
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    console.error("Notify error:", err);
    return NextResponse.json({ success: false, message: err.message });
  }
}
