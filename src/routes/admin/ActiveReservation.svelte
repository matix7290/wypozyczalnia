<script>
    import ReservationsAdminRows from "../../components/ReservationsAdminRows.svelte";
    import FilterElement from "../../components/FilterElement.svelte";
    import getSession from "../../../scripts/getSession";

    let logged = false;
    let phrase = "";
    let marks = [];
    let models = [];
    let statusses = [];
    let users = [];

    async function getItems() {
        const URL = "./backend/GetAllReservations.php";
        let data = new FormData();
        data.append("statusses", JSON.stringify(["accepted", "overdue"]));

        let res = await fetch(URL, {
            method: "POST",
            body: data,
            mode: "no-cors",
        });

        res = await res.json();

        for (let i = 0; i < res.accepted.length; i++) {
            res.accepted[i].status_name = "Zaakceptowane";
        }

        for (let i = 0; i < res.overdue.length; i++) {
            res.overdue[i].status_name = "Po terminie";
        }

        return res;
    }

    let items = getItems();

    $: filtered = items.then((r) => {
        r.overdue = r.overdue.filter((item) => {
            if (!marks.includes(item.mark)) {
                marks.push(item.mark);
            }

            if (!models.includes(item.model)) {
                models.push(item.model);
            }

            if (!statusses.includes(item.status_name)) {
                statusses.push(item.status_name);
            }

            if (!users.includes(item.username)) {
                users.push(item.username);
            }

            return [
                item.mark,
                item.model,
                item.status_name,
                item.username,
            ].some((element) =>
                element
                    .toString()
                    .toLowerCase()
                    .includes(phrase.toString().toLowerCase())
            );
        });

        r.accepted = r.accepted.filter((item) => {
            if (!marks.includes(item.mark)) {
                marks.push(item.mark);
            }

            if (!models.includes(item.model)) {
                models.push(item.model);
            }

            if (!statusses.includes(item.status_name)) {
                statusses.push(item.status_name);
            }

            if (!users.includes(item.username)) {
                users.push(item.username);
            }

            return [
                item.mark,
                item.model,
                item.status_name,
                item.username,
            ].some((element) =>
                element
                    .toString()
                    .toLowerCase()
                    .includes(phrase.toString().toLowerCase())
            );
        });

        return r;
    });

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

    let edit = (id) =>
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
                <div class="lg:w-full w-full mx-auto overflow-auto">
                    {#await filtered}
                        loading...
                    {:then response}
                        <table
                            class="table-auto w-full text-left whitespace-no-wrap"
                        >
                            <tbody>
                                <tr>
                                    <td class="px-4 py-3 w-1/4">
                                        <FilterElement
                                            name="Użytkownik"
                                            bind:value={phrase}
                                            data={users}
                                        />
                                    </td>

                                    <td class="px-4 py-3 w-1/4">
                                        <FilterElement
                                            name="Marka"
                                            bind:value={phrase}
                                            data={marks}
                                        />
                                    </td>
                                    <td class="px-4 py-3 w-1/4">
                                        <FilterElement
                                            name="Model"
                                            bind:value={phrase}
                                            data={models}
                                        />
                                    </td>

                                    <td class="px-4 py-3 w-1/4">
                                        <FilterElement
                                            name="Status"
                                            bind:value={phrase}
                                            data={statusses}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

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
                                        colspan="2"
                                        class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                    />
                                </tr>
                            </thead>
                            <tbody>
                                <ReservationsAdminRows
                                    data={response.accepted}
                                    name={"Zaakceptowane"}
                                    callback={{
                                        giveBack: giveBack,
                                        edit: edit,
                                    }}
                                />

                                <ReservationsAdminRows
                                    data={response.overdue}
                                    name={"Po terminie"}
                                    callback={{
                                        giveBack: giveBack,
                                        edit: edit,
                                    }}
                                />
                            </tbody>
                        </table>
                    {/await}
                </div>
            </div>
        </div>
    {/if}
</section>
