"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, ArrowRight, Loader2, Scissors } from "lucide-react";
import { signup } from "./actions";
import Link from "next/link";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: "100%",
        padding: "16px",
        background: pending ? "#a07a20" : "#D4AF37",
        color: "#050505",
        fontWeight: "700",
        borderRadius: "16px",
        border: "none",
        cursor: pending ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        fontSize: "13px",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        transition: "all 0.2s",
        boxShadow: "0 8px 32px rgba(212,175,55,0.25)",
      }}
    >
      {pending ? (
        <Loader2 style={{ width: 20, height: 20, animation: "spin 1s linear infinite" }} />
      ) : (
        <>Start Your Boutique <ArrowRight style={{ width: 18, height: 18 }} /></>
      )}
    </button>
  );
}

function SignupContent() {
  const params = useSearchParams();
  const error = params?.get("error");

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
      {/* Emerald glow */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 700,
            background: "radial-gradient(circle, rgba(6,44,34,0.35) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 500,
            height: 500,
            background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)",
            borderRadius: "50%",
            transform: "translate(20%, -20%)",
          }}
        />
      </div>

      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          zIndex: 0,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 440,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 36,
          padding: "52px 44px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.05)",
        }}
      >
        {/* Logo + header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(212,175,55,0.15)",
                border: "1px solid rgba(212,175,55,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Scissors style={{ width: 18, height: 18, color: "#D4AF37" }} />
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>
              KasiBusiness<span style={{ color: "#D4AF37" }}> Style</span>
            </span>
          </div>

          <div
            style={{
              display: "inline-flex",
              padding: "14px",
              background: "rgba(212,175,55,0.1)",
              borderRadius: "50%",
              marginBottom: 20,
            }}
          >
            <Sparkles style={{ width: 30, height: 30, color: "#D4AF37" }} />
          </div>

          <h1
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 8px",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Create Your{" "}
            <span style={{ color: "#D4AF37", fontStyle: "italic" }}>Vault</span>
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Join the Elite Multi-Tenant Network
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 24,
              padding: "14px 18px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 12,
              color: "#ef4444",
              fontSize: 13,
              textAlign: "center",
            }}
          >
            {decodeURIComponent(error)}
          </div>
        )}

        <form action={signup} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.3)",
                fontWeight: 700,
                paddingLeft: 4,
              }}
            >
              Work Email
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                style={{
                  position: "absolute",
                  left: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 16,
                  height: 16,
                  color: "rgba(255,255,255,0.2)",
                }}
              />
              <input
                type="email"
                name="email"
                required
                placeholder="your@brand.com"
                style={{
                  width: "100%",
                  paddingLeft: 50,
                  paddingRight: 20,
                  paddingTop: 16,
                  paddingBottom: 16,
                  background: "#050505",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  color: "#fff",
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.3)",
                fontWeight: 700,
                paddingLeft: 4,
              }}
            >
              Master Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                style={{
                  position: "absolute",
                  left: 20,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 16,
                  height: 16,
                  color: "rgba(255,255,255,0.2)",
                }}
              />
              <input
                type="password"
                name="password"
                required
                minLength={8}
                placeholder="Minimum 8 characters"
                style={{
                  width: "100%",
                  paddingLeft: 50,
                  paddingRight: 20,
                  paddingTop: 16,
                  paddingBottom: 16,
                  background: "#050505",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  color: "#fff",
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.5)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>
          </div>

          <div style={{ paddingTop: 4 }}>
            <SubmitButton />
          </div>
        </form>

        <p
          style={{
            marginTop: 24,
            fontSize: 10,
            color: "rgba(255,255,255,0.2)",
            textAlign: "center",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
          }}
        >
          No credit card required · 14-day free trial
        </p>

        <div style={{ marginTop: 20, textAlign: "center" }}>
          <p
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.2)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
            }}
          >
            Already have a Vault?{" "}
            <Link
              href="/login"
              style={{ color: "#D4AF37", textDecoration: "none", fontWeight: 700 }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "#050505",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader2 style={{ color: "#D4AF37", animation: "spin 1s linear infinite" }} />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
