export default async function getSession(names) {
    let data = new FormData();
    data.append("names", JSON.stringify(names));

    let URL = "./backend/GetSession.php";
    let res = await fetch(URL, {
        method: "POST",
        body: data,
        mode: "no-cors",
    });

    res = await res.json();

    return res;
}