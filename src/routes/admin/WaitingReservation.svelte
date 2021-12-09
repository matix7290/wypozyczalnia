<script>
    import ReservationsAdminRows from "../../components/ReservationsAdminRows.svelte";
    import getSession from "../../../scripts/getSession";

    let logged = false;

    let getItems = async () => {
        const URL = "./backend/GetAllReservations.php";
        let data = new FormData();
        data.append("statusses", JSON.stringify(["waiting"]));

        let res = await fetch(URL, {
            method: "POST",
            body: data,
            mode: "no-cors",
        });

        res = await res.json();

        for (let i = 0; i < res.waiting.length; i++) {
            res.waiting[i].status_name = "Oczekująca";
        }

        return res;
    };

    let giveBack = async (id) => {
        let data = new FormData();
        data.append("id", id);

        const URL = "./backend/DeleteReservation.php";
        let res = await fetch(URL, {
            method: "POST",
            body: data,
            mode: "no-cors",
        });

        res = await res.json();

        location.reload();
    };

    let accept = async (id) => {
        let data = new FormData();
        data.append("id", id);

        const URL = "./backend/AcceptReservation.php";
        let res = await fetch(URL, {
            method: "POST",
            body: data,
            mode: "no-cors",
        });

        res = await res.json();

        location.reload();
    };

    let edit = async (id) =>
        window.location.replace("./#/admin/reservation/edit/" + id);

    let init = async () => {
        let res = await getSession(["logged"]);

        logged = res.logged;

        if (!logged) {
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
                                <th
                                    colspan="3"
                                    class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                />
                            </tr>
                        </thead>
                        <tbody>
                            {#await getItems()}
                                loading...
                            {:then response}
                                <ReservationsAdminRows
                                    data={response.waiting}
                                    name={"Oczekujące"}
                                    callback={{
                                        giveBack: giveBack,
                                        accept: accept,
                                        edit: edit,
                                    }}
                                />
                            {/await}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    {/if}
</section>
