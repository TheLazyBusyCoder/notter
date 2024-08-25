import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.js";
import { useContext } from "react";
import { React } from "react";
import { NoteContext, NoteProvider } from "./context/NoteContext.js";

function App() {
    return (
        <NoteProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </NoteProvider>
    );
}

export default App;
