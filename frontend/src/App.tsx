import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import Layout from "./layouts/Layout";
import ProfileLayout from "./layouts/ProfileLayout";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import { useAppContext } from "./contexts/AppContext";
import Search from "./pages/Search";
import Detail from "./pages/Details";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBooking";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

const App = () => {
	const { isLoggedIn } = useAppContext();
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						<Layout>
							<Home />
						</Layout>
					}
				/>
				<Route
					path="/search"
					element={
						<Layout>
							<Search />
						</Layout>
					}
				/>
				<Route
					path="/detail/:hotelId"
					element={
						<Layout>
							<Detail />
						</Layout>
					}
				/>
				<Route
					path="/register"
					element={
						<Layout>
							<Register />
						</Layout>
					}
				/>
				<Route
					path="/sign-in"
					element={
						<Layout>
							<SignIn />
						</Layout>
					}
				/>

				{isLoggedIn && (
					<>
						<Route
							path="/hotel/:hotelId/booking"
							element={
								<Layout>
									<Booking />
								</Layout>
							}
						/>
						
						<Route
							path="/my-bookings"
							element={
								<Layout>
									<MyBookings />
								</Layout>
							}
						/>
						<Route
							path="/profile"
							element={
								<ProfileLayout>
									<Profile />
								</ProfileLayout>
							}
						/>
					</>
				)}
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</Router>
	);
};

export default App;
