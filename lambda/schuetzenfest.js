var https = require('https');

let koenigePath = '/melukas/schuetzenverein-skill/main/lambda/data/koenige.json'
let jungschuetzenPath = '/melukas/schuetzenverein-skill/main/lambda/data/jungschuetzen.json'
let damenPath = '/melukas/schuetzenverein-skill/main/lambda/data/damen.json'
let ehrengardePath = '/melukas/schuetzenverein-skill/main/lambda/data/ehrengarde.json'

let koenige;
let jungschuetzen;
let damen;
let ehrengarde;

module.exports = {
    nextSchuetzenfest: function (date) {
        return calcNextSchuetzenfest(date);
    },

    lastSchuetzenfest: function () {

        let dateLastSchuetzenfest = calcLastSchuetzenfestYear();
        return calcNextSchuetzenfest(dateLastSchuetzenfest);
    },

    daysUntilNext: function () {
        return calcDaysUntilNext();
    },

    kingInfo: async function (year) {
        return getKingInfo(year);
    },

    throneInfo: async function (year) {
        return getThroneInfo(year);
    },

    kingInfo2: async function (years) {
        return getKingInfoForBackwards(years);
    },

    throneInfo2: async function (years) {
        return getThroneInfoBackwards(years);
    },

    jungschuetzenInfo: async function (year) {
        return getJungschuetzenInfo(year);
    },

    jungschuetzenInfoBackwards: async function (year) {
        return getJungschuetzenInfoBackwards(year);
    },

    damenInfo: async function (year) {
        return getDamenInfo(year);
    },

    damenInfoBackwards: async function (year) {
        return getDamenInfoBackwards(year);
    },

    ehrengardeInfo: async function (year) {
        return getEhrengardeInfo(year);
    },

    ehrengardeInfoBackwards: async function (year) {
        return getEhrengardeInfoBackwards(year);
    },
}

async function getThroneInfoBackwards(years) {
    const year = new Date().getFullYear() - years;
    return getThroneInfo(year);
}

async function getThroneInfo(year) {
    await loadData();
    if (year === undefined) {
        year = new Date().getFullYear();
    }

    if (checkForFirstYear(year)) {
        return "Mir liegen leider nur Informationen zu den Schützenfesten ab dem Jahre 1949 vor.";
    }

    const koenigInfo = getKingValues(year, koenige);
    let output = await getKingInfo(year);

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

async function getKingInfoForBackwards(years) {
    const year = new Date().getFullYear() - years;
    return getKingInfo(year);
}


async function getKingInfo(year) {
    await loadData();
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

    let differenz = Math.round(diff / one_day) + 1;

    if (differenz === 1) {
        return "Das Schützenfest startet morgen!"
    }

    return "Das Schützenfest findet in " + differenz + " Tagen statt.";
}

function calcLastSchuetzenfestYear() {
    let year = new Date().getFullYear() - 1;

    while (isSpecialYear(year)) {
        year -= 1;
    }

    let date = new Date();
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

    beginn = beginn.toLocaleString('de-DE', {month: 'long', day: "numeric", timeZone: 'Europe/Berlin'});
    ende = ende.toLocaleString('de-DE', {month: 'long', day: "numeric", timeZone: 'Europe/Berlin'});

    result = result + 'von Samstag, den ' + beginn + ', bis Dienstag, den ' + ende + ' statt.';

    return result;
}

async function getJungschuetzenInfoBackwards(years) {
    const year = new Date().getFullYear() - years;
    return getJungschuetzenInfo(year);
}

async function getJungschuetzenInfo(year) {
    await loadData();
    if (year === undefined) {
        year = new Date().getFullYear();
    }

    if (checkForFirstJungschuetzenYear(year)) {
        return "Heiner Schulze Niehues schoss sich im Jahre 1970 zum ersten König der Jungschützen.";
    }

    const koenigInfo = getKingValues(year, jungschuetzen);

    if (koenigInfo.ende_jahr === 9999) {
        return koenigInfo.name + " regiert derzeit die Jungschützenkompanie."
    } else {
        return "Im Jahre " + koenigInfo.beginn_jahr + " schoss sich " + koenigInfo.name + " zum König der Jungschützen.";
    }
}

async function getDamenInfoBackwards(years) {
    const year = new Date().getFullYear() - years;
    return getDamenInfo(year);
}

async function getDamenInfo(year) {
    await loadData();
    if (year === undefined) {
        year = new Date().getFullYear();
    }

    if (checkForFirstDamenYear(year)) {
        return "Natalie Wessel-Terharn schoss sich im Jahre 2012 zur ersten Königin der Formation der Damen.";
    }

    const koenigInfo = getKingValues(year, damen);

    if (koenigInfo.ende_jahr === 9999) {
        return koenigInfo.name + " regiert derzeit die Formation der Damen."
    } else {
        return "Im Jahre " + koenigInfo.beginn_jahr + " schoss sich " + koenigInfo.name + " zur Königin der Formation der Damen.";
    }
}

async function getEhrengardeInfoBackwards(years) {
    const year = new Date().getFullYear() - years;
    return getEhrengardeInfo(year);
}

async function getEhrengardeInfo(year) {
    await loadData();
    if (year === undefined) {
        year = new Date().getFullYear();
    }

    if (checkForFirstEhrengardeYear(year)) {
        return "König Hagemeier war im Jahre 1970 erster Regent der Ehrengarde.";
    }

    const koenigInfo = getKingValues(year, ehrengarde);

    if (koenigInfo.ende_jahr === 9999) {
        return "König " + koenigInfo.name + " regiert derzeit die Ehrengarde."
    } else {
        return "König " + koenigInfo.name + " war im Jahre " + koenigInfo.beginn_jahr + " Regent der Ehrengarde.";
    }

}

function getKingValues(year, data) {
    let koenigInfo = data.filter(function (item) {
        return item.beginn_jahr <= year && item.ende_jahr > year;
    })[0];


    if (koenigInfo === undefined) {
        let maxYear = Math.max.apply(Math, data.map(function (o) {
            return o.beginn_jahr;
        }));
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

async function loadData() {
    if (koenige === undefined || jungschuetzen === undefined || damen === undefined || ehrengarde === undefined) {
        koenige = await httpGet(koenigePath);
        jungschuetzen = await httpGet(jungschuetzenPath);
        damen = await httpGet(damenPath);
        ehrengarde = await httpGet(ehrengardePath);
    }
}

function httpGet(path) {
    return new Promise(((resolve, reject) => {
        const options = {
            host: 'raw.githubusercontent.com',
            port: 443,
            path: path,
            method: 'GET',
        };

        const request = https.request(options, (response) => {
            response.setEncoding('utf8');
            let returnData = '';

            response.on('data', (chunk) => {
                returnData += chunk;
            });

            response.on('end', () => {
                resolve(JSON.parse(returnData));
            });

            response.on('error', (error) => {
                reject(error);
            });
        });
        request.end();
    }));
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

function checkForFirstDamenYear(year) {
    return year < 2012;
}

function checkForFirstEhrengardeYear(year) {
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
