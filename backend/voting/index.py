"""
Business: API для голосования за пол малыша с подсчетом результатов
Args: event - dict с httpMethod, body, queryStringParameters
      context - объект с атрибутами: request_id, function_name
Returns: HTTP response dict с результатами голосования
"""

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    """Создает подключение к базе данных"""
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    # CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        # POST - добавить голос
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            vote_type = body_data.get('vote_type')
            
            if vote_type not in ['boy', 'girl']:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid vote_type. Must be "boy" or "girl"'}),
                    'isBase64Encoded': False
                }
            
            # Получаем IP адрес
            voter_ip = event.get('requestContext', {}).get('identity', {}).get('sourceIp', 'unknown')
            
            # Добавляем голос
            cursor.execute(
                "INSERT INTO votes (vote_type, voter_ip) VALUES (%s, %s) RETURNING id",
                (vote_type, voter_ip)
            )
            conn.commit()
            
            # Получаем обновленную статистику
            cursor.execute("""
                SELECT 
                    COUNT(CASE WHEN vote_type = 'boy' THEN 1 END) as boy_votes,
                    COUNT(CASE WHEN vote_type = 'girl' THEN 1 END) as girl_votes,
                    COUNT(*) as total_votes
                FROM votes
            """)
            stats = cursor.fetchone()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'success': True,
                    'vote_type': vote_type,
                    'stats': dict(stats)
                }),
                'isBase64Encoded': False
            }
        
        # GET - получить статистику
        elif method == 'GET':
            cursor.execute("""
                SELECT 
                    COUNT(CASE WHEN vote_type = 'boy' THEN 1 END) as boy_votes,
                    COUNT(CASE WHEN vote_type = 'girl' THEN 1 END) as girl_votes,
                    COUNT(*) as total_votes
                FROM votes
            """)
            stats = cursor.fetchone()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'stats': dict(stats)}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        cursor.close()
        conn.close()
