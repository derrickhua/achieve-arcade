import axios from 'axios';

/**
 * Attempts to refresh the access token using a refresh token that is passed as an argument.
 * This function sends the refresh token to the server endpoint, which manages the token securely
 * and only requires a simple POST request with the refresh token to initiate a token refresh.
 * 
 * @param {string} refreshToken - The refresh token needed to request a new access token.
 * @returns {Promise<{accessToken: string, accessTokenExpires: number, error?: string}>}
 *          Returns a promise that resolves with the new access token and its expiration time, or an error if something goes wrong.
 */
export async function refreshAccessToken(refreshToken) {
    try {
        // Make a POST request to the refresh token endpoint, including the refresh token in the request body
        const response = await axios.post('http://localhost:8000/api/users/refresh-token', {
            refreshToken  // Sending refreshToken in the body
        });

        // Check if the response includes the necessary data
        console.log(response.data)
        if (response.data.accessToken && response.data.accessTokenExpires) {
            return {
                accessToken: response.data.accessToken,
                accessTokenExpires: response.data.accessTokenExpires  // Use directly from the response
            };
        } else {
            // Handle any cases where the expected data isn't returned
            throw new Error("Invalid refresh token response");
        }
    } catch (error) {
        console.error('Error refreshing access token: ', error);

        // Return an object indicating an error has occurred, ensuring to maintain the shape of the expected return type
        return {
            accessToken: "",
            accessTokenExpires: 0,
            error: "RefreshAccessTokenError"
        };
    }
}
