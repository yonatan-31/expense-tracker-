import { useRef, useState } from "react";
import { useSignUp, useUser } from "@clerk/clerk-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { UserRoundPen } from 'lucide-react';
import { Download } from 'lucide-react';


export default function CustomSignupForm() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { isSignedIn } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const [profileImg, setProfileImg] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);


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
        const newUserId = result.createdUserId;
        const email = signUp.emailAddress;

        const formData = new FormData();
        formData.append("id", newUserId!);
        formData.append("email", email!);
        formData.append("name", name);

        if (selectedFile) {
          formData.append("profile", selectedFile); // 👈 must match multer's field name
        }
        await axios.post("http://localhost:4000/users", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // 👈 Axios requires this explicitly
          },
        });

        console.log("Signed up, profile saved, and logged in!");
        navigate("/home");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }
  const handleClick = () => {
    fileInputRef.current?.click(); // programmatically open file explorer
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file); // keep file for upload
      console.log("selectedFile", selectedFile);

      const imageUrl = URL.createObjectURL(file); // temporary preview
      setProfileImg(imageUrl); // update state with new image
    }
  };
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
              <div className="flex justify-center">
                <div className="relative w-24 h-24 rounded-full text-[#f56565] bg-[#f56565]/20 flex items-center justify-center">
                  {profileImg ? <img className="w-full h-full object-cover rounded-full" src={profileImg} alt="" /> : <UserRoundPen size={30} />}
                  <div onClick={handleClick} className="absolute bottom-0 right-0 w-7 h-7 rounded-full text-white bg-[#f56565]/80 flex items-center justify-center">
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
              <Input
                placeholder="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
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
