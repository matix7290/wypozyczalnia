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
</script>

<div id="home" on:load={loaded()}>
    <h1>Home</h1>
</div>

<style>
    #home {
        font-size: 50px;
        text-align: center;
    }
</style>
