import './Header.css';
import moon from '../src/assets/images/moon-regular.svg';
import React from "react";



class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {mode: props.mode}
    }

    render() {
        return(
            <header>
                <div>
                    <h1>Where in the world</h1>
                    <div onClick={this.props.changeMode} id="select-mode">
                        <img src={moon} alt="moon"/>
                        {this.props.mode ? 'Dark Mode' : 'Light Mode'}
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;
