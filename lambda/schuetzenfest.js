const fs = require('fs');

let koenige = JSON.parse(fs.readFileSync('./data/koenige.json'));
let jungschuetzen = JSON.parse(fs.readFileSync('./data/jungschuetzen.json'));

module.exports = {
    nextSchuetzenfest: function (date) {
        return calcNextSchuetzenfest(date);
    },

    lastSchuetzenfest: function (date) {

        let dateLastSchuetzenfest = calcLastSchuetzenfestYear(date);
        return calcNextSchuetzenfest(dateLastSchuetzenfest);
    },

    daysUntilNext: function () {
        return calcDaysUntilNext();
    },

    kingInfo: function (year) {
        return getKingInfo(year);
    },

    throneInfo: function (year) {
        return getThroneInfo(year);
    },

    kingInfo2: function (years) {
        return getKingInfoForBackwards(years);
    },

    throneInfo2: function (years) {
        return getThroneInfoBackwards(years);
    },

    jungschuetzenBackwards: function (year) {
        return jungschuetzenBackwards(year);
    },
}

function getThroneInfoBackwards(years) {
    const year = new Date().getFullYear()-years;
    return getThroneInfo(year);
}

function getThroneInfo(year) {
    if (year === undefined) {
        year = new Date().getFullYear();
    }

    if (checkForFirstYear(year)) {
        return "Mir liegen leider nur Informationen zu den Schützenfesten ab dem Jahre 1949 vor.";
    }

    const koenigInfo = getKingValues(year, koenige);
    let output = getKingInfo(year);

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

function getKingInfoForBackwards(years) {
    const year = new Date().getFullYear()-years;
    return getKingInfo(year);
}


function getKingInfo(year) {

    if (year === undefined) {
        year = new Date().getFullYear();
    }

    if (checkForFirstYear(year)) {
        return "Mir liegen leider nur Informationen zu den Schützenfesten ab dem Jahre 1949 vor.";
    }

    let koenigInfo = getKingValues(year, koenige);

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

function calcDaysUntilNext() {
    const jetzt = new Date();
    const beginn = calcBeginn(jetzt.getFullYear());
    const ende = calcEnde(jetzt.getFullYear());
    const one_day = 1000 * 60 * 60 * 24;
    let diff;

    if (ende.getTime() < (jetzt.getTime() - 24 * 3600 * 1000)) {
        diff = calcBeginn(jetzt.getFullYear() + 1).getTime() - jetzt.getTime();
    } else if (beginn.getTime() > (new Date().getTime() - 24 * 3600 * 1000)) {
        diff = beginn.getTime() - jetzt.getTime();
    } else {
        return "Ab auf den Schützenplatz, denn das Schützenfest findet aktuell statt."
    }

    return "Das Schützenfest findet in " + Math.round(diff / one_day) + " Tagen statt.";
}

function calcLastSchuetzenfestYear(date) {
    let year = date.getFullYear() - 1;

    if (checkForFirstYear(date.getFullYear())) {
        return "Mir liegen leider nur Informationen zu den Schützenfesten ab dem Jahre 1949 vor.";
    }


    while (isSpecialYear(year)) {
        year -= 1;
    }

    date.setFullYear(year);
    return date;
}

function calcNextSchuetzenfest(date) {
    let specInfo = getSpecialYearInfo(date.getFullYear());

    if (specInfo !== undefined) {
        return specInfo;
    }

    let beginn = calcBeginn(date.getFullYear());
    let ende = calcEnde(date.getFullYear());

    let result = "Das Schützenfest " + date.getFullYear();

    if (ende.getTime() < (new Date().getTime() - 24 * 3600 * 1000)) {
        result = result + " fand "
    } else {
        result = result + " findet ";
    }

    if (date.getFullYear() < 1990) {
        result = result + " wahrscheinlich ";
    }

    beginn = beginn.toLocaleString('de-DE', { month: 'long', day: "numeric", timeZone: 'Europe/Berlin' });
    ende = ende.toLocaleString('de-DE', { month: 'long', day: "numeric", timeZone: 'Europe/Berlin' });

    result = result + 'von Samstag, den ' + beginn + ', bis Dienstag, den ' + ende + ' statt.';

    return result;
}

function jungschuetzenBackwards(year) {
    if (year === undefined) {
        year = new Date().getFullYear();
    }

    if (checkForFirstJungschuetzenYear(year)) {
        return "Heiner Schulze Niehues schoss sich im Jahre 1970 zum ersten König der Jungschützen.";
    }

    const koenigInfo = getKingValues(year, jungschuetzen);

    if (koenigInfo.ende_jahr === 9999) {
       return "In Freckenhorst regiert " + koenigInfo.name + " die Jungschützenkompanie."
    } else {
        return "Im Jahre " + koenigInfo.beginn_jahr + " schoss sich " + koenigInfo.name + " zum König der Jungschützen.";
    }
}

function getKingValues(year, data) {
    let koenigInfo = data.filter(function (item) {
        return item.beginn_jahr <= year && item.ende_jahr > year;
    })[0];


    if (koenigInfo === undefined) {
        let maxYear = Math.max.apply(Math, data.map(function (o) { return o.beginn_jahr; }));
        koenigInfo = getKingValues(maxYear, data);
    }
    return koenigInfo;
}

function getSpecialYearInfo(year) {

    if (checkForFirstYear(year)) {
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

function isSpecialYear(year) {
    switch (year) {
        case 1949:
        case 1950:
        case 2020:
        case 2021:
            return true;
        default:
            return false;
    }
}

function checkForFirstYear(year) {
    return year < 1949;
}

function checkForFirstJungschuetzenYear(year) {
    return year < 1970;
}

function calcBeginn(year) {
    let beginn = new Date(year, 6, 30);
    const verschiebung = new Date(year, 6, 31).getDay();
    beginn.setDate(beginn.getDate() - verschiebung);
    return beginn;
}

function calcEnde(year) {
    let ende = new Date(year, 7, 2);
    const verschiebung = new Date(year, 6, 31).getDay();
    ende.setDate(ende.getDate() - verschiebung);
    return ende;
}
