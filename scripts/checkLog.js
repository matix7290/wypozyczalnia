export default async function checkLog() {
    let data = new FormData();
    data.append("name", "logged");

    let URL = "./backend/GetSession.php";
    let res = await fetch(URL, {
        method: "POST",
        body: data,
        mode: "no-cors",
    });

    res = await res.json();

    return res;
}