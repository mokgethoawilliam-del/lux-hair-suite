"use client";

import { motion } from "framer-motion";
import { Mail, ArrowLeft, Scissors } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 40 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(212,175,55,0.15)",
              border: "1px solid rgba(212,175,55,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Scissors style={{ width: 16, height: 16, color: "#D4AF37" }} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>
            KasiBusiness<span style={{ color: "#D4AF37" }}> Style</span>
          </span>
        </div>

        {/* Icon */}
        <div
          style={{
            display: "inline-flex",
            padding: "24px",
            background: "rgba(212,175,55,0.1)",
            border: "1px solid rgba(212,175,55,0.15)",
            borderRadius: "50%",
            marginBottom: 32,
          }}
        >
          <Mail
            style={{
              width: 48,
              height: 48,
              color: "#D4AF37",
              animation: "bounce 1.5s infinite",
            }}
          />
        </div>

        <h1
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 16px",
            fontFamily: "'Playfair Display', serif",
            fontStyle: "italic",
          }}
        >
          Verify Your{" "}
          <span style={{ color: "#D4AF37", fontStyle: "normal" }}>Access</span>
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 14,
            lineHeight: 1.7,
            maxWidth: 320,
            margin: "0 auto 40px",
          }}
        >
          We&apos;ve sent a secure confirmation link to your inbox. Please verify your email to begin your boutique&apos;s journey.
        </p>

        <div
          style={{
            padding: "18px 24px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16,
            marginBottom: 36,
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 12,
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Check your spam folder if you don't see it within a minute. The link expires in 24 hours.
          </p>
        </div>

        <Link
          href="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "#D4AF37",
            textDecoration: "none",
          }}
        >
          <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Login
        </Link>

        <p
          style={{
            marginTop: 36,
            fontSize: 9,
            color: "rgba(255,255,255,0.1)",
            textTransform: "uppercase",
            letterSpacing: "0.4em",
            fontWeight: 700,
          }}
        >
          Security Powered by KasiVault
        </p>
      </motion.div>
    </div>
  );
}
