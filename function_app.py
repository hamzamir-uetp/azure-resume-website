import os
import azure.functions as func
import json
from azure.cosmos import CosmosClient, exceptions

app = func.FunctionApp()

@app.route(route="visitor_counter", methods=["GET", "OPTIONS"], auth_level=func.AuthLevel.ANONYMOUS)
def main(req: func.HttpRequest) -> func.HttpResponse:
    # Handle CORS
    if req.method == "OPTIONS":
        return func.HttpResponse(
            status_code=200,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            }
        )
    
    connection_string = os.environ.get('COSMOS_DB_CONNECTION_STRING', 'NOT_SET')
    
    if connection_string == 'NOT_SET':
        return func.HttpResponse(
            json.dumps({"error": "Connection string not configured", "count": 0}),
            mimetype="application/json",
            status_code=200,
            headers={"Access-Control-Allow-Origin": "*"}
        )
    
    try:
        # Test the connection
        client = CosmosClient.from_connection_string(connection_string)
        databases = list(client.list_databases())
        
        # Try to access the specific database and container
        database = client.get_database_client('VisitorCountDB')
        container = database.get_container_client('VisitorCounts')
        
        # Try to read the counter
        try:
            item = container.read_item(item='resume_counter', partition_key='resume_counter')
            count = item.get('count', 0) + 1
            container.upsert_item({'id': 'resume_counter', 'count': count})
        except exceptions.CosmosResourceNotFoundError:
            count = 1
            container.upsert_item({'id': 'resume_counter', 'count': count})
        
        return func.HttpResponse(
            json.dumps({'count': count, 'status': 'success'}),
            mimetype="application/json",
            status_code=200,
            headers={"Access-Control-Allow-Origin": "*"}
        )
            
    except Exception as e:
        return func.HttpResponse(
            json.dumps({
                "count": 0, 
                "error": str(e),
                "error_type": type(e).__name__
            }),
            mimetype="application/json",
            status_code=200,
            headers={"Access-Control-Allow-Origin": "*"}
        )