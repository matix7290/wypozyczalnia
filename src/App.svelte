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
		"*": NotFound,
	}}
/>

<Footer />
