import Home from "./Home"
import Listings from "./Listings"
import UserProfile from "./UserProfile"
import ListingDetail from "./ListingDetail"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"
import { Routes, Route } from "react-router-dom"

/**
 * TODO:
 */
function RoutesList({ handleLogin, handleRegister, userListings, userBookings }) {

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/users/:userId" element={<UserProfile
                userListings={userListings}
                userBookings={userBookings}
            />} />
            <Route path="/listings/:listingId" element={<ListingDetail />} />
            <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupForm handleRegister={handleRegister} />} />
        </Routes>
    )
}


export default RoutesList