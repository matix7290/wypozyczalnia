<script>
    import getSession from "../../../scripts/getSession";

    let logged = false;
    let permissions = {};
    let statuses = {};

    let getItems = async () => {
        const URL = "./backend/GetAllUsers.php";

        let res = await fetch(URL);

        res = await res.json();

        for (let i = 0; i < res.length; i++) {
            permissions[res[i].id] = res[i].user_type_id.toString();
            statuses[res[i].id] = res[i].active.toString();
        }

        return res;
    };

    let cancel = () => location.reload();

    let save = async () => {
        const URL = "./backend/EditUsers.php";
        let data_array = Object.keys(permissions).map((key) => [
            permissions[key],
            statuses[key],
            key,
        ]);
        let data = new FormData();
        data.append("data", JSON.stringify(data_array));

        let res = await fetch(URL, {
            method: "POST",
            mode: "no-cors",
            body: data,
        });

        res = await res.json();

        location.reload();
    };

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
                                    >Nazw użytkownika</th
                                >
                                <th
                                    class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                    >Imię</th
                                >
                                <th
                                    class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                    >Nazwisko</th
                                >
                                <th
                                    class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                    >Uprawnienia</th
                                >
                                <th
                                    class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100"
                                    >Status konta</th
                                >
                            </tr>
                        </thead>
                        <tbody>
                            {#await getItems()}
                                loading...
                            {:then response}
                                {#each response as item}
                                    <tr>
                                        <td class="px-4 py-3">
                                            {item.username}
                                        </td>
                                        <td class="px-4 py-3">
                                            {item.firstname}
                                        </td>
                                        <td class="px-4 py-3">
                                            {item.lastname}
                                        </td>
                                        <td class="px-4 py-3">
                                            <select
                                                name="permissions_name"
                                                id="permissions_name"
                                                bind:value={permissions[
                                                    item.id
                                                ]}
                                                class="w-32 flex bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 leading-8 transition-colors duration-200 ease-in-out"
                                            >
                                                <option value="3"
                                                    >Standardowe</option
                                                >
                                                <option value="2"
                                                    >Moderatorskie</option
                                                >
                                            </select>
                                        </td>
                                        <td class="px-4 py-3">
                                            <select
                                                name="permissions_name"
                                                id="permissions_name"
                                                bind:value={statuses[item.id]}
                                                class="w-28 flex bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 leading-8 transition-colors duration-200 ease-in-out"
                                            >
                                                <option value="1"
                                                    >Aktywne</option
                                                >
                                                <option value="0"
                                                    >Nieaktywne</option
                                                >
                                            </select>
                                        </td>
                                    </tr>
                                {/each}
                                <tr>
                                    <th
                                        colspan="2"
                                        class="title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 text-center"
                                    >
                                        <button
                                            class="w-full h-full px-4 py-2"
                                            style="border: none;"
                                            on:click={() => {
                                                save();
                                            }}
                                        >
                                            Zapisz
                                        </button>
                                    </th>
                                    <th
                                        class="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 text-center"
                                    /><th
                                        colspan="2"
                                        class="title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 text-center"
                                    >
                                        <button
                                            class="w-full h-full px-4 py-2"
                                            style="border: none;"
                                            on:click={() => {
                                                cancel();
                                            }}
                                        >
                                            Anuluj
                                        </button>
                                    </th>
                                </tr>
                            {/await}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    {/if}
</section>
