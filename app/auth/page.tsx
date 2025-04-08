"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

export default function Register() {
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [registerRole, setRegisterRole] = useState("user")
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()  // Destructure `toast` from the hook
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!registerEmail || !registerPassword || !confirmPassword) {
      toast({
        title: "All fields are required",
        variant: "destructive",
      })
      return
    }

    if (registerPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const res = await axios.post("http://localhost:3000/api/register", {
        email: registerEmail,
        password: registerPassword,
        role: registerRole,
      })

      toast({
        title: "Registration successful",
        description: "You can now log in.",
      })

      router.push("/") // or to your login tab
    } catch (err: any) {
      toast({
        title: "Registration failed",
        description: err?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          placeholder="m@example.com"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          value={registerPassword}
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <label>Register as</label>
        <div className="flex gap-4">
          <label>
            <input
              type="radio"
              name="role"
              value="user"
              checked={registerRole === "user"}
              onChange={(e) => setRegisterRole(e.target.value)}
            />
            User
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="farmer"
              checked={registerRole === "farmer"}
              onChange={(e) => setRegisterRole(e.target.value)}
            />
            Farmer
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={registerRole === "admin"}
              onChange={(e) => setRegisterRole(e.target.value)}
            />
            Admin
          </label>
        </div>
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Create Account"}
      </button>
    </form>
  )
}
