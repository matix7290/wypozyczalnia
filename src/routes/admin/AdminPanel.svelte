<script>
    import getSession from "../../../scripts/getSession";

    let res = { user_type_id: 3, logged: false };
    let symulationStatus = "DISABLED";

    let getSymulationStatus = async () => {
        const URL = "./backend/GetSymulationStatus.php";
        let res = await fetch(URL);
        res = await res.json();

        return res;
    };

    let init = async () => {
        res = await getSession(["logged", "user_type_id"]);

        symulationStatus = await getSymulationStatus();

        if (!res.logged || res.user_type_id == 3) {
            window.location.replace("./#/forbbidden");
        }
    };

    let changeSymulationStatus = async (status, name) => {
        const URL = "./backend/SetSymulationStatus.php";
        let data = new FormData();
        data.append("status", status);
        data.append("name", name);

        let res = await fetch(URL, {
            method: "POST",
            mode: "no-cors",
            body: data,
        });

        res = await res.json();
        location.reload();
    };

    document.onload = init();
</script>

<section class="h-2/3 text-gray-600 body-font">
    <div class="container w-auto h-full pt-12 mx-auto flex flex-col">
        <h1 class="mx-auto text-3xl mb-2 text-gray-900">
            Panel administracyjny
        </h1>
        <a
            style="color: rgba(75, 85, 99, 1)"
            href="./#/admin/reservation/waiting"
            class="leading-relaxed mx-auto mt-4">Oczekujące rezerwacje</a
        >
        <a
            href="./#/admin/reservation/active"
            style="color: rgba(75, 85, 99, 1)"
            class="leading-relaxed mx-auto mt-4">Wypożyczone samochody</a
        >
        <a
            style="color: rgba(75, 85, 99, 1)"
            href="./#/admin/reservation/archive"
            class="leading-relaxed mx-auto mt-4">Archiwum</a
        >
        {#if res.user_type_id != 2}
            <a
                style="color: rgba(75, 85, 99, 1)"
                href="./#/admin/users"
                class="leading-relaxed mx-auto mt-4">Zarządzaj użytkownikami</a
            >

            {#if symulationStatus.foreward == "DISABLED"}
                <a
                    style="color: rgba(75, 85, 99, 1)"
                    href="./#/admin/"
                    on:click={() =>
                        changeSymulationStatus("ENABLE", "foreward")}
                    class="leading-relaxed mx-auto mt-4"
                    >Włącz symulacje do przodu</a
                >
            {:else}
                <a
                    style="color: rgba(75, 85, 99, 1)"
                    href="./#/admin/"
                    on:click={() =>
                        changeSymulationStatus("DISABLE", "foreward")}
                    class="leading-relaxed mx-auto mt-4"
                    >Wyłącz symulacje do przodu</a
                >
            {/if}

            {#if symulationStatus.backward == "DISABLED"}
                <a
                    style="color: rgba(75, 85, 99, 1)"
                    href="./#/admin/"
                    on:click={() =>
                        changeSymulationStatus("ENABLE", "backward")}
                    class="leading-relaxed mx-auto mt-4"
                    >Włącz symulacje do tyłu</a
                >
            {:else}
                <a
                    style="color: rgba(75, 85, 99, 1)"
                    href="./#/admin/"
                    on:click={() =>
                        changeSymulationStatus("DISABLE", "backward")}
                    class="leading-relaxed mx-auto mt-4"
                    >Wyłącz symulacje do tyłu</a
                >
            {/if}
        {/if}
    </div>
</section>
