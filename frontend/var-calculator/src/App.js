import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [returns, setReturns] = useState(['']);  // Start with one input field
    const [weights, setWeights] = useState(['']);  // Start with one input field
    const [method, setMethod] = useState('historical');
    const [confidenceLevel, setConfidenceLevel] = useState(0.95);
    const [varResult, setVarResult] = useState(null);

    const handleAddField = (setter) => {
        setter(prev => [...prev, '']);  // Add a new empty string to the array
    };

    const handleChange = (index, value, setter) => {
        const updatedArray = [...(setter === setReturns ? returns : weights)];
        updatedArray[index] = value;
        setter(updatedArray);
    };

    const handleCalculateVar = async () => {
        const returnsArray = returns.map(Number);
        const weightsArray = weights.map(Number);

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/calculate_var/', {
                returns: returnsArray,
                weights: weightsArray,
                method: method,
                confidenceLevel: confidenceLevel
            });
            setVarResult(response.data.var);
        } catch (error) {
            console.error('Error calculating VaR:', error);
        }
    };

    return (
        <div className="App">
            <h1>Portfolio VaR Calculator</h1>
            <div>
                <label>Returns:</label>
                {returns.map((ret, index) => (
                    <input
                        key={index}
                        type="text"
                        value={ret}
                        onChange={e => handleChange(index, e.target.value, setReturns)}
                    />
                ))}
                <button onClick={() => handleAddField(setReturns)}>Add Return</button>
            </div>
            <div>
                <label>Weights:</label>
                {weights.map((weight, index) => (
                    <input
                        key={index}
                        type="text"
                        value={weight}
                        onChange={e => handleChange(index, e.target.value, setWeights)}
                    />
                ))}
                <button onClick={() => handleAddField(setWeights)}>Add Weight</button>
            </div>
            <div>
                <label>Method: </label>
                <select value={method} onChange={e => setMethod(e.target.value)}>
                    <option value="historical">Historical</option>
                    <option value="parametric">Parametric</option>
                    <option value="monte_carlo">Monte Carlo</option>
                </select>
            </div>
            <div>
                <label>Confidence Level: </label>
                <input
                    type="number"
                    value={confidenceLevel}
                    step="0.01"
                    min="0"
                    max="1"
                    onChange={e => setConfidenceLevel(parseFloat(e.target.value))}
                />
            </div>
            <button onClick={handleCalculateVar}>Calculate VaR</button>
            {varResult !== null && (
                <div>
                    <h2>VaR: {varResult}</h2>
                </div>
            )}
        </div>
    );
}

export default App;
