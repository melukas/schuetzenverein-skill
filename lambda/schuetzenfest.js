const general = require('./general');
const datum = require('./datum');
const data = require('./data');

module.exports = {
    generiereTextWannNaechstesSchutzenfest: function (date) {
        return datum.generiereTextWannNaechstesSchutzenfest(date);
    },

    generiereTextWannLetztesSchutzenfest: function () {
        let dateLastSchuetzenfest = datum.getJahresBeginnDesLetztenSchuetzenfestes();
        return datum.generiereTextWannNaechstesSchutzenfest(dateLastSchuetzenfest);
    },

    generiereTextFuerTageBisZumNaechstenSchuetzenfest: function () {
        return datum.generiereTextFuerTageBisZumNaechstenSchuetzenfest();
    },

    generiereTextZuKoenigspaarInJahr: async function (year) {
        return general.generiereTextZuKoenigspaarInJahr(year);
    },

    generiereTextFuerThronInJahr: async function (year) {
        return general.generiereTextFuerThronInJahr(year);
    },

    generiereTextZuKoenigspaarVorJahren: async function (years) {
        return general.generiereTextZuKoenigspaarVorJahren(years);
    },

    generiereTextFuerThronVorJahren: async function (years) {
        return generiereTextFuerThronVorJahren(years);
    },

    generiereTextZuJungschuetzenkoenigInJahr: async function (year) {
        return generiereTextZuJungschuetzenkoenigInJahr(year);
    },

    generiereTextZuJungschuetzenkoenigVorJahren: async function (year) {
        return generiereTextZuJungschuetzenkoenigVorJahren(year);
    },

    generiereTextZuDamenkoeniginInJahr: async function (year) {
        return generiereTextZuDamenkoeniginInJahr(year);
    },

    generiereTextZuDamenkoeniginVorJahren: async function (year) {
        return generiereTextZuDamenkoeniginVorJahren(year);
    },

    generiereTextZuEhrengardenkoenigInJahr: async function (year) {
        return generiereTextZuEhrengardenkoenigInJahr(year);
    },

    generiereTextZuEhrengardenkoenigVorJahren: async function (year) {
        return generiereTextZuEhrengardenkoenigVorJahren(year);
    },
}

async function generiereTextFuerThronVorJahren(years) {
    const year = new Date().getFullYear() - years;
    return general.generiereTextFuerThronInJahr(year);
}

async function generiereTextZuJungschuetzenkoenigVorJahren(years) {
    const year = new Date().getFullYear() - years;
    return generiereTextZuJungschuetzenkoenigInJahr(year);
}

async function generiereTextZuJungschuetzenkoenigInJahr(year) {
    if (year === undefined) {
        year = new Date().getFullYear();
    }

    if (datum.istVorErstemJungschuetzenJahr(year)) {
        return "Heiner Schulze Niehues schoss sich im Jahre 1970 zum ersten König der Jungschützen.";
    }

    const koenigInfo = general.ladeDatensatzZuJahr(year, await data.getJungschuetzenData());

    if (koenigInfo.ende_jahr === 9999) {
        return koenigInfo.name + " regiert derzeit die Jungschützenkompanie."
    } else {
        return "Im Jahre " + koenigInfo.beginn_jahr + " schoss sich " + koenigInfo.name + " zum König der Jungschützen.";
    }
}

async function generiereTextZuDamenkoeniginVorJahren(years) {
    const year = new Date().getFullYear() - years;
    return generiereTextZuDamenkoeniginInJahr(year);
}

async function generiereTextZuDamenkoeniginInJahr(year) {
    if (year === undefined) {
        year = new Date().getFullYear();
    }

    if (datum.istVorErstemDamenJahr(year)) {
        return "Natalie Wessel-Terharn schoss sich im Jahre 2012 zur ersten Königin der Formation der Damen.";
    }

    const koenigInfo = general.ladeDatensatzZuJahr(year, await data.getDamenData());

    if (koenigInfo.ende_jahr === 9999) {
        return koenigInfo.name + " regiert derzeit die Formation der Damen."
    } else {
        return "Im Jahre " + koenigInfo.beginn_jahr + " schoss sich " + koenigInfo.name + " zur Königin der Formation der Damen.";
    }
}

async function generiereTextZuEhrengardenkoenigVorJahren(years) {
    const year = new Date().getFullYear() - years;
    return generiereTextZuEhrengardenkoenigInJahr(year);
}

async function generiereTextZuEhrengardenkoenigInJahr(year) {
    if (year === undefined) {
        year = new Date().getFullYear();
    }

    if (datum.istVorErstemEhrengardenJahr(year)) {
        return "Mir liegen leider nur Informationen zu den Ehrengardenkönigen ab dem Jahre 1970 vor.";
    }

    const koenigInfo = general.ladeDatensatzZuJahr(year, await data.getEhrengardeData());

    if (koenigInfo.ende_jahr === 9999) {
        return "König " + koenigInfo.name + " regiert derzeit die Ehrengarde."
    } else {
        return "König " + koenigInfo.name + " war im Jahre " + koenigInfo.beginn_jahr + " Regent der Ehrengarde.";
    }

}