const { Client } = require("pg");
const readlineSync = require("readline-sync");

async function getMovies() {
  const options = ["Search", "See Favourites", "Quit"];
  const client = new Client({ database: "omdb" });

  console.log("Hello!");
  await client.connect();
  let option = 0;
  while (options[option] !== "Quit") {
    option = readlineSync.keyInSelect(options, "Select an option ");

    if (options[option] === "Search") {
      const search = readlineSync.question("Search... ");
      const text =
        "SELECT id, name, date, runtime, budget, revenue, vote_average, votes_count FROM movies WHERE name ILIKE $1 AND kind = 'movie' ORDER BY date desc LIMIT 10";
      const values = [`%${search}%`];
      const res = await client.query(text, values);
      console.table(res.rows);
      const moviesToFav = res.rows.map((row) => {
        return { id: row.id, name: row.name };
      });
      movToFav = readlineSync.keyInSelect(
        moviesToFav.map((movie) => movie.name),
        "Select a movie to favourite "
      );
      const insert = "INSERT INTO favourites (movie_id, name) VALUES ($1, $2)";
      const insertValues = [
        moviesToFav[movToFav].id,
        moviesToFav[movToFav].name,
      ];
      const favRes = await client.query(insert, insertValues);
      console.log(moviesToFav[movToFav].name + " added to favourites");
    } else if (options[option] === "See Favourites") {
      console.log("Here are you favourites!");
      const text = "SELECT * from favourites";
      const res = await client.query(text);
      console.table(res.rows);
    }
  }
  await client.end();
  console.log("All done!");
}

getMovies();

/*
insert into favourites(movie_id, name) values ();

need to access list of movie names from search results
then map to 'options' to display
add movie_id and name to favs table
indexes don't line up
*/
