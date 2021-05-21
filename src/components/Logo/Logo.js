import React from 'react';
import classes from './Logo.css';
import BurgerLogo from '../../assets/images/28.1 burger-logo.png.png';

const logo = (props) => {
    return (
        <div className={classes.Logo}>
            <img src={BurgerLogo} alt="My Burger" />
        </div>

    )
};

export default logo;
