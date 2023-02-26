const datum = require('./datum');
const data = require('./data');

module.exports = {
    generiereTextZuKoenigspaarInJahr: async function (year) {
        return generiereTextZuKoenigspaarInJahr(year);
    },
    ladeDatensatzZuJahr: function (year, data) {
        return ladeDatensatzZuJahr(year, data);
    },
    generiereTextZuKoenigspaarVorJahren: async function (years) {
        return generiereTextZuKoenigspaarVorJahren(years);
    },
    generiereTextFuerThronInJahr: async function (years) {
        return generiereTextFuerThron(years);
    },
}

async function generiereTextZuKoenigspaarInJahr(year) {
    if (year === undefined) {
        year = new Date().getFullYear();
    }

    if (datum.istVorErstemSchuetzenfest(year)) {
        return "Mir liegen leider nur Informationen zu den Schützenfesten ab dem Jahre 1949 vor.";
    }

    let kd = await data.getKoenigeData();
    console.log("LOAD DATA")
    console.log(kd)

    let koenigInfo = ladeDatensatzZuJahr(year, kd);
    let output;

    if (koenigInfo.ende_jahr === 9999) {
        output = "In Freckenhorst regiert " + koenigInfo.name + " die Bürgerschützen. "
    } else {
        output = "Im Jahre " + koenigInfo.beginn_jahr + " schoss sich " + koenigInfo.name;

        if (koenigInfo.koenigsschuss > 0) {
            output += " mit dem " + koenigInfo.koenigsschuss + ". Schuss"
        }

        if (koenigInfo.geschlecht_koenig === "m" && koenigInfo.bisherige_regentschaften === 0) {
            output += " zum König der Bürgerschützen. "
        } else if (koenigInfo.geschlecht_koenig === "m" && koenigInfo.bisherige_regentschaften > 0) {
            output += " zum Kaiser der Bürgerschützen. "

        } else if (koenigInfo.bisherige_regentschaften === 0) {
            output += " zur Königin der Bürgerschützen. "
        } else {
            output += " zur Kaiserin der Bürgerschützen. "
        }
    }

    let artikel;

    if (koenigInfo.geschlecht_koenig === "m") {
        artikel = "er";

    } else {
        artikel = "sie";
    }

    if (koenigInfo.geschlecht_koenigin === "m" && koenigInfo.bisherige_regentschaften === 0) {
        output += "Zum König erkor " + artikel + " sich "
    } else if (koenigInfo.geschlecht_koenigin === "m" && koenigInfo.bisherige_regentschaften > 0) {
        output += "Zum Kaiser erkor " + artikel + " sich "
    } else if (koenigInfo.bisherige_regentschaften === 0) {
        output += "Zur Königin erkor " + artikel + " sich "
    } else {
        output += "Zur Kaiserin erkor " + artikel + " sich "
    }

    output += koenigInfo.name_begleitung + ".";

    return output;
}

async function generiereTextFuerThron(year) {
    if (year === undefined) {
        year = new Date().getFullYear();
    }

    if (datum.istVorErstemSchuetzenfest(year)) {
        return "Mir liegen leider nur Informationen zu den Schützenfesten ab dem Jahre 1949 vor.";
    }

    const koenigInfo = ladeDatensatzZuJahr(year, await data.getKoenigeData());
    let output = await generiereTextZuKoenigspaarInJahr(year);

    if (koenigInfo.hofstaat === "[]") {
        return output + " Zum Hofstaat liegen mir leider keine Informationen vor."
    }

    if (koenigInfo.ende_jahr === 9999) {
        output += " Dem Hofstaat gehören "

    } else {
        output += " Dem Hofstaat gehörten "
    }

    let altesPaar = koenigInfo.hofstaat[0];
    let trennzeichen = "";

    koenigInfo.hofstaat.forEach(paar => {
        if (paar !== altesPaar) {
            output += trennzeichen + altesPaar
            altesPaar = paar;
            trennzeichen = ", ";
        }
    })

    output += " sowie " + altesPaar + " an."

    return output;
}

function ladeDatensatzZuJahr(year, data) {
    console.log("Geladen: " + data)
    let koenigInfo = data.filter(function (item) {
        return item.beginn_jahr <= year && item.ende_jahr > year;
    })[0];


    if (koenigInfo === undefined) {
        let maxYear = Math.max.apply(Math, data.map(function (o) {
            return o.beginn_jahr;
        }));
        koenigInfo = ladeDatensatzZuJahr(maxYear, data);
    }
    return koenigInfo;
}

async function generiereTextZuKoenigspaarVorJahren(years) {
    const year = new Date().getFullYear() - years;
    return generiereTextZuKoenigspaarInJahr(year);
}