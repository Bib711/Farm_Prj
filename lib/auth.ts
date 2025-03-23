// lib/auth.ts
// This is a mock authentication service for demonstration purposes
// In a real application, you would use a proper authentication system

// Sample user credentials
export const sampleUsers = [
  {
    id: "user-1",
    email: "farmer@example.com",
    password: "Farm2023!",
    name: "John Farmer",
    role: "farmer",
  },
  {
    id: "user-2",
    email: "customer@example.com",
    password: "Shop2023!",
    name: "Sarah Customer",
    role: "user",
  },
  {
    id: "user-3",
    email: "admin@example.com",
    password: "Admin2023!",
    name: "Admin User",
    role: "admin",
  },
]

// Mock authentication function
export const authenticate = (email: string, password: string) => {
  console.log("Authenticating:", email, password) // For debugging
  
  const user = sampleUsers.find(
    (user) => user.email === email && user.password === password
  )
  
  if (user) {
    // Store user in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }))
    }
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    }
  }
  
  return {
    success: false,
    error: "Invalid email or password",
  }
}

// Get current user from localStorage
export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const userJson = localStorage.getItem('currentUser')
    if (userJson) {
      return JSON.parse(userJson)
    }
  }
  return null
}

// Logout function
export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser')
  }
}