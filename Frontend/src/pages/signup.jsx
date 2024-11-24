import { Link, useNavigate } from "react-router-dom"
import GenderCheckbox from "../components/generateCheckbox"
import { useContext, useEffect, useState  } from "react"
import { HashLoader } from "react-spinners"
import FlashMessageContext from "../context/flashMessageContext"
import AuthContext from "../context/authContext"


const SignUp = () => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        confirmPassword: "",
    })
    const [gender, setGender] = useState("")
    const [submitLoader, setSubmitLoader] = useState(false)

    const { showSuccessMessage, showErrorMessage } =
        useContext(FlashMessageContext)
    const { user, setLogInUser } = useContext(AuthContext)
	const navigate = useNavigate()


	useEffect(() => {
        if (user) {
            showSuccessMessage("You are already logged in ")
            navigate("/")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, navigate])


    const handelChange = (e) => {
        setFormData((pvs) => ({ ...pvs, [e.target.name]: e.target.value }))
    }

    const handelSubmit = async (e) => {
        e.preventDefault()
        setSubmitLoader(true)

        try {
            if (
                !formData.name ||
                !formData.username ||
                !formData.password ||
                !formData.confirmPassword
            ) {
                throw {
                    message: "Fill all given fields",
                }
            }
            if (gender === "") {
                throw {
                    message: "Select Gender",
                }
            }

            if (formData.password !== formData.confirmPassword) {
                throw {
                    message: "Passwords do not match",
                }
            }
            const user = {
                name: formData.name,
                username: formData.username,
                password: formData.password,
                gender: gender,
            }
			

            const response = await fetch(
                // eslint-disable-next-line no-undef
                `${process.env.VITE_API_BASE_URL}/api/signup`,
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
                showSuccessMessage(`Welcome ${formData.name} !`)
				setLogInUser(data)
            }else{
				console.log(data);
				throw {
					message:data.message
				}
			}
        } catch (error) {
            showErrorMessage(error.message || "Unknown error")
			console.log(error);
			
        }
        setSubmitLoader(false)
    }

    return (
        <div className="flex flex-col items-center justify-center w-[70%] mx-auto">
            <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
                <h1 className="text-3xl font-semibold text-center text-white">
                    Sign Up to
                    <span className="text-blue-500"> Barter Talk</span>
                </h1>

                <form onSubmit={handelSubmit}>
                    <div>
                        <label className="label p-2">
                            <span className="text-base label-text text-white">
                                Full Name
                            </span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            name="name"
                            placeholder="John Doe"
                            className="w-full input input-bordered  h-10 focus:border-[#FF5317]"
                            onChange={handelChange}
                        />
                    </div>

                    <div>
                        <label className="label p-2 ">
                            <span className="text-base label-text text-white">
                                Username
                            </span>
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            name="username"
                            placeholder="johndoe"
                            className="w-full input input-bordered h-10 focus:border-[#FF5317]"
                            onChange={handelChange}
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
                            value={formData.password}
                            name="password"
                            placeholder="Enter Password"
                            className="w-full input input-bordered h-10 focus:border-[#FF5317]"
                            onChange={handelChange}
                        />
                    </div>

                    <div>
                        <label className="label text-white">
                            <span className="text-base label-text text-white">
                                Confirm Password
                            </span>
                        </label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className="w-full input input-bordered h-10 focus:border-[#FF5317]"
                            onChange={handelChange}
                        />
                    </div>

                    <GenderCheckbox gender={gender} setGender={setGender} />

                    <Link
                        className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
                        to="/login"
                    >
                        Already have an account?
                    </Link>

                    <div>
                        <button className="btn btn-block btn-sm mt-2  border border-[#FF5317] text-[#FF5317]  hover:bg-[#694d42]">
                            {submitLoader ? (
                                <HashLoader size={25} color="#ffffff" />
                            ) : (
                                "Signup"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default SignUp
