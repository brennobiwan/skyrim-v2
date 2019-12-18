const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const Circuit = require("../models/circuit");
const PatchPanel = require("../models/patchpanel");
const Az = require("../models/site");

exports.getIndex = (req, res, next) => {
    console.log("getHome in user controllers");
    res.status(200).render("index");    
};

// Report GET

exports.getReport = (req, res, next) => {
    console.log("getReport in user controllers");
    res.status(200).render("user/report");
};

exports.getReportFile = (req, res, next) => {
    console.log("getReportFile in user controllers");
    res.setHeader('Content-disposition', 'attachment; filename=report.csv');
    res.setHeader('content-type', 'text/csv');
    res.download(path.join(__dirname, '../report.csv'));
};

// Report POST

exports.postGenerateReport = (req, res, next) => {
    console.log("postGenerateReport in user controllers");
    
    const report = _.toLower(req.body.queryClusterAZ);
    const filter = _.toLower(req.body.inputForm);
    const result = {};
    result[report] = filter;

    const csvWriter = createCsvWriter({
        path: 'report.csv',
        header: [{
            id: 'cluster',
            title: 'Cluster'
        },
        {
            id: 'az',
            title: 'AZ'
        },
        {
            id: '_circuit',
            title: 'Cross-Connect ID'
        },
        {
            id: 'serviceprovider',
            title: 'Service Provider / Peer'
        },
        {
            id: 'bandwidth',
            title: 'Bandwidth (Gbps)'
        },
        {
            id: 'device',
            title: 'Device'
        },
        {
            id: 'interface',
            title: 'Interface'
        },
        {
            id: 'patchpanel',
            title: 'Patch-Panel'
        },
        {
            id: 'patchpanelport',
            title: 'Patch-Panel Port'
        },
        {
            id: 'rack',
            title: 'Rack'
        },
        {
            id: 'ticket',
            title: "Ticket Number"
        }
        ]
    });

    fs.truncate(__dirname + '../util/report.csv', 0, function() {});

    const sort = { az: 1 };

    Circuit.find(result, (err, data) => {
        if (data.length === 0) {
            res.render("404", { fail: "Nothing found on your query parameters" });
        } else {
            csvWriter.writeRecords(data);
            res.redirect("/download-report");
        }
    }).sort(sort);

};

// Search

exports.getSearch = (req, res, next) => {
    console.log("getSearch in user controllers");
    res.status(200).render("user/search");
};

// Search GET

exports.getSearchCircuit = (req, res, next) => {
    console.log("getSearchCircuit in user controllers");
    res.status(200).render("user/search-circuit");
};

exports.getSearchPatchPanel = (req, res, next) => {
    console.log("getSearchCircuit in user controllers");
    res.status(200).render("user/search-patchpanel");
};

// Search POST

exports.postSearchCircuit = (req, res, next) => {

    console.log("postSearchCircuit in user controllers");

    const csvWriter = createCsvWriter({
        path: 'report.csv',
        header: [{
            id: 'cluster',
            title: 'Cluster'
        },
        {
            id: 'az',
            title: 'AZ'
        },
        {
            id: '_circuit',
            title: 'Cross-Connect ID'
        },
        {
            id: 'serviceprovider',
            title: 'Service Provider / Peer'
        },
        {
            id: 'bandwidth',
            title: 'Bandwidth (Gbps)'
        },
        {
            id: 'device',
            title: 'Device'
        },
        {
            id: 'interface',
            title: 'Interface'
        },
        {
            id: 'patchpanel',
            title: 'Patch-Panel'
        },
        {
            id: 'patchpanelport',
            title: 'Patch-Panel Port'
        },
        {
            id: 'rack',
            title: 'Rack'
        },
        {
            id: 'ticket',
            title: "Ticket Number"
        }
        ]
    });

    fs.truncate(__dirname + '../util/report.csv', 0, function() {});

    const typeOfData = _.toLower(req.body.queryClusterAZ);
    const valueOfData = _.toLower(req.body.inputForm);
    const queryOption = _.toLower(req.body.queryOption);
    const queryParameter = _.toLower(req.body.queryParameter).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const ticket = _.toLower(req.body.ticket);

    const query = {};
    const searchTitle = _.toUpper(valueOfData);
    query[typeOfData] = valueOfData;

    const sort = { az: 1 };

    if (queryOption === "allrecords") {        
        Circuit.find(query, (err, circuit) => {
            if (circuit.length === 0) {
                res.render("404", { fail: "Nothing found on your query parameters" });
            } else {
                csvWriter.writeRecords(circuit);
                res.render("search-result", {
                    circuit: circuit,
                    valueOfData: searchTitle,
                    queryClusterAZ: typeOfData
                });
            }
        }).sort(sort);
    } else {
        query[queryOption] = queryParameter;
        Circuit.find(query, (err, circuit) => {
            if (circuit.length === 0) {
                res.render("404", { fail: "Nothing found on your query parameters" });
            } else {
                csvWriter.writeRecords(circuit);
                res.render("search-result", {
                    circuit: circuit,
                    valueOfData: searchTitle,
                    queryClusterAZ: typeOfData
                });
            }
        }).sort(sort);
    }
};

