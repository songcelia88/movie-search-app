## How to Run this Locally (in development mode):
After checking out the repository, run ```npm install``` to install the correct packages (this may take a while)

Create a .env file in the local folder
- Its only contents should be `REACT_APP_API_KEY = 'XX'`, where XX is the actual API key needed for the Movie DB API
- To get a API key, you should create an account on the [TMDB website](https://www.themoviedb.org/account/signup) and request an API key. It is free for developers to use. 

Run `npm start` to start the app locally (in development mode)
- This runs the app in the development mode.
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
- The page will reload if you make edits. You will also see any lint errors in the console.

## Background
I created a movie search app that uses the Movie DB API to query for movies by title. The user can type their query
in the search field and the results will appear below. For each movie result, the poster, movie title, ratings and 
release date is shown. The results are paginated. 
![screenshot1](/public/movieapp-screenshot1.png)

## My Experience Making the App
Most of the challenge of making this app was getting used to the React framework and thinking in React terms (i.e. states vs. props, how to architect a React app that has the right hierarchy of components, how to pass states down to children components, etc.) Up to now, my only other experience with React was going through the tutorial, so this was my first time creating a React app from scratch!

One of the challenges I encountered making the app was figuring out how to generate components dynamically. Basically, I made a Movie Card component that contains the details of the movie (title, poster image, etc.) and I wanted to generate a Movie Card component for each movie result that was retrieved from the API call. Luckily the tutorial had a very simple example that I used as a very rough guide for doing this. I mapped my results array (which is a list of movies that I got from the API) to another array called 'cards' where each element in the 'cards' array is a Movie Card component. Then I rendered the 'cards' array.  

I used a similar approach to implement pagination of the results. This was the part that actually took me a bit longer to get working properly, especially for a large number of results. I was able to generate the pagination links dynamically based on the total_pages parameter returned by the API. For each page link, I was able to get it so that clicking it would return the results for that query and that page. 

The tricky part was truncating that pagination link for very large number of results. Since the results are generated as the user types into the search box, the results will be very large in the beginning as the user starts typing their query. For instance, as the user is typing in "harry", the result set will be very large for 'h' and 'ha', but get smaller and smaller as the query gets more specific. Generating every single page link also slowed down the app a bit too, since for queries like 'h', there would be more than a thousand pages of results. So for large number of pages, I truncated the page links so that it would only show the page links for the current page plus the next few pages as well as the links for the very last few pages.
![screenshot2](/public/movieapp-screenshot2.png)

Another little hiccup I ran into when implementing pagination was that for page numbers past 1000, the API gives you an error: 'page must be less than or equal to 1000'. Basically when a user clicks on the page link for say page 5, my app sends an API request with the query and page number as parameters. The API actually won't let you request anything greater than 1000 for the page parameter. So on my app, I limit the max page number to be 1000 (even though there might be more results than that) to prevent the user from encountering this error.
    
### Other Little Things I Encountered
- Generating API calls are different in React. Before I had always been using JQuery AJAX calls for those requests. But I learned the JQuery and React don't really mix, so I used fetch instead.
- Some of the movie results didn't have movie posters, so I had to make a placeholder movie poster for those results
- Not all movie posters are the same size so I had to force the width and height for all img elements to be the same size so the movie cards would all look uniform (Side note: I noticed the movie posters from foreign countries were a different size. All the movie posters from American films seems to be a standard size.)
- Some movie titles were pretty long so I had handle truncating the titles so the movie cards would be uniform size

## Future Improvements
- Make the Search and Movie Card components functional components since all they do is render and they don't have any state associated with them.
- Refactor the code I wrote to generate the pagination links. It feels verbose and not super elegant. It works but uses some repeat code that could be taken out and be made into a function.
- Make arrow button to skip all the way to the first page of results and arrow to skip all the way to the last page of results
- Haven't really tested in on smaller sized screens, so I could improve that.
- Implement the optional feature: Allow a user to share a link to a specific search (similar to search engine results like Google). Not immediately sure how I'd implement this.

Making this took me way longer than I would have liked but there really is no better way to learn than to go in and just create something. I learned quite a bit (though there are still some things I'm not sure if I did correctly) and I'll be much quicker the next time I have to create a React app! :) 