import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Home from "./pages/home";

//page paiement
import Payment from "./pages/payment";

// pages Events
import Events from "./pages/events";
import Event from "./pages/event";
import CreateEvent from "./pages/createEvent";

// pages registrations
import MyRegistrations from "./pages/myRegistrations";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="create-event" element={<CreateEvent />} />
          <Route path="events/:id" element={<Event />} />
          <Route path="my-registrations" element={<MyRegistrations />} />

          {/* Page de paiement */}
          <Route path="payment" element={<Payment />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
