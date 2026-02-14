import React from "react";
import { Link } from "react-router-dom";

function Pagenotfound() {
    return (
        <div>
            <h1>Page not found</h1>
            <p>
                Try this Link <Link to="/">Homepage</Link>
            </p>
        </div>
    );
}

export default Pagenotfound;
