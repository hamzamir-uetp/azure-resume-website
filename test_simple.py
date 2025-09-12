# test_simple.py - Fixed version
import sys
import os
import json
from unittest.mock import Mock, patch, MagicMock

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import your function
from function_app import main

def test_basic():
    """Simple test that function runs without error"""
    # Create a mock HTTP request
    mock_request = Mock()
    mock_request.method = 'GET'
    
    # Mock environment variables
    with patch.dict('os.environ', {'COSMOS_DB_CONNECTION_STRING': 'AccountEndpoint=https://test.documents.azure.com:443/;AccountKey=testkey;'}):
        # Mock Cosmos DB to avoid actual database calls
        with patch('function_app.CosmosClient') as mock_cosmos:
            # Create proper mock objects
            mock_container = MagicMock()
            mock_container.read_item.return_value = {'count': 5}  # Return simple dict, not MagicMock
            
            mock_database = MagicMock()
            mock_database.get_container_client.return_value = mock_container
            
            mock_instance = MagicMock()
            mock_instance.get_database_client.return_value = mock_database
            mock_cosmos.from_connection_string.return_value = mock_instance
            
            # Call your function
            response = main(mock_request)
    
    print(f"✅ Response status: {response.status_code}")
    response_body = response.get_body().decode()
    print(f"✅ Response body: {response_body}")
    
    # Parse JSON to verify structure
    data = json.loads(response_body)
    assert 'count' in data
    assert isinstance(data['count'], int)
    
    assert response.status_code == 200
    print("✅ Test passed!")
    return True

if __name__ == '__main__':
    test_basic()