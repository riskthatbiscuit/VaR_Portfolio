from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import numpy as np
import pandas as pd
from scipy.stats import norm

class CalculateVaR(APIView):
    def post(self, request):
        # Access the values directly from the request.data dictionary
        returns = request.data.get('returns')
        weights = request.data.get('weights')
        method = request.data.get('method')
        confidence_level = float(request.data.get('confidenceLevel'))

        # Convert the input lists to numpy arrays
        returns = np.array([float(x) for x in returns])
        weights = np.array([float(x) for x in weights])

        if method == 'historical':
            portfolio_returns = np.dot(returns, weights)
            var = np.percentile(portfolio_returns, 100 * (1 - confidence_level))

        elif method == 'parametric':
            mean_return = np.mean(returns)
            portfolio_std = np.std(returns)
            z_score = norm.ppf(1 - confidence_level)
            var = -(mean_return + z_score * portfolio_std)

        elif method == 'monte_carlo':
            num_simulations = 10000
            num_assets = len(returns) 
            simulated_portfolio_returns = np.zeros(num_simulations)

            for i in range(num_simulations):
                simulated_returns = np.random.normal(np.mean(returns), np.std(returns), num_assets)
                simulated_portfolio_returns[i] = np.dot(simulated_returns, weights)

            var = np.percentile(simulated_portfolio_returns, 100 * (1 - confidence_level))

        else:
            return Response({'error': 'Invalid method selected'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'var': var})
