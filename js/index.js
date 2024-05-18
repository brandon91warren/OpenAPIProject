document.addEventListener("DOMContentLoaded", () => {
    const publicKey = '204578c7a6be085e15011fe52fb46dc8'; // Your Marvel API public key
    const privateKey = 'bc4395f65faf5116558d93e9ec9acb652056d02d'; // Your Marvel API private key
    const ts = new Date().getTime();
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

    const charactersLink = document.getElementById('nav-characters');
    const comicsLink = document.getElementById('nav-comics');
    const contentList = document.getElementById('content-list');

    function fetchAllData(endpoint, callback) {
        const limit = 100; // Maximum limit per request
        let offset = 0;
        let allItems = [];

        function fetchData() {
            const apiUrl = `https://gateway.marvel.com:443/v1/public/${endpoint}?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`;
            console.log(`API URL: ${apiUrl}`);

            return fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Request failed');
                    }
                    return response.json();
                })
                .then(data => {
                    const items = data.data.results;
                    allItems = allItems.concat(items);

                    if (data.data.total > offset + limit) {
                        // More data to fetch
                        offset += limit;
                        return fetchData();
                    } else {
                        return allItems;
                    }
                });
        }

        fetchData()
            .then(items => {
                console.log('All data fetched successfully:', items);
                // Clear the current content
                contentList.innerHTML = '';

                // Display fetched data
                items.forEach(item => {
                    const listItem = document.createElement("li");
                    const link = document.createElement("a");
                    link.textContent = item.name || item.title;
                    link.href = "#";
                    link.addEventListener('click', (event) => {
                        event.preventDefault();
                        callback(item);
                    });
                    listItem.appendChild(link);
                    contentList.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Error fetching data from Marvel API:', error);
            });
    }

    function fetchCharacterComics(character) {
        const characterId = character.id;
        const apiUrl = `https://gateway.marvel.com:443/v1/public/characters/${characterId}/comics?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
        console.log(`Fetching comics for character ID: ${characterId}`);

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Request failed');
                }
                return response.json();
            })
            .then(data => {
                console.log('Comics data fetched successfully:', data);
                const comics = data.data.results;

                // Clear the current content
                contentList.innerHTML = '';

                // Display fetched comics data
                comics.forEach(comic => {
                    const listItem = document.createElement("li");
                    listItem.textContent = comic.title;
                    contentList.appendChild(listItem);
                });
            })
            .catch(error => {
                console.error('Error fetching comics data from Marvel API:', error);
            });
    }

    charactersLink.addEventListener('click', () => {
        fetchAllData('characters', fetchCharacterComics);
    });

    comicsLink.addEventListener('click', () => {
        fetchAllData('comics', () => {});
    });

    // Initial fetch to display characters
    fetchAllData('characters', fetchCharacterComics);
});
