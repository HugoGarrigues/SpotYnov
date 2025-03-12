import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Callback from "./pages/Callback.tsx"; 
import JoinGroup from "./pages/JoinGroup.tsx";
import Group from "./pages/Group.tsx";
import GroupDetails from "./pages/GroupDetails.tsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/callback" element={<Callback />} /> 
      <Route path="/join-group" element={<JoinGroup />} />
      <Route path="/group" element={<Group />} />
      <Route path="/group/:groupName" element={<GroupDetails />} />
    </Routes>
  );
}

export default App;