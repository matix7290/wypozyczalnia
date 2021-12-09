<script>
    import getSession from "../../scripts/getSession";

    let logged = true;
    let data = { user_type_id: 3 };
    let text = "Witaj, ";

    async function check() {
        let res = await getSession(["logged"]);
        logged = res.logged;

        if (logged) {
            data = await getSession(["firstname", "lastname", "user_type_id"]);
            text += data.firstname + " " + data.lastname;
        }
    }

    async function logout() {
        logged = false;

        const URL = "./backend/Logout.php";
        let res = await fetch(URL);

        res = await res.json();
        window.location.replace("./#");
    }

    document.onload = check();
</script>

<header class="text-gray-600 body-font h-1/6">
    <div
        class="container mx-auto flex flex-wrap p-5 pb-0 flex-col md:flex-row items-center"
    >
        <nav class="flex lg:w-1/4 flex-wrap items-center text-base md:ml-auto">
            <a class="mr-5 hover:text-gray-900" href="./#/cars">Samochody</a>
            <a class="mr-5 hover:text-gray-900" href="./#/user/reservstions"
                >Twoje rezerwacje</a
            >
            {#if data.user_type_id != 3}
                <a class="hover:text-gray-900" href="./#/admin">Panel admina</a>
            {:else}
                <a class="hover:text-gray-900" href="./#/statute">Regulamin</a>
            {/if}
        </nav>
        <a
            class="flex order-first lg:order-none lg:w-1/2 title-font font-medium items-center text-gray-900 lg:items-center lg:justify-center mb-4 md:mb-0"
            href="./#"
        >
            <img
                src="../public/assets/img/car.svg"
                class=" w-16 h-16 text-white rounded-full"
                alt="Logo"
            />
            <span class="ml-3 text-xl">Wypożyczalnia samochodów</span>
        </a>
        <div class="lg:w-1/4 inline-flex lg:justify-end ml-5 lg:ml-0">
            {#if logged}
                <p
                    class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 rounded text-base mt-4 mr-5 md:mt-0 select-none"
                    bind:innerHTML={text}
                    contenteditable="false"
                />

                <button
                    on:click={() => {
                        logout();
                    }}
                    class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 mr-5 md:mt-0"
                    >Wyloguj
                </button>
            {:else}
                <a href="./#/Login">
                    <button
                        class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 mr-5 md:mt-0"
                        >Logowanie
                    </button>
                </a>

                <a href="./#/Register">
                    <button
                        class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0"
                        >Rejestracja
                    </button>
                </a>
            {/if}
        </div>
    </div>
</header>
