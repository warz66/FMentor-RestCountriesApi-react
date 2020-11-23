import './CountryBox.css';
import React from "react";



class CountryBox extends React.Component {

    render() {
        return(
            <div className="country-box" style={{display: this.props.show ? '' : 'none'}}>
                <img src={this.props.country.flag} alt={this.props.country.name+' flag'}/>
                <div className="country-box-info">
                    <h2>{this.props.country.name}</h2>
                    <p><span className="semi-bold">Population: </span>{this.props.country.population.toString().replace(/\d{1,3}(?=(\d{3})+(?!\d))/g , "$&,")}</p>
                    <p><span className="semi-bold">Region: </span>{this.props.country.region}</p>
                    <p><span className="semi-bold">Capital: </span>{this.props.country.capital}</p>
                 </div>
            </div>
        );
    }
}

export default CountryBox;
