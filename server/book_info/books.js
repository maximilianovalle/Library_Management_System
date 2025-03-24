const pool = require('../database.js');

module.exports = async function getBookInfo(req, res, userID){
    let body = '';
    req.on('data', (chunk) => { // listens for incoming data
    body += chunk;  // adds data chunk to body
    })
    console.log(body)    
    // console.log(req)
     try {
        const {search_value, search_by} = JSON.parse(body);
        if(search_by === 'Title'){
            const[[Title], [Genre], [ISBN], [Year], [Author], [Image]] = await Promise.all([
                pool.query('SELECT B.Title, B.Genre, B.ISBN, B.Year, B.Author, B.Image FROM book as B WHERE B.Title LIKE search_value')
            ])
      
        }
     } catch(error){

     }
}