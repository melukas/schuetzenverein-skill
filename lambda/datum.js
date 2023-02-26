module.exports = {
    istVorErstemSchuetzenfest: function (jahr) {
        return istVorErstemSchuetzenfest(jahr);
    },
    istVorErstemJungschuetzenJahr: function (jahr) {
        return istVorErstemJungschuetzenJahr(jahr);
    },
    istVorErstemDamenJahr: function (jahr) {
        return istVorErstemDamenJahr(jahr);
    },
    istVorErstemEhrengardenJahr: function (jahr) {
        return istVorErstemEhrengardenJahr(jahr);
    },
    generiereTextWannNaechstesSchutzenfest: function (date) {
        return generiereTextWannNaechstesSchutzenfest(date);
    },
    getJahresBeginnDesLetztenSchuetzenfestes: function () {
        return getJahresBeginnDesLetztenSchuetzenfestes();
    },
    generiereTextFuerTageBisZumNaechstenSchuetzenfest: function () {
        return generiereTextFuerTageBisZumNaechstenSchuetzenfest();
    },
}

function generiereTextWannNaechstesSchutzenfest(date) {
    let beginn = getBeginnDatumInJahr(date.getFullYear());
    let ende = getEndeDatumInJahr(date.getFullYear());
    let year;

    if (ende.getTime() < (date.getTime() - 24 * 3600 * 1000)) {
        year = date.getFullYear() + 1;
    } else if (beginn.getTime() > (date.getTime() - 24 * 3600 * 1000)) {
        year = date.getFullYear();
    } else {
        return "Ab auf den Schützenplatz, denn das Schützenfest findet aktuell statt."
    }

    let specInfo = generiereTextFuerBesonderesJahr(year);

    if (specInfo !== undefined) {
        return specInfo;
    }

    beginn = getBeginnDatumInJahr(year);
    ende = getEndeDatumInJahr(year);

    let result = "Das Schützenfest " + year;

    if (ende.getTime() < (new Date().getTime() - 24 * 3600 * 1000)) {
        result = result + " fand "
    } else {
        result = result + " findet ";
    }

    if (year < 1990) {
        result = result + " wahrscheinlich ";
    }

    beginn = beginn.toLocaleString('de-DE', {month: 'long', day: "numeric", timeZone: 'Europe/Berlin'});
    ende = ende.toLocaleString('de-DE', {month: 'long', day: "numeric", timeZone: 'Europe/Berlin'});

    result = result + 'von Samstag, den ' + beginn + ', bis Dienstag, den ' + ende + ' statt.';

    return result;
}

function generiereTextFuerTageBisZumNaechstenSchuetzenfest() {
    const jetzt = new Date();
    const beginn = getBeginnDatumInJahr(jetzt.getFullYear());
    const ende = getEndeDatumInJahr(jetzt.getFullYear());
    const one_day = 1000 * 60 * 60 * 24;
    let diff;

    if (ende.getTime() < (jetzt.getTime() - 24 * 3600 * 1000)) {
        diff = getBeginnDatumInJahr(jetzt.getFullYear() + 1).getTime() - jetzt.getTime();
    } else if (beginn.getTime() > (new Date().getTime() - 24 * 3600 * 1000)) {
        diff = beginn.getTime() - jetzt.getTime();
    } else {
        return "Ab auf den Schützenplatz, denn das Schützenfest findet aktuell statt."
    }

    let differenz = Math.round(diff / one_day) + 1;

    if (differenz === 1) {
        return "Das Schützenfest startet morgen!"
    }

    return "Das Schützenfest findet in " + differenz + " Tagen statt.";
}

function generiereTextFuerBesonderesJahr(year) {

    if (istVorErstemSchuetzenfest(year)) {
        return "Mir liegen leider nur Informationen zu den Schützenfesten ab dem Jahre 1949 vor."
    }

    switch (year) {
        case 1949:
            return 'Das Schützenfest 1949 fand von Sonntag, den 17. Juli bis Montag, den 18. Juli statt.';
        case 1950:
            return 'Das Schützenfest 1949 fand von Samstag, den 8. Juli bis Sonntag, den 9. Juli statt.';
        case 2020:
            return 'Im Jahre 2020 gab es leider kein Schützenfest.';
        case 2021:
            return 'Im Jahre 2021 gab es leider kein Schützenfest.';
        default:
            return undefined;
    }
}

function getJahresBeginnDesLetztenSchuetzenfestes() {
    const jetzt = new Date();
    const beginn = getBeginnDatumInJahr(jetzt.getFullYear());

    let year;

    if (beginn.getTime() < (jetzt.getTime() - 24 * 3600 * 1000)) {
        year = jetzt.getFullYear();
    } else {
        year = jetzt.getFullYear() - 1;
    }

    while (istBesonderesJahr(year)) {
        year -= 1;
    }

    return new Date(year, 0, 1);
}

function istBesonderesJahr(jahr) {
    switch (jahr) {
        case 1949:
        case 1950:
        case 2020:
        case 2021:
            return true;
        default:
            return false;
    }
}

function istVorErstemSchuetzenfest(jahr) {
    return jahr < 1949;
}

function istVorErstemJungschuetzenJahr(jahr) {
    return jahr < 1970;
}

function istVorErstemDamenJahr(jahr) {
    return jahr < 2012;
}

function istVorErstemEhrengardenJahr(jahr) {
    return jahr < 1970;
}

function getBeginnDatumInJahr(jahr) {
    let beginn = new Date(jahr, 6, 30);
    const verschiebung = new Date(jahr, 6, 31).getDay();
    beginn.setDate(beginn.getDate() - verschiebung);
    return beginn;
}

function getEndeDatumInJahr(jahr) {
    let ende = new Date(jahr, 7, 2);
    const verschiebung = new Date(jahr, 6, 31).getDay();
    ende.setDate(ende.getDate() - verschiebung);
    return ende;
}
