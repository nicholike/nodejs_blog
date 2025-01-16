'use strict';
const { connect } = require('http2');
const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000

//count connect
const countConnect = () => {
    const numConnections = mongoose.connections.length;
    console.log(`Number of connections::${numConnections}`);
    return numConnections;
}

//check overload connect
const checkOverLoad = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        //Example maximum number of connections based on number of cores
        const maxConnections = numCores * 5;
        console.log(`Memory useage:: ${memoryUsage / 1024 / 1024}MB`);

        if (numConnections > maxConnections) {
            console.log(`connection overload detected!`)
            //notify.send(...)
        }
    }, _SECONDS) // morniter every 5 seconds
}

module.exports = {
    countConnect,
    checkOverLoad
}