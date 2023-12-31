import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { User, emptyUser } from "./classes/User";
import LoggedOut from "./pages/LoggedOut";
import TAManagement from "./pages/TAManagement";
import ManageTAs from "./components/professor/AllTAReport";

interface UserProviderProps {
  user: User;
  setUser: Function;
}

export const UserContext = React.createContext<UserProviderProps>({ user: emptyUser, setUser: () => { } });

const App = () => {
  const [user, setUser] = React.useState<User>(emptyUser);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tamanagement" element={<TAManagement />} />
          <Route path="/allTAReport" element={<ManageTAs />} />
          <Route path="/logout" element={<LoggedOut />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
};
export default App;
