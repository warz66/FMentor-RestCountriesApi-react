import './Home.css';
import React from "react";
import CountryBox from 'components/countryBox/CountryBox';

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            openSelect: false,
            error: null,
            isLoaded: false,
            countries: [],
            region: 'Filter by Region',
            search: ''
        }

        this.searchChange = this.searchChange.bind(this);
        this.openSelect = this.openSelect.bind(this);
        this.filter = this.filter.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    
    searchChange(event) {
        this.setState({search: event.target.value});
    }

    openSelect() {
        this.setState({openSelect: !this.state.openSelect}); 
    }

    regionChange(region) {
        this.setState({region: region});
        this.openSelect();     
    }

    filter(country) {
        return ((country.region === this.state.region || this.state.region === 'Filter by Region') && country.name.toLowerCase().includes(this.state.search.toLowerCase()));
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.setState({openSelect: false});
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);

        fetch('https://restcountries.com/v2/all')
          .then(res => res.json())
          .then((result) => { console.log(result); this.setState({ isLoaded: true, countries: result});}, (error) => { this.setState({ isLoaded: true, error }); })   
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    render() {
        let countriesSection;
        const { error, isLoaded, countries } = this.state;
        if(error) {
            countriesSection = 
                <div className="error">
                    <p>{error.message}</p>
                </div>
        } else if (!isLoaded) {
            countriesSection = <div className="loading">Loading...</div>
        } else {
            countriesSection = 
            <section id="countries">
                <div id="countries-box">
                    {countries.map( country => {
                                return <CountryBox country={country} key={country.name} show={this.filter(country)}/> 
                    })}
                </div>
            </section>
        }
        return(
            <div>
                <div id="search-filter-panel">
                    <div id="search-country-wrapper">
                        <input type="text" value={this.state.search} onChange={this.searchChange} aria-label="Allows you to search for a country" placeholder="Search for a country..."/>
                    </div>

                    <div id="select-region-wrapper" ref={this.setWrapperRef}>
                        <div id="select-region-btn" onClick={this.openSelect}>
                            {this.state.region}
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><g><path fill="none" fillRule="evenodd" stroke="none" d="M0 0h12v12H0V0z"></path><g transform="translate(1.5 3.75)"><path fillRule="evenodd" stroke="none" d="M7.95 0L4.5 3.45 1.05 0 0 1.05l4.5 4.5L9 1.05 7.95 0z" transform="translate(0 -.3)"></path></g></g></svg>
                        </div>
                        <div id="select-region-nav" className={this.state.openSelect ? 'isOpenSelect' : 'isCloseSelect'}>
                            <ul>
                                <li onClick={()=>this.regionChange('Filter by Region')}>All</li>
                                <li onClick={()=>this.regionChange('Africa')}>Africa</li>
                                <li onClick={()=>this.regionChange('Americas')}>Americas</li>
                                <li onClick={()=>this.regionChange('Asia')}>Asia</li>
                                <li onClick={()=>this.regionChange('Europe')}>Europe</li>
                                <li onClick={()=>this.regionChange('Oceania')}>Oceania</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                {/*{(this.state.error && 
                    <div className="error">
                        <p>{error.message}</p>
                    </div>) ||
                (!this.state.isLoaded &&
                    <div>Loading...</div>) || 
                    <div id="countries-box">
                        {countries.map( country => {
                            return <CountryBox country={country} key={country.name}/> 
                        })}
                    </div>}*/}
                {/*{this.state.isLoaded && <div id="countries-box">
                    {this.state.countries.map(country=>{
                        return <CountryBox country={country} key={country.name}/> 
                    })}
                </div>}*/}

                {countriesSection}
                
            </div>
        );
    }
}

export default Home;