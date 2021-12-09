<script>
	import Router from "svelte-spa-router";
	import Home from "./routes/Home.svelte";
	import NotFound from "./routes/NotFound.svelte";
	import Header from "./components/Header.svelte";
	import Footer from "./components/Footer.svelte";
	import Tailwindcss from "./Tailwindcss.svelte";
	import AllCars from "./routes/AllCars.svelte";
	import AddItem from "./routes/AddItem.svelte";
	import Test from "./routes/test.svelte";
	import Register from "./routes/Register.svelte";
	import Login from "./routes/Login.svelte";
	import BigCar from "./routes/BigCar.svelte";
	import UserReservation from "./routes/user/UserReservation.svelte";
	import ForbbiddenAccess from "./routes/ForbbiddenAccess.svelte";
	import AdminPanel from "./routes/admin/AdminPanel.svelte";
	import ActiveReservation from "./routes/admin/ActiveReservation.svelte";
	import ArchiveReservation from "./routes/admin/ArchiveReservation.svelte";
	import WaitingReservation from "./routes/admin/WaitingReservation.svelte";
	import UserManager from "./routes/admin/UserManager.svelte";
	import EditReservation from "./routes/admin/EditReservation.svelte";
	import Statute from "./routes/Statute.svelte";
</script>

<Tailwindcss />

<Header />

<Router
	routes={{
		"/": Home,
		"/cars": AllCars,
		"/addData": AddItem,
		"/test": Test,
		"/register": Register,
		"/login": Login,
		"/car/:id": BigCar,
		"/user/reservstions": UserReservation,
		"/forbbidden": ForbbiddenAccess,
		"/admin": AdminPanel,
		"/admin/reservation/active": ActiveReservation,
		"/admin/reservation/archive": ArchiveReservation,
		"/admin/reservation/waiting": WaitingReservation,
		"/admin/reservation/edit/:id": EditReservation,
		"/admin/users": UserManager,
		"/statute": Statute,
		"*": NotFound,
	}}
/>

<Footer />
