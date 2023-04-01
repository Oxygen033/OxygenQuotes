import React, { useState } from 'react';
import "./css/quoteitem.css"

interface QuoteItemProps
{
    Quote:string;
    Author:string;
    Tags:string;
}

function QuoteItem({Quote, Author, Tags} : QuoteItemProps)
{
    const [text, SetText] = useState(' ');
    const [author, SetAuthor] = useState(' ');
    return(
            <div className='quote-container'>
                <p>{Quote}</p>
                <b>{Author}</b>
                <p className='taglist'>{Tags}</p>
            </div>
    );
}

export default QuoteItem;