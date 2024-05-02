import './App.css';
import User from './user/User';
import { VariablesProvider as GlobalVariablesProvider } from './global-variables/GlobalVariablesContext';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <GlobalVariablesProvider>
          <User />
        </GlobalVariablesProvider>
      </header>
    </div>
  );
}

export default App;
