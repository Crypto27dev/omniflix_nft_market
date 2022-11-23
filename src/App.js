import React, { useEffect } from 'react';
import './app.css';
import Router from './Router';
import Snackbar from './containers/Snackbar';

const App = () => {
    useEffect(() => {
        const element = document.getElementById('loader');
        element.remove();
    }, []);

    return (
        <div className="app nucleus_v2">
            <Router/>
            <Snackbar/>
        </div>
    );
};

export default App;
