import sys
from unittest.mock import MagicMock

sys.modules['google.cloud'] = MagicMock()
sys.modules['google.cloud.storage'] = MagicMock()
import unittest
import json
import app as flask_app  

test_db = {}

def mock_load_json(filename):
    return test_db.get(filename, [])

def mock_save_json(filename, data):
    test_db[filename] = data

flask_app.load_json = mock_load_json
flask_app.save_json = mock_save_json


class TestBackendCRUD(unittest.TestCase):
    def setUp(self):
        flask_app.app.config['TESTING'] = True
        self.client = flask_app.app.test_client()
        
        
        global test_db
        test_db = {
            "players.json": [
                {
                    "id": 1,
                    "name": "Virat Kohli",
                    "role": "Batsman",
                    "base_price": "2 Crore",
                    "team": None,
                    "image": "placeholder.png"
                }
            ],
            "users.json": [],
            "teams.json": []
        }

    def test_create_player(self):
        """Test CREATE: Add a new player"""
        new_player = {
            "name": "Jasprit Bumrah",
            "role": "Bowler",
            "base_price": "2 Crore"
        }
        response = self.client.post('/players', 
                                    data=json.dumps(new_player), 
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'"success":true', response.data)
        self.assertEqual(len(test_db["players.json"]), 2)
       
        print("\n  ✔ test_create_player PASSED successfully!")

    def test_read_players(self):
        """Test READ: Fetch players list"""
        response = self.client.get('/players')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Virat Kohli', response.data)
        
    
        print("\n  ✔ test_read_players PASSED successfully!")

    def test_update_player(self):
        """Test UPDATE: Modify existing player details"""
        updated_data = {"base_price": "2.5 Crore"}
        response = self.client.put('/players/1', 
                                   data=json.dumps(updated_data), 
                                   content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'"success":true', response.data)
        self.assertEqual(test_db["players.json"][0]["base_price"], "2.5 Crore")
        
        print("\n  ✔ test_update_player PASSED successfully!")

    def test_delete_player(self):
        """Test DELETE: Remove a player"""
        response = self.client.delete('/players/1')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'"success":true', response.data)
        self.assertEqual(len(test_db["players.json"]), 0)
        
        print("\n  ✔ test_delete_player PASSED successfully!")

if __name__ == '__main__':
    unittest.main()