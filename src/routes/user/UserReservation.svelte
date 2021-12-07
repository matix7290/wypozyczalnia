<script>
    import ReservationsRows from "../../components/ReservationsRows.svelte";

    let user = {
        firstname: "",
        lastname: "",
    };

    let getItems = async () => {
        const URL = "./backend/GetReservations.php";
        let res = await fetch(URL);

        res = await res.json();

        user.firstname = res.user.firstname;
        user.lastname = res.user.lastname;

        for (let i = 0; i < res.waiting.length; i++) {
            res.waiting[i].status_name = "Oczekujące";
        }

        for (let i = 0; i < res.accepted.length; i++) {
            res.accepted[i].status_name = "Zaakceptowane";
        }

        for (let i = 0; i < res.overdue.length; i++) {
            res.overdue[i].status_name = "Po terminie";
        }

        for (let i = 0; i < res.archives.length; i++) {
            if (res.archives[i].status_name === "waiting") {
                res.archives[i].status_name = "Anulowano";
            } else if (res.archives[i].status_name === "overdue") {
                res.archives[i].status_name = "Zwrócono po terminie";
            } else {
                res.archives[i].status_name = "Zwrócono";
            }
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

        console.log(res);
        location.reload();
    };
</script>

<section class="text-gray-600 body-font">
    <div class="container px-5 pt-12 pb-24 mx-auto">
        <div class="flex flex-col text-center w-full mb-20">
            <div class="lg:w-2/3 w-full mx-auto overflow-auto">
                <table class="table-auto w-full text-left whitespace-no-wrap">
                    <thead>
                        <tr>
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
                                colspan="2"
                                class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                            />
                        </tr>
                    </thead>
                    <tbody>
                        {#await getItems()}
                            loading...
                        {:then response}
                            <ReservationsRows
                                data={response.waiting}
                                name={"Oczekujące"}
                                {giveBack}
                                {user}
                            />
                            <ReservationsRows
                                data={response.accepted}
                                name={"Zaakceptowane"}
                                {giveBack}
                                {user}
                            />
                            <ReservationsRows
                                data={response.overdue}
                                name={"Po terminie"}
                                {giveBack}
                                {user}
                            />
                            <ReservationsRows
                                data={response.archives}
                                name={"Archiwalne"}
                                {giveBack}
                                {user}
                            />
                        {/await}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>
