const { Client } = require("pg");
const readlineSync = require("readline-sync");

async function getMovies() {
  const client = new Client({ database: "omdb" });
  console.log("Hello!");
  await client.connect();
  let search = "";
  while (search !== "q") {
    search = readlineSync.question(
      "What movie would you like to search for? (or 'q' to quit) "
    );
    if (search === "q") {
      await client.end();
    } else {
      const text =
        "SELECT id, name, date, runtime, budget, revenue, vote_average, votes_count FROM movies WHERE name ILIKE $1 AND kind = 'movie' ORDER BY date desc LIMIT 10";
      const values = [`%${search}%`];
      const res = await client.query(text, values);
      console.table(res.rows);
    }
  }
  await client.end();
}

getMovies();
