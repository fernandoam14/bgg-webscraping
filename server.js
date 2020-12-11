const Express = require("express");
const UtilDatabase = require("./database/utilDatabase.js");

(async () => {
  const app = Express();
  const port = process.env.PORT || 5000;

  app.get("/api/boardgames", async (req, res) => {
    const db = UtilDatabase.openDatabase("./database/boardgames.db");
    const result = await UtilDatabase.queryGames(db, `SELECT * FROM Game`, []);
    UtilDatabase.closeDatabase(db);

    res.send({ express: result });
  });

  //TODO: fix post request
  /* app.post("/api/boardgames/add", async (req, res) => {
    let newGame = [
      {
        id: req.body.id,
        name: req.body.name,
        year: req.body.year,
        description: req.body.description,
        player_count: req.body.player_count,
        playing_time: req.body.playing_time,
        minimum_age: req.body.minimum_age,
        complexity: req.body.complexity,
        geek_rating: req.body.geek_rating,
        average_rating: req.body.average_rating,
        number_voters: req.body.number_voters,
      },
    ];

    const db = UtilDatabase.openDatabase("./database/boardgames.db");
    const sql = `INSERT INTO Game(id, name, year, description, player_count, playing_time, minimum_age, complexity, geek_rating, average_rating, number_voters) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
    await UtilDatabase.queryGames(db, sql, newGame);
    UtilDatabase.closeDatabase(db);

    res.send("Post received");
  }); */

  //TODO: put request
  //TODO: delete request

  app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });
})();
