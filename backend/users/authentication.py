from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
from .clerk_auth import get_user_from_clerk_token
import logging

logger = logging.getLogger(__name__)

class ClerkAuthentication(BaseAuthentication):
    """
    Authentication class for Clerk JWT tokens.
    """
    def authenticate(self, request):
        # Log request details
        logger.info(f"Request method: {request.method}")
        logger.info(f"Request path: {request.path}")
        logger.info(f"Request headers: {dict(request.headers)}")
        
        # Get the authorization header
        auth_header = get_authorization_header(request).decode()
        logger.info(f"Auth header received: {auth_header[:20]}...")  # Log first 20 chars for security
        
        if not auth_header or not auth_header.startswith('Bearer '):
            logger.warning("No Bearer token found in authorization header")
            return None
        
        # Extract the token
        token = auth_header.split(' ')[1]
        logger.info("Token extracted successfully")
        
        # Extract location data from request headers or query parameters
        latitude = request.headers.get('X-User-Latitude')
        longitude = request.headers.get('X-User-Longitude')
        
        # If not in headers, try query parameters
        if not latitude and not longitude:
            latitude = request.query_params.get('latitude')
            longitude = request.query_params.get('longitude')
        
        # If not in query parameters, try request data
        if not latitude and not longitude:
            latitude = request.data.get('latitude')
            longitude = request.data.get('longitude')
        
        logger.info(f"Location data - Latitude: {latitude}, Longitude: {longitude}")
        
        try:
            # Verify the token and get the user, passing location data
            user = get_user_from_clerk_token(token, latitude, longitude)
            logger.info(f"Authentication successful for user: {user.email}")
            return (user, token)
        except AuthenticationFailed as e:
            logger.error(f"Authentication failed: {str(e)}")
            raise e
        except Exception as e:
            logger.error(f"Unexpected error during authentication: {str(e)}")
            raise AuthenticationFailed(f'Authentication failed: {str(e)}')
    
    def authenticate_header(self, request):
        return 'Bearer' 