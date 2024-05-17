document.addEventListener("DOMContentLoaded", () => {
    const publicKey = '204578c7a6be085e15011fe52fb46dc8'; // Your Marvel API public key
    const privateKey = 'bc4395f65faf5116558d93e9ec9acb652056d02d'; // Your Marvel API private key
    const ts = new Date().getTime();
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

    // Log timestamp, hash, and API URL for debugging
    console.log(`Timestamp: ${ts}`);
    console.log(`Hash: ${hash}`);
    const apiUrl = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
    console.log(`API URL: ${apiUrl}`);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data fetched successfully:', data); // Log the data
            const characters = data.data.results;
            const charactersList = document.getElementById("characters");
            
            characters.forEach(character => {
                const listItem = document.createElement("li");
                listItem.textContent = character.name;
                charactersList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching data from Marvel API:', error); // Log any errors
        });
});
