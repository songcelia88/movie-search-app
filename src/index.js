import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const API_KEY = process.env.REACT_APP_API_KEY;

//make this a functional component?
class Search extends React.Component {
    render(){
        return (
            <div className="col-sm-12" style={{textAlign: 'center'}}>
                <input className="form-control" type="text" id="keyword" name="keyword" 
                    placeholder="Keyword" style={{margin: 'auto',width: '50%',display:'inline'}}
                    onChange={ (event)=> this.props.onSubmitProp(event) }></input>
            </div>
        );
    }
}

//make this a functional component?
class MovieCard extends React.Component {
    render() {
        //truncate movie title if it's too long
        let movieTitle = this.props.movieTitle;
        if (movieTitle.length > 55){
            movieTitle = movieTitle.slice(0,40) + "...";
        }

        return (
            <div className="col-md-4 movieCard">
                <img src={this.props.imgUrl} alt={movieTitle}></img>
                <div className="cardDetails">
                    <p className="movieTitle"><strong>{movieTitle}</strong></p>
                    <p className="releaseDate">{this.props.releaseDate}</p>
                    <p className="reviews"><i className="fas fa-star"></i>{this.props.rating}/10 ({this.props.numRatings} reviews)</p>
                </div>
            </div>
        );
    }
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            results: [],
            currentPage: 1,
            totalPages: 0,
            totalResults: 0,
            baseUrl: "",
            imgSize: "w342"
        }
    }

    onSubmit(event,pageNum) {
        event.preventDefault();

        let url = new URL("https://api.themoviedb.org/3/search/movie");
        let query = document.getElementById('keyword').value;
        // if the field isn't blank make the api call, just a check to prevent errors when the field is blank
        if (query !== ""){ 
            let data = {
                'api_key': API_KEY,
                'language': 'en-US',
                'query': query,
                'page': pageNum,
                'include_adult': 'false'
            };
            //append the search params to the url so we can call fetch
            Object.keys(data).forEach(key => url.searchParams.append(key, data[key]));

            //fetch api call
            fetch(url, {
                method: "GET",
                dataType: 'JSON'
            })
            .then((resp)=>{
                return resp.json()
            })
            .then((results)=>{ //success function
                //limit total pages to 1000 since the api won't let you call past page 1000
                let totalPages = (results.total_pages > 1000) ? 1000 : results.total_pages

                this.setState({
                    query: query,
                    results: results.results,
                    totalPages: totalPages,
                    totalResults: results.total_results,
                    currentPage: pageNum
                })
            })
            .catch((error)=>{ //error function
                console.log("error was " + error)
            }) //end fetch call
        }
        else { // if the field is blank reset and clear the results
            this.setState({
                query: query,
                results: []
            })
        }

    }

    goToPrevPage(event) {
        const currentPage = this.state.currentPage;
        if (currentPage > 1){
            this.onSubmit(event,currentPage-1)    
        }
    }

    goToNextPage(event) {
        const currentPage = this.state.currentPage;
        if (currentPage < this.state.totalPages){
            this.onSubmit(event,currentPage+1)    
        }
    }

    componentDidMount() {
        //get the configuration in order to retrieve the image urls
        let url = "https://api.themoviedb.org/3/configuration?api_key=" + API_KEY;

        //fetch api call
        fetch(url, {
            method: "GET",
            dataType: 'JSON'
        })
        .then((resp)=>{
            return resp.json()
        })
        .then((data)=>{ //success function
            console.log('got configuration')
            this.setState({
                baseUrl: data.images.secure_base_url
            })  
        })
        .catch((error)=>{ //error function
            console.log("error was " + error)
        }) //end fetch call
    }


    render() {
        const results = this.state.results

        //generate movie cards list
        const cards = results.map( (movie)=>{
            let imgUrl
            // handle the case where there is no poster available
            if (movie.poster_path){
                imgUrl = this.state.baseUrl + this.state.imgSize + movie.poster_path
            }
            else {
                imgUrl = "../cat-poster.png"
            }
            
            return (
                <MovieCard movieTitle={movie.title} key={movie.id} 
                            imgUrl={imgUrl} rating={movie.vote_average} numRatings={movie.vote_count}
                            releaseDate={movie.release_date}>
                </MovieCard>
            )
        });

        //generate pagination links
        //TODO: refactor this part?
        const pageLinks = [];
        let className = "pageLink";
        const currentPage = this.state.currentPage;
        const totalPages = this.state.totalPages;
        let startPage = 1;
        
        // show all the page links if less than 14
        if (totalPages - currentPage <= 14){
            if (totalPages > 0 && totalPages > 14){ startPage = totalPages-14;}
            
            for (let i=startPage; i<=this.state.totalPages; i++){
                className = (i === currentPage) ? "pageLink active" : "pageLink";
                pageLinks.push(
                    <li className={className} key={i} onClick={ (event)=> {this.onSubmit(event,i)} }>
                        {i}
                    </li>
                )
            }
        }
        else{ //if the total pages is more than 14
            startPage = (currentPage <= 4) ? 1 : currentPage

            for (let i=startPage; i<=startPage+3; i++){
                className = (i === currentPage) ? "pageLink active" : "pageLink";
                pageLinks.push(
                    <li className={className} key={i} onClick={ (event)=> { this.onSubmit(event,i)} }>
                        {i}
                    </li>
                )
            }
            pageLinks.push(
                <li className={className} key="ellipsis">
                    ...
                </li>
            )
            for (let i=this.state.totalPages-4; i<=this.state.totalPages; i++){
                className = (i === currentPage) ? "pageLink active" : "pageLink";
                pageLinks.push(
                    <li className={className} key={i} onClick={ (event)=> { this.onSubmit(event,i)} }>
                        {i}
                    </li>
                )
            }
        }
        
        
        return (
            <div>
                <div className="row"> 
                    <div className="col-md-12" style={{textAlign:'center', marginTop: '20px'}}>
                        <h1>Movie Search App</h1>
                    </div>
                </div>
                <div className="row" style={{marginTop: '20px'}}>
                    <Search onSubmitProp={ (event)=>this.onSubmit(event,1) }></Search>
                </div>
                <div className="row">
                    <div className="col-sm-12" style={{textAlign:'center', marginTop: '20px'}}>
                        <ul style={{ display: 'inline', listStyle: 'none'}}>
                            <li className="pageLink" onClick={ (event)=> {this.goToPrevPage(event)} }>
                                <i className="fas fa-chevron-left"></i>
                            </li>
                            {pageLinks}
                            <li className="pageLink" onClick={ (event)=> {this.goToNextPage(event)} }>
                                <i className="fas fa-chevron-right"></i>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="row" style={{marginTop: '40px', textAlign:'center'}}>
                    {cards}
                </div>
                <div className="row" style={{marginTop: '40px', textAlign:'center'}}>
                    <div className="col-sm-12" style={{textAlign:'center', marginTop: '20px'}}>
                        <p>Images and Movie info taken from <a href="https://www.themoviedb.org/documentation/api">TMDB</a></p>
                    </div>
                </div>

            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

