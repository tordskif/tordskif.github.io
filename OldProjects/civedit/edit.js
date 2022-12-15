class Perk {
    constructor(perks) {
        this.economy = perks.economy || "0";
        this.military = perks.military || "0";
        this.science = perks.science || "0";
    }

    render() {
        let s = `
        <ul>
            <li>Economy: ${this.economy}
            <li>Military: ${this.military}
            <li>Science: ${this.science}
        </ul>
        `;
        return s;
    }
}


class Nation {
    constructor(navn, info, perk) {
        this.navn = navn;
        this.title = info.title || "Leader";
        this.leader = info.leader || "Mr President";
        this.capital = info.capital || navn + " City";
        //this.picture = info.picture;
        this.perk = perk || new Perk({});
    }

    render() {
        let s = `
        <ul>
            <li>Navn: ${this.navn}
            <li>Leder: ${this.title} ${this.leader}
            <li>Hovedstad: ${this.capital}
            <li>Perks: ${this.perk.render()}
        </ul>
        `;
        return s;
    }
}

//new Perk()



function setup() {
    // Initialize Firebase
    const config = {
        apiKey: "AIzaSyAphKN_ZeQiMlRaGe_muCm2Y7WLsVnJKVg",
        authDomain: "civedit.firebaseapp.com",
        databaseURL: "https://civedit.firebaseio.com",
        projectId: "civedit",
        storageBucket: "civedit.appspot.com",
        messagingSenderId: "391156665748"
    };
    firebase.initializeApp(config);
    const database = firebase.database;

    let divListe = document.querySelector("#liste");
    let ref = database().ref("nations");

    ref.once("value").
            then(function (snapshot) {
            let land = snapshot.val();
            if (land) {
                console.log("hallo");
                for (let l in land) {
                    let info = land[l];
                    let perk = info.perk || {};
                    let p = new Perk(perk);
                    let n = new Nation(l, info, p);
                    divListe.innerHTML += n.render();
                }
            }
        }
        );
}