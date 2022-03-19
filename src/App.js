import Signup from './components/Signup';
import URLform from './components/URLform';
import Signin from './components/Signin'
import {Route,Routes, BrowserRouter as Router} from 'react-router-dom';
function App() {
  return (

    <Router>
      <Routes>
       <Route path="/" element={<Signin />} />
       <Route path="/URLform/:username" exact element={<URLform/>}/>
       <Route path="/Signin" exact element={<Signin/>}/>
       <Route path="/Signup" exact element={<Signup/>}/>
      </Routes>
    </Router>
  );
}

export default App;