<script>
    import md5 from "../../scripts/md5";
    import checkLog from "../../scripts/checkLog";

    let username, password;

    async function login() {
        if (username && password) {
            password = md5(password);

            let data = new FormData();
            data.append("username", JSON.parse(JSON.stringify(username)));
            data.append("password", JSON.parse(JSON.stringify(password)));
            username = "";
            password = "";

            const URL = "./backend/Login.php";
            let res = await fetch(URL, {
                method: "POST",
                body: data,
                mode: "no-cors",
            });

            res = await res.json();

            if (res.msg === "successfully") {
                window.location.reload();
            } else {
                document.getElementById("message").innerHTML = res.msg;
            }
        } else {
            alert("Nie uzupełniłeś wszystkiego!");
        }
    }
</script>

<section class="text-gray-600 body-font">
    <div
        class="container px-5 py-24 mx-auto flex flex-wrap flex-col items-center"
        on:load={checkLog()}
    >
        <div class="w-1/4 mb-10 pr-0 flex flex-col items-start">
            <h1 class="title-font font-medium text-3xl text-gray-900">
                Zaloguj się...
            </h1>
            <p class="leading-relaxed mt-4">
                ...i odjedź wymażonym samochodem.
            </p>
        </div>
        <div
            class=" bg-gray-100 rounded-lg p-8 flex flex-col w-2/3 mt-10 md:mt-0 self-center"
        >
            <div class="relative mb-4">
                <label for="username" class="leading-7 text-sm text-gray-600"
                    >Nazwa użytkownika</label
                >
                <input
                    type="text"
                    id="username"
                    name="username"
                    bind:value={username}
                    placeholder="jan_kowalski"
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
            </div>
            <div class="relative mb-4">
                <label for="password" class="leading-7 text-sm text-gray-600"
                    >Hasło</label
                >
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="12345678"
                    bind:value={password}
                    class="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
                <p id="message" class="text-xs mt-3 text-red-600" />
            </div>
            <button
                class="text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-600 rounded text-lg"
                on:click={() => {
                    login();
                }}>Zaloguj</button
            >
        </div>
    </div>
</section>
