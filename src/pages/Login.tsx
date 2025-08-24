import { useState, useEffect } from "react"
import { useSignIn } from "@clerk/clerk-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { useSession } from "@clerk/clerk-react";

export default function CustomLoginForm() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate();


    const { session } = useSession();

    useEffect(() => {
        if (session) {
            navigate("/home");
        }
    }, [session, navigate]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!isLoaded) return // wait until Clerk is ready

        try {
            const result = await signIn.create({
                identifier: email,
                password,
            })
            //This sends the credentials to Clerk’s servers for validation.
            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId })
                console.log("Signed in successfully!")
                // OPTIONAL: redirect after login
                navigate("/home");
            } else {
                console.log(result)
            }
        } catch (err: any) {
            setError(err.errors?.[0]?.message || "Sign-in failed")
        }
    }

    return (
        <div className="flex h-screen ">
            <div className="flex flex-col p-10 h-[60%] justify-between w-[60%]">
                <h1 className="font-semibold text-xl">Expense Tracker</h1>
                <div className="">
                    <h1 className="font-bold text-2xl">Welcome Back</h1>
                    <p className="text-gray-600 mb-6 ">please enter your details to log in</p>
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
                            Sign In
                        </Button>
                    </form>
                    <p className=" text-sm mt-4">
                        Don’t have an account?{" "}
                        <Link to="/signup" className="text-blue-600 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
            <div className="w-[40%]">
                <img src="/unnamed.png" alt="" />
            </div>
        </div>
    )
}



