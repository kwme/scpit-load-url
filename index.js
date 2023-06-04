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
        links.push({ link: $(value).attr("href").replace('./yr', 'https://mapdb.cncnet.org/yr'), name: $(value).attr("href").split('/')[2] });

    })

    let i = 1;

    const perChunk = 100 // items per chunk    

    const inputArray = links

    const result = inputArray.reduce((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / perChunk)

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
    }, [])

    // console.log(result)
    for (const rrr of result) {
        let promises = [];

        rrr.forEach(function(rr) {
            let rettt = `${i}.Download Completed`;
            const proo = new Promise((resolve, reject) => {
                const file = fs.createWriteStream(`file/${rr.name}`);
                const request = http.get(rr.link, async function(response) {
                    response.pipe(file);
                    file.on("finish", function() {
                        file.close(() => {
                            // console.log(`${i}.Download Completed`);
                            resolve(rettt);
                        });
                    });
                    file.on("error", function(err) {
                        fs.unlink(pipFilePath);
                        reject(err);
                    });
                });
            });
            i++;
            promises.push(proo)
        });
        await Promise.all(promises).then(function(results) {
            console.log(results)
            results.forEach(function(response) {
                console.log(response)
            })

        });
    }

}

test()

// let $ = cheerio.load(sss)