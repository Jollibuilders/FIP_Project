# API Usage

## Get Profiles
<b>Endpoint:</b> `GET /profiles` <br>
<b>Description:</b> Fetches all available profiles. <br>
<b>Authentication:</b> Not required
<br><br>
<b>Request Example (Axios)</b>
```javascript
import axios from 'axios';

const getProfiles = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/profiles`);
    console.log(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
};

// Example usage
getProfiles();
```

## Get Me
<b>Endpoint:</b> `GET /me` <br>
<b>Description:</b> Fetches current user's profile. <br>
<b>Authentication:</b> Required
<br><br>
<b>Request Example (Axios)</b>
```javascript
import axios from 'axios';

const getCurrentUser = async (userId, token) => {
  try {
    const response = await axios.get(`http://localhost:3000/me`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },});
    console.log(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
};

// Example usage
getCurrentUser(userId, token);
```