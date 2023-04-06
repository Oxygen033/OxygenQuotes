import React from 'react';
import { useState, useEffect, useRef } from "react"
import './css/App.css';
import QuoteItem from './QuoteItem';
import Navbar from './Navbar';

async function GetTags()
{
  let response = await (await fetch("https://api.quotable.io/tags")).json();
  let data = [];
  for(let i in response)
  {
    data.push([i, response[i]]);
  }
  let result:string[] = [];
  for(let j in data)
  {
    result.push(data[j][1].name);
  }
  return result;
}

interface Quote {
  content: string;
  author: string;
  tags: string[];
}

interface QuoteResponse {
  quotes: Quote[];
}

async function GetQuotes(tag?:string):Promise<QuoteResponse>
{
  let response;
  if(tag===undefined)
  {
    response = await fetch("https://api.quotable.io/quotes/random?limit=5");
  }
  else
  {
    response = await fetch("https://api.quotable.io/quotes/random?tags="+tag+"&limit=5");
  }
  const result:QuoteResponse = {quotes: await response.json()};
  return result;
}


function App() 
{
  const [TagList, setTagList] = useState<string[]>([]);
  const [TextsList, setTextsList] = useState<string[]>([]);
  const [AuthorsList, setAuthorsList] = useState<string[]>([]);
  const [LocalTagsList, setLocalTagsList] = useState<string[]>([]);
  const [FavoritesList, setFavoritesList] = useState<string[]>([]);
  const [CurrentTag, setCurrentTag] = useState<string>();
  const [QuotesList, setQuotesList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    GetTags().then(resp => {
      setTagList(Array.from(resp));
    });
  }, []);

  useEffect(() => {
    GetQuotes(CurrentTag).then(resp => {
      const texts = resp.quotes.map(res => res.content);
      const authors = resp.quotes.map(res => res.author);
      const tags = resp.quotes.map(res => res.tags.join());
      setTextsList(texts);
      setAuthorsList(authors);
      setLocalTagsList(tags);
    });
  }, [CurrentTag]);

  useEffect(() => {
    const favorites = localStorage.getItem("favorites");
    if (favorites) {
      setFavoritesList(JSON.parse(favorites));
    }
  }, []);

  const toggleFavorite = (id: string) => {
    if (!FavoritesList.includes(id)) //если id не в FavoritesList
    {
      const NewFavorites = FavoritesList.concat(id); //обновление массива избранного
      setFavoritesList(NewFavorites);
      localStorage.setItem("favorites", JSON.stringify(NewFavorites));
    } else 
    {
      const NewFavorites = FavoritesList.filter((item) => item !== id);
      setFavoritesList(NewFavorites);
      localStorage.setItem("favorites", JSON.stringify(NewFavorites));
    }
  };

  const setHomeTag = () => {
    setCurrentTag(undefined);
  };

  //С id, получаемыми из API не работает, уникальный id генерируется из текущего тэга и индекса
  useEffect(() => {
    setQuotesList(TextsList.map((text, index) => <QuoteItem id={`${CurrentTag}+${index}`} Quote={text} key={`${CurrentTag}+${index}`} Author={"- " + AuthorsList[index]} Tags={"Tags: " + LocalTagsList[index]} onToggleFavorite={toggleFavorite} isFavorite={FavoritesList.includes(`${CurrentTag}+${index}`)}/>));
  }, [TextsList, AuthorsList, FavoritesList]);

  const Tags = TagList.map(item => <a key={item} href="#" className='TagLink' onClick={() => setCurrentTag(item)}>{item}</a>);
  return (
    <div>
    <Navbar setTag={setHomeTag}/>
    <div className='content-container'>
      <div className='quotes-containter'>
        {QuotesList}
      </div>
      <div className='categories-containter'>
        {Tags}
      </div>
    </div>
    </div>
  );
}

export default App;