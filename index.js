const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const URL = require('js-handy-url');
const csv = require('fast-csv');

const sitemap = path.resolve('./data/vitaplace_sitemap.xml');
const oldHost = 'https://www.vitaplace.de';
const newHost = 'https://shop.vitaplace.de';

const parser = new xml2js.Parser();

fs.readFile(sitemap, function(err, data) {
    parser.parseString(data, function (err, result) {

        const ignorePaths = ['/'];
        const csvData = [
            ['source', 'target', 'regex']
        ];

        result.urlset.url.forEach(function (urlSet) {
            const url = new URL(urlSet.loc[0]);

            if (ignorePaths.indexOf(url.path) < 0) {
                url.makeRelative();
                csvData.push([url.toString(), newHost + url.toString(), 0]);
            }
        });

        csv.writeToPath(
            path.resolve('./data/redirects.csv'), csvData, {headers: true}
        )
    });
});
