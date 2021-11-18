XLSX = require('xlsx');
const fs = require('fs')
const readline = require('readline');
const csvtojson = require('csvtojson')


// XLS TO CSV
async function xlstocsv() {

    const xlsFiles = fs.readdirSync("./xlsFiles")

    xlsFiles.map((xlsFile) => {
        const workBook = XLSX.readFile('./xlsFiles/' + xlsFile);
        XLSX.writeFile(workBook, './csvFiles/' + xlsFile.slice(0, -3) + 'csv', { bookType: "csv" });
    })
    console.log("xlstocsv exitoso\n")
} 


// REMOVE HEAD
async function removeHead() {
    
    const files = fs.readdirSync("./csvFiles")

    function sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        })
    }

    files.map(async (dirPath) => {
        
        // obtener la cantidad de filas a eliminar
        const fileStream = await fs.createReadStream('./csvFiles/' + dirPath);
        const rl = await readline.createInterface({ input: fileStream, crlfDelay: Infinity });
        let cantFilas = 0

        for await (const line of rl) {
            cantFilas++
            if (line.includes('Port Information for ETH')) { break }
            await sleep(100)
        } //console.log(cantFilas);

        // eliminar las filas
        await fs.readFile('./csvFiles/' + dirPath, 'utf8', function (err, data) {
            if (err) { console.log(err) }
            let linesExcept = data.split('\n').slice(cantFilas);
            let linesArr = linesExcept.map(line => line.split(','));
            let output = linesArr.filter(line => !line.includes('icar-new')).join("\n");
            fs.writeFileSync('./csvFiles/' + dirPath, output);
        });
    })

    console.log("remove head exitoso\n")
} 


// FORMAT JSON
async function formarJson() {

    let datosx = []
    const csvFilePaths = await fs.readdirSync("./csvFiles")

    await csvFilePaths.map((csvFilePath) => {

        csvFilePath = './csvFiles/' + csvFilePath
        csvtojson()
            .fromFile(csvFilePath)
            .then((res) => {

                for (let row of res) {
                    if (csvFilePath.includes('_2021')) {
                        row['idu'] = csvFilePath.slice(11, -24)
                    } else {
                        row['idu'] = csvFilePath.slice(11, -4)
                    }
                    delete row['Order No.']
                    delete row['Port Mode']
                    delete row['Encapsulation Type']
                    delete row['Working Mode']
                    delete row['Max Frame Length (bytes)']
                    delete row['Auto-Negotiation Ability']
                    delete row['Logical Port Attribute']
                    delete row['Running Status']
                    delete row['Traffic Policing Status']
                    delete row['Traffic Policing Period(min)']
                    datosx = datosx.concat(row)
                }
                //console.log(datosx)
                fs.writeFileSync('./jsonFinalPuertos.json', JSON.stringify(datosx), 'utf-8', (e) => {
                    if (e) { console.log(e) }
                })
            })

    })
    console.log("Format JSON")

}

// xlstocsv()
// removeHead()
formarJson()

