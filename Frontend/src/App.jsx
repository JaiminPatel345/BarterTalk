import { Routes , Route } from "react-router-dom"
import { Home, Signup, Login } from "./pages"

function App() {
    return (
        <>
            <div className="min-h-screen flex justify-center items-center">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </>
    )
}

export default App
