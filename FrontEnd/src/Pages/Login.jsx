
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getData } from '@/context/userContext'
import Google from "../assets/googleLogo.png"

const Login = () => {
    const { setUser } = getData()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(formData);
        
        try {
            setIsLoading(true)
            const res = await axios.post(`http://localhost:8000/user/login`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            
            console.log("Login Response:", res.data) // ✅ Debug log
            
            if (res.data.success) {
                setUser(res.data.data)
                localStorage.setItem("accessToken", res.data.accessToken)
                toast.success(res.data.message)
                navigate('/')
            }
        } catch (error) {
            // ✅ IMPROVED ERROR HANDLING
            console.error("Login Error:", error)
            
            if (error.response) {
                // Backend responded with error
                toast.error(error.response.data.message || "Login failed")
            } else if (error.request) {
                // Request made but no response
                toast.error("Cannot connect to server. Please check if backend is running.")
            } else {
                // Other errors
                toast.error("Something went wrong. Please try again.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='relative w-full h-screen md:h-[760px] bg-green-100 overflow-hidden'>
            <div className='min-h-screen flex flex-col to-muted/20'>
                <div className='flex-1 flex items-center justify-center p-4'>
                    <div className='w-full max-w-md space-y-6 flex flex-col items-center'>
                        <div className='text-center space-y-2'>
                            <h1 className='text-3xl font-bold tracking-tight text-green-600'>Login into your account</h1>
                            <p className='text-gray-600'>Start organizing your thoughts and ideas today</p>
                        </div>
                        <Card className="w-full max-w-sm">
                            <CardHeader className='space-y-1'>
                                <CardTitle className='text-2xl text-center text-green-600'>Login</CardTitle>
                                <CardDescription className='text-center'>
                                    Login into your account to get started with Notes App
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="m@example.com"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className='flex items-center justify-between'>
                                            <Label htmlFor="password">Password</Label>
                                            <Link className='text-sm' to={'/forgot-password'}>Forgot your password?</Link>
                                        </div>
                                        <div className='relative'>
                                            <Input
                                                id="password"
                                                name="password"
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                type={showPassword ? "text" : "password"}
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant='ghost'
                                                size="sm"
                                                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={isLoading}
                                            >
                                                {
                                                    showPassword ? <EyeOff className="w-4 h-4 text-gray-600" /> : <Eye className="w-4 h-4 text-gray-600" />
                                                }
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-500" disabled={isLoading}>
                                        {
                                            isLoading ? (
                                                <>
                                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                    Logging in...
                                                </>
                                            ) : "Login"
                                        }
                                    </Button>
                                </form>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                <Button onClick={() => window.open("http://localhost:8000/auth/google", "_self")} className='w-full' variant='outline'>
                                    <img src={Google} alt="" className='w-5' />
                                    Login with Google
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login