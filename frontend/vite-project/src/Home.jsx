// import React, { useState } from 'react';

// function Home() {

//     const savedQuotes = [{ id: 1, quote: 'saved quote 1', author: 'author 1' },
//     { id: 2, quote: 'saved quote 1', author: 'author 1' },
//     { id: 3, quote: 'saved quote 1', author: 'author 1' },
//     { id: 4, quote: 'saved quote 1', author: 'author 1' },
//     { id: 5, quote: 'saved quote 1', author: 'author 1' },
//     { id: 6, quote: 'saved quote 1', author: 'author 1' },
//     { id: 7, quote: 'saved quote 1', author: 'author 1' },
//     { id: 8, quote: 'saved quote 1', author: 'author 1' },
//     { id: 9, quote: 'saved quote 1', author: 'author 1' }

//     ]

//     const [currentPage, setCurrentPage] = useState(1);
//     const quotesPerPage = 6;

//     const totalPages = Math.ceil(savedQuotes.length / quotesPerPage);
//     const startIndex = (currentPage - 1) * quotesPerPage;
//     const currentQuotes = savedQuotes.slice(startIndex, startIndex + quotesPerPage);

//     const handleNextPage = () => {
//         if (currentPage < totalPages) {
//             setCurrentPage(currentPage + 1)
//         }
//     };

//     const handlePreviousPage = () => {
//         if (currentPage > 1) {
//             setCurrentPage(currentPage - 1);
//         }
//     }

//     return (
//         <div className="container">
//             <div className="card">
//                 <p className="quoteText">"This is a sample quote"</p>
//                 <p className="authorText">sample person</p>
//             </div>

//             <div className="buttonContainer">
//                 <button className="button"> Save Quote</button>
//                 <button className="button" onClick={fetchRandomQuote}>Get Quote</button>
//             </div>

//             <div className="savedQuotes">
//                 {currentQuotes.map((quote) => (
//                     <div key={quote.id} className="savedQuoteCards">
//                         <p>{quote.quote}</p>
//                         <p><strong>{quote.author}</strong></p>
//                     </div>
//                 ))}
//             </div>
//             {/* pagination */}

//             <div className="paginationContainer">
//                 <button
//                     className="paginationButton"
//                     onClick={handlePreviousPage}
//                     disabled={currentPage === 1}
//                 >
//                     Previous
//                 </button>
//                 <span className="paginationInfo">
//                     Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                     className="paginationButton"
//                     onClick={handleNextPage}
//                     disabled={currentPage === totalPages}
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     )
// }
// export default Home

///
import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
    const [randomQuote, setRandomQuote] = useState({ quote: "", author: "" });
    const [savedQuotes, setSavedQuotes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const quotesPerPage = 6;

    // Fetch Random Quote
    const fetchRandomQuote = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/quote");
            setRandomQuote(response.data);
        } catch (err) {
            console.error("Error fetching random quote:", err);
        }
    };

    // Save the current quote to the database
    const saveQuote = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/quotes", {
                quote: randomQuote.quote,
                author: randomQuote.author,
            });
            console.log(response.data.message);
            fetchSavedQuotes(); // Refresh saved quotes after saving
        } catch (err) {
            console.error("Error saving quote:", err);
        }
    };

    // Fetch Saved Quotes
    const fetchSavedQuotes = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/quotes");
            setSavedQuotes(response.data);
        } catch (err) {
            console.error("Error fetching saved quotes:", err);
        }
    };

    useEffect(() => {
        fetchSavedQuotes();
    }, []);

    // Pagination Logic
    const totalPages = Math.ceil(savedQuotes.length / quotesPerPage);
    const startIndex = (currentPage - 1) * quotesPerPage;
    const currentQuotes = savedQuotes.slice(startIndex, startIndex + quotesPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="container">
            {/* Random Quote Card */}
            <div className="card">
                <p className="quoteText">"{randomQuote.quote}"</p>
                <p className="authorText">{randomQuote.author}</p>
            </div>

            {/* Buttons for Fetching and Saving Quote */}
            <div className="buttonContainer">
                <button className="button" onClick={fetchRandomQuote}>
                    Get Quote
                </button>
                <button className="button" onClick={saveQuote}>
                    Save Quote
                </button>
            </div>

            {/* Saved Quotes Section */}
            <div className="savedQuotes">
                {currentQuotes.map((quote) => (
                    <div key={quote._id} className="savedQuoteCards">
                        <p>{quote.quote}</p>
                        <p><strong>{quote.author}</strong></p>
                    </div>
                ))}
            </div>

            {/* Pagination Controls */}
            <div className="paginationContainer">
                <button
                    className="paginationButton"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="paginationInfo">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    className="paginationButton"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Home;
