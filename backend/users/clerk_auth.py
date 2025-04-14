import jwt
import requests
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
import logging

logger = logging.getLogger(__name__)

User = get_user_model()

# Clerk JWT verification
def verify_clerk_token(token):
    """
    Verify a Clerk JWT token and return the payload if valid.
    """
    try:
        # Get Clerk's public key from their JWKS endpoint
        frontend_api = settings.CLERK_FRONTEND_API.replace('https://', '')
        jwks_url = f"https://{frontend_api}/.well-known/jwks.json"
        logger.info(f"Fetching JWKS from: {jwks_url}")
        
        jwks_response = requests.get(jwks_url)
        if jwks_response.status_code != 200:
            logger.error(f"Failed to fetch JWKS. Status code: {jwks_response.status_code}")
            logger.error(f"JWKS response: {jwks_response.text}")
            raise AuthenticationFailed('Failed to fetch JWKS')
            
        jwks = jwks_response.json()
        logger.info("JWKS fetched successfully")
        
        # Get the key ID from the token header
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get('kid')
        logger.info(f"Token KID: {kid}")
        logger.info(f"Token header: {unverified_header}")
        
        # Find the matching key
        key = None
        for jwk in jwks.get('keys', []):
            if jwk.get('kid') == kid:
                key = jwt.algorithms.RSAAlgorithm.from_jwk(jwk)
                logger.info("Matching key found in JWKS")
                break
        
        if not key:
            logger.error("No matching key found in JWKS")
            logger.error(f"Available KIDs: {[jwk.get('kid') for jwk in jwks.get('keys', [])]}")
            raise AuthenticationFailed('Invalid token key')
        
        # Decode the token without verifying audience since it's missing in the token
        logger.info(f"Verifying token with issuer: {settings.CLERK_JWT_ISSUER}")
        try:
            payload = jwt.decode(
                token,
                key,
                algorithms=['RS256'],
                issuer=settings.CLERK_JWT_ISSUER,
                options={
                    'verify_iss': True,
                    'verify_aud': False,  # Disable audience verification
                    'verify_exp': True,
                }
            )
            logger.info("Token verified successfully")
            logger.info(f"Token claims: {payload}")
            return payload
        except jwt.ExpiredSignatureError:
            logger.error("Token has expired")
            raise AuthenticationFailed('Token has expired. Please refresh your session.')
        except jwt.InvalidIssuerError:
            logger.error(f"Invalid issuer. Expected: {settings.CLERK_JWT_ISSUER}")
            raise AuthenticationFailed('Invalid token issuer')
        except jwt.InvalidTokenError as e:
            logger.error(f"Invalid token: {str(e)}")
            raise AuthenticationFailed(f'Invalid token: {str(e)}')
    except jwt.InvalidTokenError as e:
        logger.error(f"Invalid token: {str(e)}")
        raise AuthenticationFailed(f'Invalid token: {str(e)}')
    except Exception as e:
        logger.error(f"Token verification failed: {str(e)}")
        raise AuthenticationFailed(f'Token verification failed: {str(e)}')

def get_user_from_clerk_token(token, latitude=None, longitude=None):
    """
    Get or create a user from a Clerk JWT token.
    """
    try:
        # Verify the token and get the claims
        claims = verify_clerk_token(token)
        
        # Get the clerk_id and email from the claims
        clerk_id = claims.get('sub')
        email = claims.get('email')
        
        if not clerk_id:
            logger.error(f"Invalid token claims: {claims}")
            raise AuthenticationFailed('Invalid token claims: missing sub claim')
        
        # If email is not in the token, use a default email based on clerk_id
        if not email:
            logger.warning(f"Email not found in token claims, using default email for clerk_id: {clerk_id}")
            email = f"{clerk_id}@clerk.user"
        
        # Try to get an existing user
        try:
            user = User.objects.get(clerk_id=clerk_id)
            # Update location if provided
            if latitude is not None and longitude is not None:
                user.latitude = float(latitude)
                user.longitude = float(longitude)
                user.save()
                logger.info(f"Updated location for user {user.email}: lat={latitude}, lon={longitude}")
            return user
        except User.DoesNotExist:
            # Create a new user
            user = User.objects.create(
                clerk_id=clerk_id,
                email=email,
                username=email.split('@')[0],  # Use email prefix as username
                latitude=float(latitude) if latitude is not None else None,
                longitude=float(longitude) if longitude is not None else None
            )
            logger.info(f"Created new user: {user.email}")
            return user
            
    except Exception as e:
        logger.error(f"Failed to get user from token: {str(e)}")
        raise AuthenticationFailed(f'Failed to get user from token: {str(e)}') 