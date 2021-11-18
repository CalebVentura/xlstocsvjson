const fs = require('fs')
const readline = require('readline');

// Obtener lista de archivos de un directorio
const files = fs.readdirSync("./csvFiles")
//console.log(files);

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
// remover cabecera de csv
files.map(
    async (dirPath) => {
        
        dirPath = './csvFiles/' + dirPath
        // obtener la cantidad de filas a eliminar

        const fileStream = await fs.createReadStream(dirPath);
        const rl = await readline.createInterface({ input: fileStream, crlfDelay: Infinity });
        let cantFilas = 0

        for await (const line of rl) {
            cantFilas++
            if (line.includes('Port Information for ETH')) { break }
            await sleep(100)
        } //console.log(cantFilas);

        // eliminar las filas
        await fs.readFile(dirPath, 'utf8', function (err, data) {
            if (err) { console.log(err) }
            let linesExcept = data.split('\n').slice(cantFilas);
            let linesArr = linesExcept.map(line => line.split(','));
            let output = linesArr.filter(line => line.includes('Port Information for ETH')).join("\n");
            fs.writeFileSync(dirPath, output);
        });
        
    })

