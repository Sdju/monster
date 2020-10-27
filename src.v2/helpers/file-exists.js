const fs = require('fs').promises;

module.exports = async function fileExists() {
    try {
        await fs.access(path, fs.F_OK)
        return true
    }catch {
        return false
    }
}