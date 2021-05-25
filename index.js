const autocompleteConfig = {
    // this function is for rendering the autocomplete options in the drop down menu below search bar
    renderOption(movie){
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
        return `
        <img src="${imgSrc}" />
        ${movie.Title} (${movie.Year})
    `
    // use backticks when creating a multi-line string to return
    },

    inputValue(movie){
        return movie.Title
    },

    async fetchData(searchTerm){
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '7b74a652',
                s: searchTerm
            }
        })
    
        if( response.data.Error ){
            return []
        }
        // if there are no results, (no match found) return an empty array, to display nothing in the results menu
        return response.data.Search
    }
}


createAutoComplete({
    ...autocompleteConfig,
    // by using ... everything in the autocompleteConfig fxn will be copied
    // and placed into this fxn
    root: document.querySelector('#left-autocomplete'),

    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
        // add second argument to let it know where to put the info
    }
})
createAutoComplete({
    ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),

    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
    }
})

let leftMovie;
let rightMovie;
const onMovieSelect = async (movie, summaryElement, side) => {
    // once a movie is clicked on, we get the movie and display its info on the correct side
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '7b74a652',
            i: movie.imdbID
        }
    })
    summaryElement.innerHTML = movieTemplate(response.data)
    // send the response from our get request to the movieTemplate fxn

    if( side === 'left' ){
        leftMovie = response.data
    } else {
        rightMovie = response.data
    }
    

    const runComparison = () => {
        leftSideStats = document.querySelectorAll('#left-summary .notification')
        rightSideStats = document.querySelectorAll('#right-summary .notification')

        leftSideStats.forEach((leftStat, index) => {
            const rightStat = rightSideStats[index]

            const leftSideValue = leftStat.dataset.value
            const rightSideValue = rightStat.dataset.value
            // in the JSX below we used data-value, so that's how we will access it

            if(rightSideValue > leftSideValue ){
                leftStat.classList.remove('is-primary')
                leftStat.classList.add('is-warning')
            } else {
                rightStat.classList.remove('is-primary')
                rightStat.classList.add('is-warning')
            }
            // this portion determines if the block should be green or yellow based on comparison values of each movie
        })
    }

    if( leftMovie && rightMovie ){
        runComparison()
        //run comparison fxn once both movies have been selected
    }

}

const movieTemplate = (movieDetail) => {

    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''))
    const metascore = parseInt(movieDetail.Metascore)
    const imdbRating = parseFloat(movieDetail.imdbRating)
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''))
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
    const value = parseInt(word)

        if( isNaN(value) ){
            return prev
            // if the value we are currently looking at is NOT a number, do nothing with it & keep looking for numbers
        } else {
            return prev + value
            // if it is a number add it to our tracker
        }

    }, 0)
    // passing 0 as a second argument will be a place to keep count, referenced at prev above


    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `
}
