import React from "react";
import ReactDOMClient from "react-dom/client";
import App from "./App";

window.addEventListener("load", (event) => {
	const container = document.getElementById('root');
	const root = ReactDOMClient.createRoot(container);
	root.render(<App />);
});

