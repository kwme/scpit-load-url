const axios = require('./callservice')
const cheerio = require('cheerio')
const http = require('https'); // or 'https' for https:// URLs
const fs = require('fs');
async function delay(ms = 500) {
    return new Promise((r) => setTimeout(r, ms));
}

async function test() {
    const sss = await axios.post('https://mapdb.cncnet.org/search.php?game=yr&age=0&search=survival')
        .then(function(response) {
            // console.log(response.data)
            return response.data;
        })
        .catch(function(error) {
            console.log(error);
        });

    let $ = cheerio.load(sss)
    const linkss = $("a")
    var links = [];
    // $('a').each((index, value) => {
    //     var link = $(value).attr('href');
    //     var name = $(value).text().trim();
    //     links.push({ "link": link, name: name });
    // });
    linkss.each((index, value) => {
        links.push({ link: $(value).attr("href").replace('./yr', 'https://mapdb.cncnet.org/yr'), name: $(value).text() });

    })

    for (const rr of links) {
        const file = fs.createWriteStream(`file/${rr.name.replace(/\s/g, '-')}.zip`);
        const request = http.get(rr.link, async function(response) {
            response.pipe(file);

            // after download completed close filestream
            file.on("finish", async() => {
                file.close();
                console.log("Download Completed");
            });

        });
        await delay();
        return
    }

}

test()

// let $ = cheerio.load(sss)