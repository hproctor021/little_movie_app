const createAutoComplete = ({ root }) => {
    root.innerHTML = `
        <label><b>Search For a Movie</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `

    const input = root.querySelector('input')
    const dropdown = root.querySelector('.dropdown')
    const resultsWrapper = root.querySelector('.results')


    const onInput = async e => {
        const movies = await fetchData(e.target.value)
        
        if( !movies.length ){
            dropdown.classList.remove('is-active')
            return
        }

        resultsWrapper.innerHTML = ''
        dropdown.classList.add('is-active')
        for( let movie of movies ){
            const option = document.createElement('a')
            const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster

            option.classList.add('dropdown-item')
            option.innerHTML = `
                <img src="${imgSrc}" />
                ${movie.Title}
            `
            // use backticks when creating a multi-line string

            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active')
                input.value = movie.Title
                onMovieSelect(movie)
            })

            resultsWrapper.appendChild(option)
        }
    };

    input.addEventListener('input', debounce(onInput, 750))
    // add the callback function in as a second parameter rather than 
    // writing out the function, so on input we call on the onInput fxn

    document.addEventListener('click', e => {
        if( !root.contains(e.target) ){
            dropdown.classList.remove('is-active')
        }
    })

    const onMovieSelect = async movie => {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: '7b74a652',
                i: movie.imdbID
            }
        })
        document.querySelector('#summary').innerHTML = movieTemplate(response.data)
    }
}