<script>
	import Router from "svelte-spa-router";
	import Home from "./routes/Home.svelte";
	import NotFound from "./routes/NotFound.svelte";
	import Header from "./components/Header.svelte";
	import Footer from "./components/Footer.svelte";
	import Tailwindcss from "./Tailwindcss.svelte";
	import Display from "./routes/Display.svelte";
	import AddItem from "./routes/AddItem.svelte";
	import Test from "./routes/test.svelte";
	import Register from "./routes/Register.svelte";
	import Login from "./routes/Login.svelte";
</script>

<Tailwindcss />

<Header />

<Router
	routes={{
		"/": Home,
		"/display": Display,
		"/addData": AddItem,
		"/test": Test,
		"/register": Register,
		"/login": Login,
		"*": NotFound,
	}}
/>

<Footer />
