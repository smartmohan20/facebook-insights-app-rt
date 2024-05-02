import { createContext, useContext, useState } from 'react';
let VariablesContext = undefined;

try {
  // Create a context for managing variables
  VariablesContext = createContext();
} catch (err) {
  console.error('Exception occurred in "createContext" method. Error: ', err);
}

// Custom hook to use the context in components
export const useVariables = () => {
  return useContext(VariablesContext);
};

// Context provider component to manage variables
export const VariablesProvider = ({ children }) => {
  // State to store variables
  const [variables, setVariables] = useState({});

  // Function to set a variable in the context
  const setVariable = (variableName, value) => {
    try {
      // Update the variables by setting a new key-value pair
      setVariables((prevVariables) => ({
        ...prevVariables,
        [variableName]: value,
      }));

      return true; // Indicate success
    } catch (err) {
      console.error('Exception occurred in "setVariable" method. Error: ', err);
    }
  };

  // Function to get a variable from the context
  const getVariable = (variableName) => {
    try {
      return variables[variableName]; // Return the value associated with the variableName
    } catch (err) {
      console.error('Exception occurred in "getVariable" method. Error: ', err);
      return undefined;
    }
  };

  // Function to clear a specific variable from the context
  const clearVariable = (variableName) => {
    try {
      setVariables((prevVariables) => {
        const updatedVariables = { ...prevVariables };
        delete updatedVariables[variableName]; // Remove the specified variable
        return updatedVariables;
      });

      return true; // Indicate success
    } catch (err) {
      console.error('Exception occurred in "clearVariable" method. Error: ', err);
      return {};
    }
  };

  // Function to get all variables stored in the context
  const getAllVariables = () => {
    try {
      return variables; // Return all variables
    } catch (err) {
      console.error('Exception occurred in "getAllVariables" method. Error: ', err);
      return {};
    }
  };

  // Function to clear all variables stored in the context
  const clearAllVariables = () => {
    try {
      setVariables({}); // Clear all variables
      return true; // Indicate success
    } catch (err) {
      console.error('Exception occurred in "clearAllVariables" method. Error: ', err);
    }
  };
  
  // Store the functions in the context's values
  const contextValues = {
    setVariable,
    getVariable,
    clearVariable,
    getAllVariables,
    clearAllVariables
  };

  // Provide the context values to the children components
  return (
    <VariablesContext.Provider value={contextValues}>
      {children}
    </VariablesContext.Provider>
  );
};
