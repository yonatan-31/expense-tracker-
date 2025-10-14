import { useRef, useState, useEffect } from "react";
import { useSignUp, useUser, useSession } from "@clerk/clerk-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { UserRoundPen, Download, LoaderCircle } from "lucide-react";
import { useUser as useUserContext } from "@/context/UserContext";

import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

export default function CustomSignupForm() {
  const { setUserData } = useUserContext();
  const { signUp, setActive, isLoaded } = useSignUp();
  const { isSignedIn } = useUser();
  const { session } = useSession(); // 👈 new
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  if (session && isSignedIn && !loading) {
    navigate("/home");
  }
}, [session, isSignedIn, loading, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded || isSignedIn) return;

    try {
      setLoading(true);
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
      setError(null);
    } catch (err: any) {
      console.error("Sign-up error:", err);
      setError(err.errors?.[0]?.message || "Sign-up failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      setLoading(true);
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        // Save user in DB
        const formData = new FormData();
        formData.append("id", result.createdUserId!);
        formData.append("email", signUp.emailAddress!);
        formData.append("name", name);
        if (selectedFile) formData.append("profile", selectedFile);

        const { data } = await axios.post(`${API_BASE}/users`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("✅ User verified, profile saved!");
        setUserData({
          id: result.createdUserId!,
          name,
          email,
          profile_img: data.profileImg,
        });
          navigate("/home");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProfileImg(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex h-screen">
      <div className="h-full w-full flex items-center">
        <div className="p-10 h-[60%] w-full">
          <h1 className="font-bold text-2xl">Create Account</h1>
          <p className="text-gray-600 mb-6">please enter your details to sign up</p>

          {!pendingVerification ? (
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              {/* Avatar upload */}
              <div className="flex justify-center">
                <div className="relative w-24 h-24 rounded-full bg-[#f56565]/20 flex items-center justify-center text-[#f56565]">
                  {profileImg ? (
                    <img
                      className="w-full h-full object-cover rounded-full"
                      src={profileImg}
                      alt=""
                    />
                  ) : (
                    <UserRoundPen size={30} />
                  )}
                  <div
                    onClick={handleClick}
                    className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#f56565]/80 flex items-center justify-center text-white"
                  >
                    <Download size={18} />
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Inputs */}
              <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <LoaderCircle className="animate-spin" /> : "Sign Up"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4 max-w-md">
              <Input placeholder="Verification Code" value={code} onChange={(e) => setCode(e.target.value)} />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <LoaderCircle className="animate-spin" /> : "Verify & Sign In"}
              </Button>
            </form>
          )}

          <p className="text-sm mt-4">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <div className="w-[50%]">
        <img src="/unnamed.png" alt="" />
      </div>
    </div>
  );
}
