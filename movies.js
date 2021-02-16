// First, sign up for an account at https://themoviedb.org
// Once verified and signed-in, go to Settings and create a new
// API key; in the form, indicate that you'll be using this API
// key for educational or personal use, and you should receive
// your new key right away.

//API KEY = 26206ca76d59731fb617955026895a82

// For this exercise, we'll be using the "now playing" API endpoint
// https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US

// Note: image data returned by the API will only give you the filename;
// prepend with `https://image.tmdb.org/t/p/w500/` to get the 
// complete image URL
let db = firebase.firestore()


window.addEventListener('DOMContentLoaded', async function(event) {
    // Step 1: Construct a URL to get movies playing now from TMDB, fetch
    // data and put the Array of movie Objects in a variable called
    // movies. Write the contents of this array to the JavaScript
    // console to ensure you've got good data
    // ⬇️ ⬇️ ⬇️

    let apiKey = `26206ca76d59731fb617955026895a82`
    let movieURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US`
    let genreURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`
    let movieResponse = await fetch(movieURL)
    let movieData = await movieResponse.json()
    let movies = movieData.results

    let genreResponse = await fetch(genreURL)
    let genreData = await genreResponse.json()
   


    // ⬆️ ⬆️ ⬆️ 
    // End Step 1
    
    // Step 2: 
    // - Loop through the Array called movies and insert HTML
    //   into the existing DOM element with the class name .movies
    // - Include a "watched" button to click for each movie
    // - Give each "movie" a unique class name based on its numeric
    //   ID field.
    // Some HTML that would look pretty good... replace with real values :)
    // <div class="w-1/5 p-4 movie-abcdefg1234567">
    //   <img src="https://image.tmdb.org/t/p/w500/moviePosterPath.jpg" class="w-full">
    //   <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
    // </div>
    // ⬇️ ⬇️ ⬇️

  
    for(let i = 0; i <movies.length; i++)
    {

        let movie = movies[i]
        let movieID = movie.id
        let moviePhoto = movie.poster_path
        let movieTitle = movie.title
        let movieRating = movie.vote_average
        let movieDesc = movie.overview
        let movieGenre = movie.genre_ids
        let moviesDiv = document.querySelector('.movies')
        let yourRating = Math.round((movieRating/10) * 100)
        
        
        

        // console.log(movieGenre)

        moviesDiv.insertAdjacentHTML('beforeend', `
        <div class="movie-${movieID} w-1/5 p-4 min-h-459">
          <div class="movie-photo-div zebra">
            <img src="https://image.tmdb.org/t/p/w500/${moviePhoto}" class="movie-photo border-2 w-full">
          </div>
            <p class="movie-title text-white text-xl text-center">${movieTitle}</p>
            <p class="movie-rating text-white text-xl text-center">Online Rating: ${movieRating}/10</p>
            <div class="match-rating">
            <p class="your-rating text-green-500 text-xl text-center">Match: ${yourRating}%</p>
            </div>
              <a href="#" class="watched-button block text-center text-white bg-blue-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
              <div class="flex m-auto">
                <a href="#" class="positive-button block text-center text-3xl bg-green-500 mt-2 w-1/2 px-4 py-2 rounded">👍</a>
                <a href="#" class="negative-button block text-center text-3xl bg-red-500 mt-2 w-1/2 px-4 py-2 rounded">👎</a>
              </div>
        </div>`)

        let watchedButton = document.querySelector(`.movie-${movieID} .watched-button`) 
        let moviePhotoDiv = document.querySelector(`.movie-${movieID} .movie-photo`)

        let movieWatched = await db.collection('watched').doc(`${movieID}`).get()
        let grabMovie = movieWatched.data()
        // console.log(grabMovie)
        if(grabMovie)
        {
          moviePhotoDiv.classList.add('opacity-20')
          watchedButton.classList.remove("bg-blue-500")
          watchedButton.classList.remove("text-white")
          watchedButton.classList.add("text-black")
          watchedButton.classList.add("bg-yellow-200")
          watchedButton.innerHTML = `I haven't watched this`
        }


    

  // THIS CONTROLS THE MOUSEOVER EFFECT

        document.querySelector(`.movie-${movieID} .movie-photo-div`).addEventListener('mouseover', function (event)
       {
          event.preventDefault()
          
          document.querySelector(`.movie-${movieID} .movie-photo-div`).innerHTML = `
          <p class="movie-title text-white text-xl text-center h-full zebra border-2">${movieDesc}</p>`
       })

       document.querySelector(`.movie-${movieID}`).addEventListener('mouseleave', function (event)
       {
          event.preventDefault()
            if(watchedButton.classList.contains("bg-yellow-200"))
            {
          
            document.querySelector(`.movie-${movieID} .movie-photo-div`).innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500/${moviePhoto}" class="movie-photo border-2 w-full opacity-20">`
            }
            else
            {
              document.querySelector(`.movie-${movieID} .movie-photo-div`).innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500/${moviePhoto}" class="movie-photo border-2 w-full">`
            }
       })


      // THIS AREA CONTROLS THE LIKE/DISLIKE BUTTONS
      let positiveButton = document.querySelector(`.movie-${movieID} .positive-button`)
      let negativeButton = document.querySelector(`.movie-${movieID} .negative-button`)
      let yourRatingDiv = document.querySelector(`.movie-${movieID} .your-rating`)
      let matchRatingDiv = document.querySelector(`.movie-${movieID} .match-rating`)
      positiveButton.addEventListener('click', async function(event)
      {
        event.preventDefault()

        if(positiveButton.classList.contains('opacity-20'))
        {
          yourRating = yourRating - 15
          yourRatingDiv.innerHTML = `Match: ${yourRating}%`
          positiveButton.classList.remove('opacity-20')
          negativeButton.classList.remove('opacity-20')
          await db.collection('watched').doc(`${movieID}`).set(
            {
              movieID: movieID,
              movieTitle: movieTitle,
              yourRating: yourRating
            }) 
        }
        else
        {
          yourRating = yourRating + 15
          yourRatingDiv.innerHTML = `Match: ${yourRating}%`
          positiveButton.classList.add('opacity-20')
          negativeButton.classList.remove('opacity-20') 
          matchRatingDiv.classList.add("transition", "ease-in-out","duration-300")
          
          await db.collection('watched').doc(`${movieID}`).set(
            {
              movieID: movieID,
              movieTitle: movieTitle,
              yourRating: yourRating
            })
        }
      })
      negativeButton.addEventListener('click', async function(event)
      {
        event.preventDefault()

        if (negativeButton.classList.contains('opacity-20'))
        {
          yourRating = Math.round((movieRating/10) * 100)
          yourRatingDiv.innerHTML = `Match: ${yourRating}%`
          negativeButton.classList.remove('opacity-20')
          positiveButton.classList.remove('opacity-20')
          await db.collection('watched').doc(`${movieID}`).set(
            {
              movieID: movieID,
              movieTitle: movieTitle,
              yourRating: yourRating
            })
        }
        else
        {
          yourRating = yourRating - 15
          yourRatingDiv.innerHTML = `Match: ${yourRating}%`
          negativeButton.classList.add('opacity-20')
          positiveButton.classList.remove('opacity-20')

          await db.collection('watched').doc(`${movieID}`).set(
            {
              movieID: movieID,
              movieTitle: movieTitle,
              yourRating: yourRating
            })
        }
      })

// THIS AREA CONTROLS THE WATCHED BUTTON


        watchedButton.addEventListener('click', async function(event) 
        {
            event.preventDefault()
          
            if(moviePhotoDiv.classList.contains("opacity-20"))
            {
              moviePhotoDiv.classList.remove("opacity-20")
              watchedButton.classList.remove('bg-yellow-200')
              watchedButton.classList.remove('text-black')
              watchedButton.classList.add('bg-blue-500')
              watchedButton.classList.add('text-white')
              watchedButton.innerHTML = `I've watched this`

              await db.collection('watched').doc(`${movieID}`).delete()
              
            }
            else
            {
              moviePhotoDiv.classList.add('opacity-20')
              watchedButton.classList.remove(`bg-blue-500`)
              watchedButton.classList.remove('text-white')
              watchedButton.classList.add('bg-yellow-200')
              watchedButton.classList.add(`text-black`)
              watchedButton.innerHTML = `I haven't watched this`
              await db.collection('watched').doc(`${movieID}`).set(
            {
              movieID: movieID,
              movieTitle: movieTitle,
              yourRating: yourRating
            })
            }
            
        })  

          
      
      // for(let t=0;t<movieGenre.length;t++)
      // {
      //   let genreOfThisMovie = movieGenre[t]
      //   let titleGenre = movieTitle + " "+ movieGenre
        
      //   if(titleGenre.includes(14))
      //   {
      //     movieGenreName = "Fantasy"
      //   }
      //   else if(titleGenre.includes(27))
      //   {
      //     movieGenreName = "Horror"
      //   }
      //   else if(titleGenre.includes(16))
      //   {
      //     movieGenreName = "Animated"
      //   }
      //   else if(titleGenre.includes(10751))
      //   {
      //     movieGenreName = "Family"
      //   }
      //   else if(titleGenre.includes(28))
      //   {
      //     movieGenreName = "Action"
      //   }
      
       
      
            
        
      // document.querySelector('.action-button').addEventListener('click', async function(event)
      // {
      //   event.preventDefault()
      //   for(let i = 0; i <movies.length; i++)
      //   {

      //       let movie = movies[i]
      //       let movieID = movie.id
      //       let moviePhoto = movie.poster_path
      //       let movieTitle = movie.title
      //       let movieRating = movie.vote_average
      //       let movieDesc = movie.overview
      //       let movieGenre = movie.genre_ids
      //       let moviesDiv = document.querySelector('.movies')
      //       let yourRating = Math.round((movieRating/10) * 100)


      //   // console.log(movieGenre)

      //   if(movieGenreName = "Action")
      //   {
      //           moviesDiv.insertAdjacentHTML('beforeend', `
      //         <div class="movie-${movieID} w-1/5 p-4">
      //             <img src="https://image.tmdb.org/t/p/w500/${moviePhoto}" class="movie-photo border-2 w-full">
      //             <p class="movie-title text-white text-xl text-center">${movieTitle}</p>
      //             <p class="movie-rating text-white text-xl text-center">Online Rating: ${movieRating}/10</p>
      //             <p class="your-rating text-green-500 text-xl text-center">Match: ${yourRating}%</p>
                  
      //               <a href="#" class="watched-button block text-center text-white bg-blue-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
      //               <div class="flex m-auto">
      //               <a href="#" class="positive-button block text-center text-3xl bg-green-500 mt-2 w-1/2 px-4 py-2 rounded">👍</a>
      //               <a href="#" class="negative-button block text-center text-3xl bg-red-500 mt-2 w-1/2 px-4 py-2 rounded">👎</a>
      //               </div>
      //         </div>`)
      //   }
      

        

      
    
      //   }
      // })
      // }

    
        

    
    // ⬆️ ⬆️ ⬆️ 
    // End Step 2
  
    // Step 3: 
    // - Attach an event listener to each "watched button"
    // - Be sure to prevent the default behavior of the button
    // - When the "watched button" is clicked, changed the opacity
    //   of the entire "movie" by using .classList.add('opacity-20')
    // - When done, refresh the page... does the opacity stick?
    // - Bonus challenge: add code to "un-watch" the movie by
    //   using .classList.contains('opacity-20') to check if 
    //   the movie is watched. Use .classList.remove('opacity-20')
    //   to remove the class if the element already contains it.
    // ⬇️ ⬇️ ⬇️

    
  
    // ⬆️ ⬆️ ⬆️ 
    // End Step 3
  
    // Step 4: 
    // - Properly configure Firebase and Firebase Cloud Firestore
    // - Inside your "watched button" event listener, you wrote in
    //   step 3, after successfully setting opacity, persist data
    //   for movies watched to Firebase.
    // - The data could be stored in a variety of ways, but the 
    //   easiest approach would be to use the TMDB movie ID as the
    //   document ID in a "watched" Firestore collection.
    // - Hint: you can use .set({}) to create a document with
    //   no data – in this case, the document doesn't need any data;
    //   if a TMDB movie ID is in the "watched" collection, the 
    //   movie has been watched, otherwise it hasn't.
    // - Modify the code you wrote in Step 2 to conditionally
    //   make the movie opaque if it's already watched in the 
    //   database.
    // - Hint: you can use if (document) with no comparison
    //   operator to test for the existence of an object.

    }  
})

