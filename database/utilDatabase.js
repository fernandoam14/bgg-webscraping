const Sqlite = require("sqlite3");

module.exports = {
  openDatabase: openDatabase,
  closeDatabase: closeDatabase,
  createTables: createTables,
  insertGames: insertGames,
  queryGames: queryGames,
};

function openDatabase(name) {
  return new Sqlite.Database(name);
}

function closeDatabase(db) {
  db.close();
}

function createTables(db) {
  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS Game");

    db.run(
      "CREATE TABLE Game(" +
        "id INTEGER NOT NULL, " +
        "name TEXT not NULL, " +
        "year INTEGER, " +
        "description TEXT, " +
        "player_count TEXT, " +
        "playing_time TEXT, " +
        "minimum_age INTEGER, " +
        "complexity REAL, " +
        "geek_rating REAL, " +
        "average_rating REAL, " +
        "number_voters INTEGER, " +
        "PRIMARY KEY (id))"
    );
  });
}

async function insertGames(db, games) {
  /*
   * Waits for all games to be ready.
   */
  let gamesArray = await Promise.all(games);

  /*
   * Formats gamesArray for insertion.
   */
  const placeholders = gamesArray
    .map((game) => "(?,?,?,?,?,?,?,?,?,?,?)")
    .join(",");
  gamesArray = gamesArray.map(Object.values);
  gamesArray = [].concat(...gamesArray);

  /*
   * Inserts all games in gamesArray in a single INSERT INTO command.
   */
  db.run(
    `INSERT INTO Game(id, name, year, description, player_count, playing_time, minimum_age, complexity, geek_rating, average_rating, number_voters) VALUES ` +
      placeholders,
    gamesArray,
    function (err) {
      if (err) {
        return console.log(err.message);
      }

      return "Success!";
    }
  );
}

async function queryGames(db, sql, game) {
  return new Promise((resolve, reject) => {
    db.all(sql, game, (err, rows) => {
      if (err) {
        console.log(err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
