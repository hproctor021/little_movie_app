const debounce = (func, delay = 1000) => {
    let timeoutId;
    return ( ...args ) => {
        if( timeoutId ){
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            func.apply(null, args)
            // .apply looks at given args if there is more than 1, it applies them individually
        }, delay)
    }
}
// this function is to monitor if the user is typing or not in the searach bar, 
// if typing, then will wait 1 second after no typing to run the autocomplete functions
// and populate the results