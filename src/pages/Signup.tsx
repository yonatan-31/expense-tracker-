import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

export default function CustomSignupForm() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      setError(null);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Sign-up failed");
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        console.log("Signed up and logged in!");
        navigate("/home");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Verification failed");
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left panel */}
      <div className="flex flex-col p-10 h-[60%] justify-between w-[60%]">
        <h1 className="font-semibold text-xl">Expense Tracker</h1>
        <div>
          <h1 className="font-bold text-2xl">Create Account</h1>
          <p className="text-gray-600 mb-6">
            please enter your details to sign up
          </p>

          {!pendingVerification ? (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4 max-w-md">
              <Input
                placeholder="Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full">
                Verify & Sign In
              </Button>
            </form>
          )}

          <p className=" text-sm mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-[40%]">
        <img src="/unnamed.png" alt="" />
      </div>
    </div>
  );
}
