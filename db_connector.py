# db_connector.py
from neo4j import GraphDatabase
import logging

class Neo4jConnection:
    """
    Neo4j database connection handler.
    Provides methods to connect, execute queries, and manage the Neo4j database.
    """
    
    def __init__(self, uri="bolt://localhost:7687", user="neo4j", password="password"):
        """
        Initialize the Neo4j connection.
        
        Args:
            uri (str): Neo4j database URI
            user (str): Username for authentication
            password (str): Password for authentication
        """
        self._uri = uri
        self._user = user
        self._password = password
        self._driver = None
        
        try:
            self._driver = GraphDatabase.driver(
                self._uri, 
                auth=(self._user, self._password)
            )
            logging.info("Successfully connected to Neo4j database")
        except Exception as e:
            logging.error(f"Failed to connect to Neo4j: {e}")
            raise e
    
    def close(self):
        """Close the database connection."""
        if self._driver is not None:
            self._driver.close()
            logging.info("Neo4j connection closed")
    
    def run_query(self, query, parameters=None):
        """
        Execute a Cypher query in a transaction.
        
        Args:
            query (str): Cypher query to execute
            parameters (dict): Parameters for the query
            
        Returns:
            list: Query results as a list of records
        """
        if parameters is None:
            parameters = {}
            
        try:
            with self._driver.session() as session:
                result = session.run(query, parameters)
                return [record.data() for record in result]
        except Exception as e:
            logging.error(f"Query execution failed: {e}")
            raise e
    
    def execute_write_transaction(self, query, parameters=None):
        """
        Execute a write transaction.
        
        Args:
            query (str): Cypher query to execute
            parameters (dict): Parameters for the query
            
        Returns:
            list: Query results as a list of records
        """
        if parameters is None:
            parameters = {}
            
        try:
            with self._driver.session() as session:
                result = session.write_transaction(lambda tx: tx.run(query, parameters))
                return [record.data() for record in result]
        except Exception as e:
            logging.error(f"Write transaction failed: {e}")
            raise e
    
    def execute_read_transaction(self, query, parameters=None):
        """
        Execute a read transaction.
        
        Args:
            query (str): Cypher query to execute
            parameters (dict): Parameters for the query
            
        Returns:
            list: Query results as a list of records
        """
        if parameters is None:
            parameters = {}
            
        try:
            with self._driver.session() as session:
                result = session.read_transaction(lambda tx: tx.run(query, parameters))
                return [record.data() for record in result]
        except Exception as e:
            logging.error(f"Read transaction failed: {e}")
            raise e