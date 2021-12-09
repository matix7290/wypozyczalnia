<script>
    import ReservationsAdminRows from "../../components/ReservationsAdminRows.svelte";
    import getSession from "../../../scripts/getSession";

    let logged = false;

    let getItems = async () => {
        const URL = "./backend/GetAllArchive.php";

        let res = await fetch(URL);

        res = await res.json();

        for (let i = 0; i < res.length; i++) {
            if (res[i].status_name === "waiting") {
                res[i].status_name = "Anulowano";
            } else if (res[i].status_name === "overdue") {
                res[i].status_name = "Zwrócono po terminie";
            } else {
                res[i].status_name = "Zwrócono";
            }
        }

        return res;
    };

    let init = async () => {
        let res = await getSession(["logged", "user_type_id"]);

        logged = res.logged;

        if (!res.logged || res.user_type_id == 3) {
            window.location.replace("./#/forbbidden");
        }
    };

    document.onload = init();
</script>

<section class="text-gray-600 body-font">
    {#if logged}
        <div class="container px-5 pt-12 pb-24 mx-auto">
            <div class="flex flex-col text-center w-full mb-20">
                <div class="lg:w-2/3 w-full mx-auto overflow-auto">
                    <table
                        class="table-auto w-full text-left whitespace-no-wrap"
                    >
                        <thead>
                            <tr>
                                <th
                                    class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                    >Użytkownik</th
                                >
                                <th
                                    class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                    >Marka samochodu</th
                                >
                                <th
                                    class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                    >Model samochodu</th
                                >
                                <th
                                    class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                    >Data wynajęcia</th
                                >
                                <th
                                    class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                    >Data oddania</th
                                >
                                <th
                                    class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                    >Status</th
                                >
                            </tr>
                        </thead>
                        <tbody>
                            {#await getItems()}
                                loading...
                            {:then response}
                                <ReservationsAdminRows
                                    data={response}
                                    name={"Archiwalne"}
                                />
                            {/await}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    {/if}
</section>
