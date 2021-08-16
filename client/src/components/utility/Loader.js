import React from 'react';
import loader from '../../assets/svg/pac-load.svg';
import '../../styles/Util.css';

function Loader() {
    return (
        <section className="loader">
            <img src={loader} alt="loading animation"/>
            <p>Loading Sociedon...</p>
        </section>
    );
}

export default Loader;