exports.postCapacityTracker = (req, res, next) => {
    const az = _.toLower(req.body.inputForm);
    const pp = _.toLower(req.body.pp);
    const type = req.body.connectionType;
    const query = {};
    query["az"] = az;

    const csvWriter = createCsvWriter({
        path: 'report.csv',
        header: [{
            id: 'cluster',
            title: 'Cluster'
          },
          {
            id: 'az',
            title: 'AZ'
          },
          {
            id: '_patchpanel',
            title: 'Patch-Panel ID'
          },
          {
            id: 'capacity',
            title: 'Current Capacity'
          },
          {
            id: 'fullcapacity',
            title: 'Full Capacity'
          },
          {
            id: 'rack',
            title: 'Rack'
          },
          {
            id: 'type',
            title: 'Connection Type'
          }
        ]
      });
    
    fs.truncate(__dirname + '/report.csv', 0, function() {});

    Az.findOne({ _id: az })
        .then(site => {
            if (!site) {
                res.render("error/fail", {
                    fail: "AZ " + _.toUpper(az) + " is not registered.",
                    route: "/search"
                });
            } else {
                PatchPanel.find({ az: az })
                    .then(patchpanels => {
                        if (patchpanels.length === 0) {
                            res.render("error/fail", {
                                fail: "AZ " + _.toUpper(az) + " doesn't have Patch-Panels with the parameters informed.",
                                route: "/search"
                            });
                        } else {
                            if (pp === "" && type === "") {
                                csvWriter.writeRecords(patchpanels);
                                res.render("capacity-tracker", {
                                    patchpanel: patchpanels,
                                    az: _.toUpper(az)
                                });
                            } else if (pp !== "" && type !== "") {
                                query["_patchpanel"] = pp;
                                query["type"] = type;
                                PatchPanel.find(query)
                                    .then(patchpanels => {
                                        if (patchpanels.length === 0) {
                                            res.render("error/fail", {
                                                fail: "AZ " + _.toUpper(az) + " doesn't have Patch-Panels with the parameters informed.",
                                                route: "/search"
                                            });
                                        } else {
                                            csvWriter.writeRecords(patchpanels);
                                            res.render("capacity-tracker", {
                                                patchpanel: patchpanels,
                                                az: _.toUpper(az)
                                            });
                                        }
                                    })
                                    .catch();
                            } else if (pp === "" && type !== "") {
                                query["type"] = type;
                                PatchPanel.find(query)
                                    .then(patchpanels => {
                                        if (patchpanels.length === 0) {
                                            res.render("error/fail", {
                                                fail: "AZ " + _.toUpper(az) + " doesn't have Patch-Panels with the parameters informed.",
                                                route: "/search"
                                            });
                                        } else {
                                            csvWriter.writeRecords(patchpanels);
                                            res.render("capacity-tracker", {
                                                patchpanel: patchpanels,
                                                az: _.toUpper(az)
                                            });
                                        }
                                    })
                                    .catch();
                            } else {
                                query["_patchpanel"] = pp;
                                PatchPanel.find(query) 
                                    .then(patchpanels => {
                                        if (patchpanels.length === 0) {
                                            res.render("error/fail", {
                                                fail: "AZ " + _.toUpper(az) + " doesn't have Patch-Panels with the parameters informed.",
                                                route: "/search"
                                            });
                                        } else {
                                            csvWriter.writeRecords(patchpanels);
                                            res.render("capacity-tracker", {
                                                patchpanel: patchpanels,
                                                az: _.toUpper(az)
                                            });
                                        }
                                    })
                                    .catch();
                            }
                        }
                     })
                    .catch();
            }
        })
        .catch()
    
};