const MOVIE_COLLECTION = [
  {
    title: "The Matrix",
    year: 1999,
  },
  {
    title: "A beautiful mind",
    year: 2001,
  },
  {
    title: "Intouchable",
    year: 2011,
  },
  {
    title: "Forrest Gump",
    year: 1994,
  }
]

const findByTitle = (title, collection) => {
  return collection.filter(movie => movie.title === title);
}

// return an array of all movies that have at least one match
const movieFound = findByTitle("The Matrix", MOVIE_COLLECTION);