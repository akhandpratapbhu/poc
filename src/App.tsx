
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MaterialTableADDFormDataList from "./components/Home/AllFormsList";
import MaterialTableFormData from "../src/components/Home/Index";
import Navbar from "../src/components/Home/Navbar";
import EIndex from "../src/components/Employee/Index";
import AddFormData from "../src/components/Employee/AddFormData";
import "bootstrap/dist/css/bootstrap.min.css";
import SparePartSaleInvoiceTable from './components/Home/griddata'
import Sidebar from './components/Home/sidebar/sidebar'
import VerticalLinearStepper from './components/Home/getform'
function App() {
  return (
    <Router>
      <div className="container-fluid">
        <div className="row">
          {/* Full-width Navbar */}
          <div className="col-12" style={{ backgroundColor: " #212529" }}>
            <Navbar />
          </div>
        </div>

        <div className="row" style={{ height: "calc(100vh - 60px)" }}>
          {/* Sidebar on left */}
          <div className="col-2 p-0" style={{ backgroundColor: "grey" }}>
            <Sidebar />
          </div>

          {/* Main content on right */}
          <div className="col-10 p-3" style={{ overflowY: "auto", backgroundColor: "#f8f9fa" }}>
            <Routes>
              <Route path="/" element={<MaterialTableFormData />} />
              <Route path="/AddFormDataList" element={<MaterialTableADDFormDataList />} />
              <Route path="/employee/index/:id" element={<EIndex />} />
              <Route path="/employee/addFormData/:id" element={<AddFormData />} />
              <Route path="/allparts" element={<SparePartSaleInvoiceTable />} />
              <Route
                path= '/get-spare-sale-invoice-form'
              element={<VerticalLinearStepper />}/> ,
              
            </Routes>
          </div>
        </div>
      </div>
    </Router>

  );
}

export default App;
