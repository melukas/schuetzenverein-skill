var https = require('https');

let githubPath = '/melukas/schuetzenverein-skill/main/lambda/data/data.json'

let koenige;
let jungschuetzen;
let damen;
let ehrengarde;
let termine;

module.exports = {
    getKoenigeData: async function () {
        return getKoenigeData();
    },
    getJungschuetzenData: async function () {
        return getJungschuetzenData();
    },
    getDamenData: async function () {
        return getDamenData();
    },
    getEhrengardeData: async function () {
        return getEhrengardeData();
    },
    getTerminData: async function () {
        return getTerminData();
    },
}

async function getKoenigeData() {
    if (koenige === undefined) {
        await loadData();
    }

    return koenige;
}

async function getJungschuetzenData() {
    if (jungschuetzen === undefined) {
        await loadData();
    }

    return jungschuetzen;
}

async function getDamenData() {
    if (damen === undefined) {
        await loadData();
    }

    return damen;
}

async function getEhrengardeData() {
    if (ehrengarde === undefined) {
        await loadData();
    }

    return ehrengarde;
}

async function getTerminData() {
    if (termine === undefined) {
        await loadData();
    }

    return termine;
}

async function loadData() {
    let data = await httpGet(githubPath);
    koenige = data.koenige;
    jungschuetzen = data.jungschuetzen;
    damen = data.damen;
    ehrengarde = data.ehrengarde;
    termine = data.termine;
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