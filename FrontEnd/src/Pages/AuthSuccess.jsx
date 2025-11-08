import { getData } from '@/context/userContext'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthSuccess = () => {
    const { setUser } = getData()
    const navigate = useNavigate()
    useEffect(() => {

        const handleAuth = async () => {
            const params = new URLSearchParams(window.location.search)
            console.log(params);
            const accessToken = params.get("token")
            console.log("Token", accessToken);

            if (accessToken) {
                localStorage.setItem("accessToken", accessToken)
                try {
                    const res = await axios.get("http://localhost:8000/auth/me", {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    })
                    if (res.data.success) {
                        setUser(res.data.user)  //save user in context api store
                        navigate("/")
                    }
                } catch (error) {
                    console.error("Error fetching user:", error)
                }
            }
        }
        handleAuth()
    }, [navigate])
    return (
        <h2>
            Logging in...
        </h2>
    )
}

export default AuthSuccess