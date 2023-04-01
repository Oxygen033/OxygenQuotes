import React from 'react';
import { useState, useEffect, useRef } from "react"
import './App.css';
import QuoteItem from './components/QuoteItem';
import { type } from 'os';

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

async function GetQuotes(tag?:string):Promise<[string[], string[], string[]]>
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
  const jsonArray = await response.json();
  let resultContents:string[] = [];
  let resultAuthors:string[] = [];
  let resultTags:string[] =[];
  jsonArray.forEach((obj:any) => {
    if ("content" in obj && typeof obj.content === "string") 
    {
      resultContents.push(obj.content);
    }
    if ("author" in obj && typeof obj.author === "string") 
    {
      resultAuthors.push(obj.author);
    }
    if ("tags" in obj)
    {
      resultTags.push(obj.tags.join());
    }
  });
  console.log("запрос пошёл...");
  console.log("массивы внутри функции: " + resultContents + resultAuthors);
  console.log("Массив тэгов: " + resultTags + " тип: " + typeof resultTags);
  console.log("ссыль запроса: " + "https://api.quotable.io/quotes/random?tags="+{tag}+"&limit=5");
  return [resultContents, resultAuthors, resultTags];
}

function App() 
{
  const [TagList, setTagList] = useState<string[]>([]);
  const [TextsList, setTextsList] = useState<string[]>([]);
  const [AuthorsList, setAuthorsList] = useState<string[]>([]);
  const [LocalTagsList, setLocalTagsList] = useState<string[]>([]);
  const [CurrentTag, setCurrentTag] = useState<string>();
  const [QuotesList, setQuotesList] = useState<JSX.Element[]>([]);
  useEffect(() => {
    GetTags().then(resp => {
      setTagList(Array.from(resp));
    });
  }, []);
  useEffect(() => {
    GetQuotes(CurrentTag).then(resp => {
      console.log("хук выполнен с тэгом " + CurrentTag)
      console.log("resp: " + resp[0] + resp[1]);
      setTextsList(resp[0]);
      console.log("текст лист: " + TextsList);
      setAuthorsList(resp[1]);
      console.log("автор лист " + AuthorsList);
      setLocalTagsList(resp[2]);
    });
  }, [CurrentTag]);
  
  useEffect(() => {
    setQuotesList(TextsList.map((text, index) => <QuoteItem Quote={text} key={index} Author={"- " + AuthorsList[index]} Tags='e'/>));
  }, [TextsList, AuthorsList]);

  const Tags = TagList.map(item => <a key={item} href="#" className='TagLink' onClick={() => setCurrentTag(item)}>{item}</a>);
  return (
    <div className='content-container'>
      <div className='quotes-containter'>
        {QuotesList}
        <a href="#" onClick={() => console.log(CurrentTag)}>bebroed</a>
      </div>
      <div className='categories-containter'>
        {Tags}
      </div>
    </div>
  );
}

export default App;