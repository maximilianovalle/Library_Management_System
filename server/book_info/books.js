const pool = require('../database.js');
module.exports = async function getBooks(req, res){
    // try {
    //     const search_by = searchParams.get("search_by");
    //     const search_value = searchParams.get("search_value");
    //     const allowedFields = ['ISBN', 'Book_Condition', 'Book_Status'];
    //     let params = []
    //     const fieldMap = {
    //         model: "bc.ISBN",
    //         book_condition: "bc.Book_Condition",
    //         book_status: "bc.Book_Status"
    //     };
        // let query = `
        //     SELECT b.Title, b.Genre, b.ISBN, b.Publication_Year
        //     FROM book b
        //     JOIN book_copies bc ON b.ISBN = bc.ISBN
        //     WHERE bc.Book_Status = 'Available'`     
        
        // const [rows] = pool.query(query)
        // console.log(rows)

    // } catch (error) {

    // }
}