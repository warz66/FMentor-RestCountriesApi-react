import './Country.css';
import React from "react";
import { Link } from "react-router-dom";

class Country extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            //a3c: this.props.match.params.a3c,
            isLoadedCountry: false,
            errorCountry: null,
            isLoadedCountriesBorder: false,
            country: null,
            countriesBorder: []
        }

        this.sortArray = this.sortArray.bind(this);
        this.country = this.country.bind(this);
    }

    sortArray(array, idxStr) {
        return array.map(array => array[idxStr]).join(', ');
    }

    consumeApi() {
        fetch('https://restcountries.eu/rest/v2/alpha/'+this.props.match.params.a3c)
          .then(res => res.json())
          .then((result) => { this.setState({ isLoadedCountry: true, country: result, isLoadedCountriesBorder: false}); this.country() }, (error) => { this.setState({ isLoadedCountry: true, errorCountry: error,  }); })
    }

    async country() {
        const countriesBorder = await this.countriesBorder();
        this.setState({ countriesBorder, isLoadedCountriesBorder: true });
    }

    async countriesBorder() {
        const promises = this.state.country.borders.map(async function(countryBorderA3C) {
            return await fetch(`https://restcountries.eu/rest/v2/alpha/${countryBorderA3C}?fields=name`).then(res => res.json())
                .then(result => { return {"name": result.name, "a3c": countryBorderA3C} }).catch(() => { return {"name": countryBorderA3C, "a3c": countryBorderA3C}});
        });
        return await Promise.all(promises);
    }

    componentDidUpdate(prevProps) {
        if(this.props.match.params.a3c !== prevProps.match.params.a3c) {
            this.setState({ isLoadedCountry: false });
            this.consumeApi();
        }
    }

    componentDidMount() {
        this.consumeApi();
    }

    render() {
        let countryElement;
        const { errorCountry, isLoadedCountry, country } = this.state;
        if(errorCountry) {
            countryElement = 
                <div className="error">
                    <p>{errorCountry.message}</p>
                </div>
        } else if (!isLoadedCountry) {
            countryElement = <div className="loading">Loading...</div>
        } else {
            let countriesBorderElement;
            const { isLoadedCountriesBorder, countriesBorder } = this.state;
            if(!isLoadedCountriesBorder) {
                countriesBorderElement = 
                    <div>Loading...</div>
            } else if(countriesBorder.length) {    
                countriesBorderElement = 
                    countriesBorder.map( countryBorder => {
                        return <Link to={"/Country/"+countryBorder.a3c} key={countryBorder.name} className="button-border-country">{countryBorder.name}</Link>
                    })
            } else {
                countriesBorderElement = 
                    <p>No neighbor bordering on this country.</p>
            }

            countryElement = 
                <div id="country">
                    <div id="country-img">
                        <img src={country.flag} alt={country.name+' flag'}/>
                    </div>
                    <div id="country-panel">
                        <h2>{country.name}</h2>
                        <div id="country-panel-info">
                            <div>
                                <p><span className="semi-bold">Native Name: </span>{country.nativeName}</p>
                                <p><span className="semi-bold">Population: </span>{country.population.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</p>
                                <p><span className="semi-bold">Region: </span>{country.region}</p>
                                <p><span className="semi-bold">Sub Region: </span>{country.subregion}</p>
                                <p><span className="semi-bold">Capital: </span>{country.capital}</p>
                            </div>
                            <div>
                                <p><span className="semi-bold">Top Level Domain: </span>{country.topLevelDomain[0]}</p>
                                <p><span className="semi-bold">Currencies: </span>{this.sortArray(country.currencies,'name')}</p>
                                <p><span className="semi-bold">Languages: </span>{this.sortArray(country.languages,'name')}</p>
                            </div>
                        </div>
                        <div id="countries-border">
                            <p><span className="semi-bold">Border Countries: </span></p>
                            {countriesBorderElement}
                        </div>
                    </div>
                </div>
        }
        return (
            <section id="country-view">
                <Link to={"/"} id="button-back">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fillRule="evenodd" d="M12.182 3.697l-1.06 1.06 3.5 3.5H1.256v1.485h13.364l-3.5 3.5 1.061 1.061L17.485 9l-5.303-5.303z" transform="matrix(-1 0 0 1 18 0)"></path></svg>
                    Back
                </Link>

                {countryElement}
            </section>
        );
    }
}

export default Country;