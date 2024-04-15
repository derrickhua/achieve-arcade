import axios from 'axios';

export async function refreshAccessToken(token: any) {
    try {
        const response = await axios.post('http://localhost:8000/api/users/refresh-token', {
            refreshToken: token.refreshToken,
        });
  
        return {
        ...token,
        accessToken: response.data.accessToken,
        accessTokenExpires: Date.now() + response.data.expiresIn * 1000,  
        refreshToken: response.data.refreshToken 
    };
} catch (error) {
    console.error('Error refreshing access token: ', error);
    
    return {
        ...token,
        error: "RefreshAccessTokenError"
    };
}
}

