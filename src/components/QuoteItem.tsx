import React, { useState, useEffect } from 'react';
import "./css/quoteitem.css"

interface QuoteItemProps
{
    id:string;
    Quote:string;
    Author:string;
    Tags:string;
    onToggleFavorite: (id: string) => void;
    isFavorite: boolean;
}

function QuoteItem({id, Quote, Author, Tags, onToggleFavorite, isFavorite} : QuoteItemProps)
{
    const [IsFavorite, setIsFavorite] = useState<boolean>(localStorage.getItem(id)==='true');
    const ToggleFavorite = () => {
        setIsFavorite(!IsFavorite);
        onToggleFavorite(id);
    };

    useEffect(() => {
        if (IsFavorite) {
        localStorage.setItem(id, 'true');
        } else {
        localStorage.removeItem(id);
        }
        }, [IsFavorite]);
    return(
            <div className='quote-container'>
                <div>
                    <p>{Quote}</p>
                    <b className='author'>{Author}</b>
                    <p className='taglist'>{Tags}</p>
                </div>
                <div className='likebutton-container'>
                    <button className={`likebutton ${IsFavorite ? 'active' : ''}`} onClick={ToggleFavorite}>
                        <i className="material-symbols-outlined">favorite</i>
                    </button>
                </div>
            </div>
    );
}

export default QuoteItem;