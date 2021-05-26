const createAutoComplete = ({ 
    //creates a reusable widget for input search and autocomplete
    root, 
    renderOption, 
    onOptionSelect, 
    inputValue,
    fetchData
 }) => {
    root.innerHTML = `
        <input class="input" placeholder="Search" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `
    //this allows us to remove some clutter in the html file and create this widget here instead

    const input = root.querySelector('input')
    const dropdown = root.querySelector('.dropdown')
    const resultsWrapper = root.querySelector('.results')


    const onInput = async e => {
        const items = await fetchData(e.target.value)
        
        if( !items.length ){
            dropdown.classList.remove('is-active')
            return
        }

        resultsWrapper.innerHTML = ''
        dropdown.classList.add('is-active')
        for( let item of items ){
            const option = document.createElement('a')

            option.classList.add('dropdown-item')
            option.innerHTML = renderOption(item)

            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active')
                input.value = inputValue(item)
                onOptionSelect(item)
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
}