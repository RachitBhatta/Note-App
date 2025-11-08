import { BookA, BookOpen, LogOut, User } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { getData } from '@/context/userContext'
import axios from 'axios'
import { toast } from 'sonner'

const Navbar = () => {
    const { user, setUser } = getData()
    const accessToken = localStorage.getItem("accessToken")

    const logoutHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8000/user/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (res.data.success) {
                setUser(null)
                toast.success(res.data.message)
                localStorage.clear()
            }
        } catch (error) {
            console.log(error);
            toast.error("Logout failed")
        }
    }

    return (
        <nav className='p-4 border-b border-gray-200 bg-white shadow-sm'>
            <div className='max-w-7xl mx-auto flex justify-between items-center'>
                {/* Logo Section */}
                <Link to='/' className='flex gap-2 items-center hover:opacity-80 transition-opacity'>
                    <BookOpen className='h-6 w-6 text-green-800' />
                    <h1 className='font-bold text-xl'>
                        <span className='text-green-600'>Notes</span>App
                    </h1>
                </Link>

                {/* Navigation Links & Auth Buttons */}
                <div className='flex gap-7 items-center'>
                    <ul className='hidden md:flex gap-7 items-center text-base font-medium'>
                        <li className='cursor-pointer hover:text-green-600 transition-colors'>
                            Features
                        </li>
                        <li className='cursor-pointer hover:text-green-600 transition-colors'>
                            Pricing
                        </li>
                        <li className='cursor-pointer hover:text-green-600 transition-colors'>
                            About
                        </li>
                    </ul>

                    {/* Conditional Rendering: User Logged In vs Not Logged In */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className='focus:outline-none'>
                                    <Avatar className='cursor-pointer hover:ring-2 hover:ring-green-600 transition-all'>
                                        <AvatarImage src={user?.avatar} alt={user?.username} />
                                        <AvatarFallback className='bg-green-600 text-white font-semibold'>
                                            {user?.username?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className='w-56'>
                                <DropdownMenuLabel>
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>{user?.username}</span>
                                        <span className='text-xs text-gray-500'>{user?.email}</span>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className='cursor-pointer'>
                                    <User className='mr-2 h-4 w-4' />
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className='cursor-pointer'>
                                    <BookA className='mr-2 h-4 w-4' />
                                    My Notes
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    onClick={logoutHandler} 
                                    className='text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50'
                                >
                                    <LogOut className='mr-2 h-4 w-4' />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className='flex gap-3 items-center'>
                            <Link to={'/login'}>
                                <button className='px-4 py-2 text-green-600 font-semibold hover:text-green-700 hover:bg-green-50 rounded-md transition-all'>
                                    Sign In
                                </button>
                            </Link>
                            <Link to={'/signup'}>
                                <button className='px-5 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 shadow-sm hover:shadow-md transition-all'>
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar