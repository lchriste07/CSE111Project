const sqlite3 = require('sqlite3')
const Promise = require('bluebird')


class Matches {
    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath, (err) => {
            if (err) {
                console.log('Could not connect to database', err)
            } else {
                console.log('Connected to database')
            }
        })
    }
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.get(sql, params, (err, result) => {
            if (err) {
              console.log('Error running sql: ' + sql)
              console.log(err)
              reject(err)
            } else {
              resolve(result)
            }
          })
        })
      }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.log('Error running sql: ' + sql)
                    console.log(err)
                    reject(err)
                } else {
                    resolve(rows)
                }
            })
        })
    }

    allMakers() {
        return this.all(
            "SELECT DISTINCT maker FROM Product ORDER BY maker", [])
    }

    pcsByMaker(_maker) {
        return this.all(
            "select P.model as model, PC.price as price " +
            "from Product P, PC " +
            "where P.model = PC.model AND " +
            "maker = ?", [_maker])
    }

    productByMaker(_pType, _maker) {
        return this.all(
            "select P.model as model, " +
            _pType + ".price as price " +
            "from Product P, " + _pType +
            " where P.model = " + _pType + ".model AND " +
            "maker = ?", [_maker])
    }

    allProductsByMaker(_maker) {
        return this.all(
            "select P.model as model, P.type as type, PC.price as price " +
            "from Product P, PC " +
            "where P.model = PC.model AND " +
            "maker = ?" +
            " UNION " +
            "select P.model as model, P.type as type, L.price as price " +
            "from Product P, Laptop L " +
            "where P.model = L.model AND " +
            "maker = ?" +
            " UNION " +
            "select P.model as model, P.type as type, Pr.price as price " +
            "from Product P, Printer Pr " +
            "where P.model = Pr.model AND " +
            "maker = ?", [_maker, _maker, _maker])
    }
}

module.exports = Matches
