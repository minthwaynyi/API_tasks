import settings from './settings.js'
import { getAuthUser } from '../authdb.js'

const limiterSettings = settings.rateLimiterSettings

const getLimiterWindow = () => Math.floor(Date.now()/limiterSettings.windowSizeInMillis)

export const rateLimiter = (req, res, next) => {
    const user = getAuthUser(req.user)

    if(!user.rateLimiting) {
        user.rateLimiting = {
            window: getLimiterWindow(),
            requestCounter: 0
        }
    }

    const currentWindow = getLimiterWindow()
    if( user.rateLimiting.window < currentWindow ) {
        user.rateLimiting.window = currentWindow
        user.rateLimiting.requestCounter = 1
    } else {
        user.rateLimiting.requestCounter++
    }

    const remaining = limiterSettings.limit - user.rateLimiting.requestCounter

    res.set('X-RateLimit-Limit', limiterSettings.limit)
    res.set('X-RateLimit-Remaining', Math.max( remaining, 0))

    if( user.rateLimiting.requestCounter > limiterSettings.limit)
        return res.status(429).json({error: "You have exceeded your request limit. Please wait..."})

    next()
}