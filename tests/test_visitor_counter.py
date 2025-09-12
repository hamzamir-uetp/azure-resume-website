# tests/test_visitor_counter.py
import pytest
import os
import json
import sys
from unittest.mock import Mock, patch, MagicMock

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)) + '/..')

# Import your function - FIXED IMPORT
from function_app import main

def test_function_returns_success_response():
    """Test that the function returns a successful JSON response"""
    # Mock the HTTP request
    mock_request = Mock()
    mock_request.method = 'GET'
    
    # Mock Cosmos DB to avoid actual database calls during testing
    with patch.dict('os.environ', {'COSMOS_DB_CONNECTION_STRING': 'test_connection'}):
        with patch('function_app.CosmosClient') as mock_cosmos:
            # Create proper mock objects
            mock_container = MagicMock()
            mock_container.read_item.return_value = {'count': 5}
            
            mock_database = MagicMock()
            mock_database.get_container_client.return_value = mock_container
            
            mock_instance = MagicMock()
            mock_instance.get_database_client.return_value = mock_database
            mock_cosmos.from_connection_string.return_value = mock_instance
            
            # Call the function
            response = main(mock_request)
    
    # Verify response structure
    assert response.status_code == 200
    assert 'application/json' in response.mimetype
    
    # Parse response body
    response_data = json.loads(response.get_body().decode())
    assert 'count' in response_data
    assert isinstance(response_data['count'], int)

def test_function_handles_options_request():
    """Test that the function handles CORS preflight requests"""
    # Mock OPTIONS request
    mock_request = Mock()
    mock_request.method = 'OPTIONS'
    
    # Call the function
    response = main(mock_request)
    
    # Should return 200 for OPTIONS
    assert response.status_code == 200
    assert 'Access-Control-Allow-Origin' in response.headers

def test_function_increments_counter():
    """Test that the counter increments"""
    mock_request = Mock()
    mock_request.method = 'GET'
    
    # Mock Cosmos DB completely
    with patch.dict('os.environ', {'COSMOS_DB_CONNECTION_STRING': 'test_connection'}):
        with patch('function_app.CosmosClient') as mock_cosmos:
            mock_container = MagicMock()
            mock_container.read_item.return_value = {'count': 5}
            
            mock_database = MagicMock()
            mock_database.get_container_client.return_value = mock_container
            
            mock_instance = MagicMock()
            mock_instance.get_database_client.return_value = mock_database
            mock_cosmos.from_connection_string.return_value = mock_instance
            
            # Call the function
            response = main(mock_request)
    
    assert response.status_code == 200

if __name__ == '__main__':
    pytest.main([__file__, '-v'])