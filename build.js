/**
 * @author baoyuhao
 * @date 2023/10/10 00:40:07
 * @description
 * @version 0.1.0
 */
console.log('build > 文件开始执行！')

const fs = require('fs')
const path = require('path')

function getRootPath(...dir) {
    return path.resolve(process.cwd(), ...dir)
}

const runBuild = () => {
    try {
        const OUTPUT_DIR = 'dist'
        const PUBLIC_DIR = 'public'
        const VERSION = 'version.json'
        const versionJson = {
            version: 'V_' + Math.floor(Math.random() * 10000) + Date.now()
        }
        fs.writeFileSync(getRootPath(`${PUBLIC_DIR}/${VERSION}`), JSON.stringify(versionJson))
        fs.writeFileSync(getRootPath(`${OUTPUT_DIR}/${VERSION}`), JSON.stringify(versionJson))
        console.log(`version file is build successfully!`)
    } catch (error) {
        console.error('version build error:\n' + error)
        process.exit(1)
    }
}
runBuild();
console.log('build > 文件执行结束！')