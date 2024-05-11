import axios from 'axios'
/**
 * Parse User object
 * @param user decoded user data
 * @returns { role, firstName, lastName, ref}
 */
export const parseUser = (user: Record<string, any>) => {
    let firstName = ''
    let lastName = ''
    const namespace = process.env.AUTH0_RULES_NAMESPACE as string
    const userMetadata = user && user[namespace].user_metadata
    const role = (user && user[namespace].role) || null

    if (userMetadata && userMetadata.firstName) {
        firstName = userMetadata.firstName
        lastName = userMetadata.lastName
    } else {
        if (user.sub.split('|')[0] === 'auth0') {
            firstName = user.nickname
        } else {
            firstName = user.given_name
            lastName = user.family_name
        }
    }

    return {
        id: user.sub,
        role,
        firstName,
        lastName,
    }
}
/**
 * Saves sid token to databse
 * @param token authentication jwt access_token
 * @param SID session cookie
 * @returns boolean
 */
export const syncToken = async (token: string, SID: string) =>
    await axios
        .request({
            method: 'PATCH',
            url: `${process.env.API_HOST}/v1/m2m/user/sid`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                Cookie: `SID=${SID};`,
            },
            withCredentials: true,
        })
        .then(async (_res) => {
            console.log('synced')
            return true
        })
        .catch((_err) => {
            console.log('failed to sync session ID!')
            return false
        })

/**
 * Updates user refrence in database
 * @param token authentication jwt access_token
 * @param SID session cookie
 * @returns (access_token, ref) or null
 */
export const updateUserRef = async (token: string, SID: string) =>
    await axios
        .request({
            method: 'POST',
            url: `${process.env.API_HOST}/v1/m2m/user`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                Cookie: `SID=${SID};`,
            },
            withCredentials: true,
        })
        .then(async (res) => {
            return res.data
        })
        .catch((err) => {
            console.log(
                err.response && err.response.data && err.response.data.message
                    ? err.response.data.message
                    : err
            )
            return null
        })
