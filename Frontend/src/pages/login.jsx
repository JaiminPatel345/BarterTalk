import { Link, useNavigate } from "react-router-dom"
import { useContext, useState, useEffect } from "react"
import { HashLoader } from "react-spinners"
import FlashMessageContext from "../context/flashMessageContext"
import AuthContext from "../context/authContext"

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })
    const [submitLoader, setSubmitLoader] = useState(false)

    const { showSuccessMessage, showErrorMessage } =
        useContext(FlashMessageContext)
    const {user , setLogInUser} = useContext(AuthContext)

    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            showSuccessMessage("You are already logged in ")
            navigate("/")
        }
    }, [user, navigate])

    const handelChange = (e) => {
        setFormData((pvs) => ({ ...pvs, [e.target.name]: e.target.value }))
    }

    const handelSubmit = async (e) => {
        e.preventDefault()
        setSubmitLoader(true)

        try {
            if (
                !formData.username ||
                !formData.password 
            ) {
                throw {
                    message: "Fill all given fields",
                }
            }

            
            const user = {
                username: formData.username,
                password: formData.password,
            }

            const response = await fetch(
                // eslint-disable-next-line no-undef
                `${process.env.VITE_API_BASE_URL}/api/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(user),
                    credentials: "include",
                }
            )
            const data = await response.json()
            if (response.ok) {
                showSuccessMessage(`Welcome ${formData.username} !`)
                setLogInUser(data.user)
                
            } else {
                throw {
                    message: data.message,
                }
            }
        } catch (error) {
            showErrorMessage(error.message || "Unknown error")
            console.log(error)
        }
        setSubmitLoader(false)
    }

    return (
        <div className="flex flex-col items-center justify-center mx-auto w-[75%]">
            <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 ">
                <h1 className="text-3xl font-semibold text-center text-white md:flex md:gap-3 md:justify-center" >
                    Login to
                    <p className="text-blue-500"> Barter Talk</p>
                </h1>

                <form onSubmit={handelSubmit}>
                    <div>
                        <label className="label p-2">
                            <span className="text-base label-text text-white">
                                Username
                            </span>
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handelChange}
                            placeholder="Enter username"
                            className="w-full input input-bordered h-10 focus:border-[#FF5317]"
                        />
                    </div>

                    <div>
                        <label className="label">
                            <span className="text-base label-text text-white">
                                Password
                            </span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handelChange}
                            placeholder="Enter Password"
                            className="w-full input input-bordered h-10 focus:border-[#FF5317]"
                            autoComplete="on"
                        />
                    </div>
                    <Link
                        to="/signup"
                        className="text-sm  hover:underline hover:text-blue-600 mt-2 inline-block "
                    >
                        {"Don't"} have an account?
                    </Link>

                    <div>
                        <button className="btn btn-block btn-sm mt-2 border border-[#FF5317] text-[#FF5317]  hover:bg-[#694d42]">
                            {submitLoader ? (
                                <HashLoader size={25} color="#ffffff" />
                            ) : (
                                "Login"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default Login
