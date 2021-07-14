const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const crypto = require('crypto');

const statusList = require('../files/status.json');
const envList = require('../files/env.json');

/**
 * Checks that all the neccessary environmental variables
 * are defined before running the app.
 * The function will throw an error and exit the app if
 * a variable is missing.
 */
function checkEnv() {
    envList.forEach((e) => {
        if (process.env[e] === undefined) {
            console.error(`ERROR: The ${e} environmental variable was not defined.`);
            process.exit(1);
        }
    });
}

/**
 * Sends an error with the provided status
 * (see: https://httpstatuses.com/) and error message
 *
 * @param {import("express").Response} res The express response object
 * @param {number} status The error status code
 * @param {string} message The message to send the user
 */
function sendError(res, status, message) {
    res.status(status);
    res.send({
        status,
        statusMessage: `${status} ${statusList[status]}`,
        error: message,
    });
}

/**
 * Writes request to main log file
 *
 * @param {import("express").Request} req The express response object
 */
function logRequest(req) {
    var url = req.url;
    const keyIndex = url.indexOf('?key=');
    if (keyIndex !== -1) url = url.substring(0, keyIndex) + url.substring(keyIndex + 38, url.length);
    const data = `${new Date().toISOString()} | ${getIp(req)} | ${req.method} ${url} | ${req.headers['user-agent']}\n`;
    fs.appendFile(path.join(__dirname, 'logs', 'main.log'), data, (err) => {
        if (err) console.dir(err);
    });
}

/**
 * Parses a multipart form club upload and returns the data in a callback function
 * @param {import('express').Request} req The Express request object
 * @param {import('express').Response} res The Express response object
 * @param {Function} callback Callback function to run after parsing the form, passes in the club object as a parameter
 */
async function parseForm(req, res, callback) {
    // Import this function here to avoid circular dependencies
    const { uploadImage } = require('../images');

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            sendError(res, 400, 'Invalid form response');
            return;
        }

        var club = JSON.parse(fields.data);

        // Check for old pictures
        var oldImages = [];
        if (hasOldPicture(club.coverImgThumbnail)) oldImages.push(club.coverImgThumbnail);
        if (hasOldPicture(club.coverImg)) oldImages.push(club.coverImg);

        if (club.coverImgBlobs.img !== null) {
            club.coverImgThumbnail = await uploadImage(files.thumb);
            club.coverImg = await uploadImage(files.img);
        }
        for (var i = 0; i < club.execProfilePicBlobs.length; i++) {
            if (club.execProfilePicBlobs[i] !== null) {
                if (req.query.update) {
                    if (hasOldPicture(club.oldExecs[i].img)) oldImages.push(club.oldExecs[i].img);
                    club.execs[i].img = await uploadImage(files[`exec${i}`]);
                } else club.execs[i].img = await uploadImage(files[`exec${i}`]);
            }
        }

        callback(club, oldImages);
    });
}

async function hasOldPicture(oldId) {
    return oldId !== null && oldId !== undefined && oldId.startsWith('/') && typeof oldId === 'string';
}

/**
 * Extracts the IP address from the header of the express request object
 *
 * @param {import('express').Request} req Express request object
 * @returns {string} IP address of the user or
 */
function getIp(req) {
    return req.headers['x-real-ip'] || req.connection.remoteAddress;
}

/**
 * Generates a 16 byte hex state
 *
 * @returns {string} String representing the state
 */
function genState() {
    return crypto.randomBytes(16).toString('hex');
}

/**
 * Will check to see if the email is a trusted email
 * Always returns true if TRUSTED environmental variable is not defined
 *
 * @param {string} email The email to check
 * @returns {boolean} True if the email is trusted
 */
function isTrusted(email) {
    if (process.env.TRUSTED === undefined) return true;
    return process.env.TRUSTED.indexOf(email) !== -1;
}

module.exports = { checkEnv, sendError, logRequest, parseForm, getIp, genState, isTrusted };
