// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MaterialTableADDFormDataList from "./components/Home/AllFormsList";
import MaterialTableFormData from "../src/components/Home/Index";
import Navbar from "../src/components/Home/Navbar";
import EIndex from "../src/components/Employee/Index";
import AddFormData from "../src/components/Employee/AddFormData";
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  return (
    <Router>
      <Navbar /> {/* Navigation Bar */}
      <Routes>
        <Route path="/" element={<MaterialTableFormData />} />
        <Route path="/AddFormDataList" element={<MaterialTableADDFormDataList />} /> 
        <Route path="/employee/index/:id" element={<EIndex />} />
        <Route path="/employee/addFormData/:id" element={<AddFormData />} />
        
      </Routes>
    </Router>
  );
}

export default App;
