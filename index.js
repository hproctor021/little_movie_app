const fetchData = async (searchTerm) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: '7b74a652',
            s: searchTerm
        }
    })
    console.log(response.data)
};


const input = document.querySelector('input')

const onInput = (e) => {
    fetchData(e.target.value)    
};

input.addEventListener('input', debounce(onInput, 750))
// add the callback function in as a second parameter rather than 
// writing out the function, so on input we call on the onInput fxn
