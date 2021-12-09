<script>
    async function loaded() {
        let data = new FormData();
        data.append("name", "logged");

        let URL = "./backend/GetSession.php";
        let res = await fetch(URL, {
            method: "POST",
            body: data,
            mode: "no-cors",
        });

        res = await res.json();

        if (res === null) {
            data = new FormData();
            data.append("name", "logged");
            data.append("value", false);

            URL = "./backend/SetSession.php";
            res = await fetch(URL, {
                method: "POST",
                body: data,
                mode: "no-cors",
            });

            res = await res.json();
        }
    }

    document.onload = loaded();
</script>

<section class="h-2/3">
    <div class="container w-auto h-full my-auto mx-auto flex">
        <h1 class="my-auto mx-auto text-5xl">Home</h1>
    </div>
</section>
