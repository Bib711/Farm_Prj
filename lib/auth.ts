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
  const user = sampleUsers.find((user) => user.email === email && user.password === password)

  if (user) {
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

