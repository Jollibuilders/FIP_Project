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

// Example response
const error = {'status_code': 500, 'message': 'Error fetching profiles for display'}
const success = {'status_code': 200, 'users': /* array of users */ }
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

// Example response
const error = {'status_code': 404, 'message': 'User does not exist.'}
const success = {'status_code': 200, 'user': /* user data */ }
```

## Get Profile by ID
<b>Endpoint:</b> `GET /profiles/:id` <br>
<b>Description:</b> Fetches a user's profile by a given ID. <br>
<b>Authentication:</b> Required
<br><br>
<b>Request Example (Axios)</b>
```javascript
import axios from 'axios';

const getUserById = async (userId, token) => {
  try {
    const response = await axios.get(`http://localhost:3000/profiles/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },});
    console.log(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
};

// Example usage
getUserById(userId, token);

// Example response
const error = {'status_code': 404, 'message': 'User not found.'}
const success = {'status_code': 200, 'user': /* user data */ }
```

## Send Like
<b>Endpoint:</b> `GET /api/like` <br>
<b>Description:</b> Sends a like to a user's profile. <br>
<b>Authentication:</b> Required <br>
<br><br>
<b>Request Example (Axios)</b>
```javascript
import axios from 'axios';

const sendLike = async (toUserId, token) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/like`, {
      headers: {
        Authorization: `Bearer ${token}`,
        toUserId: toUserId,
      },});
    console.log(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
};

// Example usage
sendLike(toUserId, token);

// Example response:
const error = {'status_code': 404, 'message': 'User does not exist.'}
const success = {'status_code': 200, 'user': /* user data */ }
```

## Send Unlike
<b>Endpoint:</b> `GET /api/unlike` <br>
<b>Description:</b> Unlike a user's profile. <br>
<b>Authentication:</b> Required <br>
<br><br>
<b>Request Example (Axios)</b>
```javascript
import axios from 'axios';

const sendUnlike = async (toUserId, token) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/unlike`, {
      headers: {
        Authorization: `Bearer ${token}`,
        toUserId: toUserId,
      },});
    console.log(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
};

// Example usage
sendUnlike(toUserId, token);

// Example response:
const error = {'status_code': 404, 'message': 'No like exists for this user.'}
const success = {'status_code': 200, 'message': 'Success' }
```

## Get Liked Profiles
<b>Endpoint:</b> `GET /api/getLikes` <br>
<b>Description:</b> Get the current user's liked profiles.<br>
<b>Authentication:</b> Required <br>
<br><br>
<b>Request Example (Axios)</b>
```javascript
import axios from 'axios';

const getLikes = async (token) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/getLikes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },});
    console.log(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
};

// Example usage
getLikes(token);

// Example response:
const error = {'status_code': 404, 'message': 'User does not exist.'}
const success = {'status_code': 200, 'message': 'Success', 'likes': /* list of liked users */ }
```

## Get Matches
<b>Endpoint:</b> `GET /api/getMatches` <br>
<b>Description:</b> Get a current user's matches. <br>
<b>Authentication:</b> Required <br>
<br><br>
<b>Request Example (Axios)</b>
```javascript
import axios from 'axios';

const getMatches = async (token) => {
  try {
    const response = await axios.get(`http://localhost:3000/api/unlike`, {
      headers: {
        Authorization: `Bearer ${token}`,
        toUserId: toUserId,
      },});
    console.log(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
};

// Example usage
getMatches(token);

// Example response:
const error = {'status_code': 400, 'message': 'Error message'}
const success = {'status_code': 200, 'message': 'Matches found', 'matches': /* list of matches */ }
```