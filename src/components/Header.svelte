<script>
    import getData from "../../scripts/getData";

    let logged = false;
    let text = "Witaj, ";

    async function check() {
        logged = await getData("logged");

        if (logged) {
            let firstname = await getData("firstname");
            let lastname = await getData("lastname");
            text += firstname + " " + lastname;
        }
    }

    async function logout() {
        logged = false;

        let data = new FormData();
        data.append("name", "logged");
        data.append("value", false);

        let URL = "./backend/SetSession.php";
        let res = await fetch(URL, {
            method: "POST",
            body: data,
            mode: "no-cors",
        });

        res = await res.json();
    }
</script>

<header class="text-gray-600 body-font" on:load={check()}>
    <div
        class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center"
    >
        <nav class="flex lg:w-2/5 flex-wrap items-center text-base md:ml-auto">
            <a class="mr-5 hover:text-gray-900" href="./#/cars">Samochody</a>
            <a class="mr-5 hover:text-gray-900" href="./#">Second Link</a>
            <a class="mr-5 hover:text-gray-900" href="./#">Third Link</a>
            <a class="hover:text-gray-900" href="./#">Fourth Link</a>
        </nav>
        <a
            class="flex order-first lg:order-none lg:w-1/5 title-font font-medium items-center text-gray-900 lg:items-center lg:justify-center mb-4 md:mb-0"
            href="./#"
        >
            <span class="ml-3 text-xl">Wypożyczalnia samochodów</span>
        </a>
        <div class="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0">
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
