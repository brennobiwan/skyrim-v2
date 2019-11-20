const fs = require("fs");
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const _ = require("lodash");

const Circuit = require("../models/circuit");
const Az = require("../models/site");
const Cluster = require("../models/cluster");
const PatchPanel = require("../models/patchpanel");

exports.getIndex = (req, res, next) => {
    console.log("getIndex in admin controllers");
    res.status(200).render("index");
};

// NavBar Admin Controllers

exports.getAdd = (req, res, next) => {
    console.log("getAdd in admin controllers");
    res.status(200).render("admin/add");
};

exports.getUpdate = (req, res, next) => {
    console.log("getUpdate in admin controllers");
    res.status(200).render("admin/update");
};

exports.getDecommission = (req, res, next) => {
    console.log("getDecommission in admin controllers");
    res.status(200).render("admin/decommission");
};

// Add GET

exports.getAddCircuit = (req, res, next) => {
    console.log("getAddCircuit in admin controllers");
    res.status(200).render("admin/add-circuit");
};

exports.getAddPatchPanel = (req, res, next) => {
    console.log("getAddPatchPanel in admin controllers");
    res.status(200).render("admin/add-patchpanel");
};

exports.getAddAz = (req, res, next) => {
    console.log("getAddAz in admin controllers");
    res.status(200).render("admin/add-az");
};

exports.getUploadCsv = (req, res, next) => {
    console.log("getUploadCsv in admin controllers");
    res.status(200).render("admin/upload-csv");
};

exports.getTemplate = (req, res, next) => {
    console.log("getTemplate in admin controllers");
};

// Add POST

exports.postAddCircuit = (req, res, next) => {
    const serialId = _.toLower(req.body.serialId);
    const serviceProvider = _.toLower(req.body.serviceProvider).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const bandwidth = req.body.bandwidth;
    const patchPanel = _.toLower(req.body.patchPanel);
    const patchPanelPort = _.toLower(req.body.patchPanelPort);
    const device = _.toLower(req.body.device);
    const interface = _.toLower(req.body.interface);
    const ticket = _.toLower(req.body.ticket);
    const cluster = device.slice(0, 3);

    if (device[5] === "-") {
        var az = _.toLower(device.slice(0, 5));
    } else {
        var az = _.toLower(device.slice(0, 4));
    }

    console.log(serialId, serviceProvider, bandwidth, patchPanel, patchPanelPort, device, interface, ticket);

    Az.findById(az)
        .then(site => {
            if (!site) {
                console.log("AZ NOT REGISTERED");
                res.render("error/fail", {
                    fail: "AZ " + _.toUpper(az) + " is not registered. AZ and Patch-Panel must be registered prior to inserting Cross-Connect information.",
                    route: "/admin/add"
                });
            } else {
                console.log(site);
                PatchPanel.findOne({ _patchpanel: patchPanel, az: site._id })
                    .then(patchpanel => {
                        if (!patchpanel) {
                            console.log("PATCHPANEL NOT REGISTERED");
                            res.render("error/fail", {
                                fail: "Patch-Panel " + _.toUpper(patchPanel) + " is not registered. It must be registered prior to inserting Cross-Connect information.",
                                route: "/admin/add"
                            });
                        } else {
                            console.log(patchpanel);
                            if (patchpanel.capacity === 0) {
                                console.log("PATCHPANEL IS FULL");
                                res.render("error/fail", {
                                    fail: "Patch-Panel " + _.toUpper(patchPanel) + " has reached its full capacity. No more circuits can be deployed on this panel for now.",
                                    route: "/admin/add"
                                });
                            } else {
                                Circuit.findOne({ _circuit: serialId, az: site._id })
                                .then(circuit => {
                                    if (circuit) {
                                        console.log(circuit);
                                        console.log("CIRCUIT ALREADY REGISTERED");
                                        res.render("error/fail", {
                                            fail: "Cross-Connect ID " + _.toUpper(serialId) + " is already registered for " + _.toUpper(az) + ".",
                                            route: "/admin/add"
                                        });
                                    } else {
                                        console.log("CIRCUIT SAVED");
                                        const newCircuit = new Circuit({
                                            _circuit: serialId,
                                            serviceprovider: serviceProvider,
                                            bandwidth: bandwidth,
                                            rack: patchpanel.rack,
                                            patchpanel: patchPanel,
                                            patchpanelport: patchPanelPort,
                                            device: device,
                                            interface: interface,
                                            az: az,
                                            cluster: device.slice(0, 3),
                                            ticket: ticket
                                        });
                                            newCircuit.save();
                                            PatchPanel.findOneAndUpdate({ az: az, _patchpanel: patchPanel }, { $inc: { capacity: -1}}, (err, patchpanelupdate) => {});
                                            res.render("success/success", {
                                                success: "Cross-Connect " + _.toUpper(serialId) + " registered.",
                                                route: "/admin/add"
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
        .catch(() => {
            
        });
};

exports.postUpdate = (req, res, next) => {
    const serialId = req.body.inputUpdate;
    const az = req.body.inputForm;
    Circuit.findOne({ _circuit: serialId, az: az })
        .then(circuit => {
            if (!circuit) {
                res.render("error/fail", {
                    fail: "Cross-Connect ID " + _.toUpper(serialId) + " is not registered for " + _.toUpper(az) + ".",
                    route: "/admin/update"
                });
            } else {
                res.render("admin/update-circuit", {
                    ckt: circuit,
                    oldPatchPanel: circuit.patchpanel,
                    route: "/admin/update"
                });
            }
        })
        .catch();
};

exports.postUpdateCircuit = (req, res, next) => {
    const serialId = _.toLower(req.body.serialId);
    const serviceProvider = _.toLower(req.body.serviceProvider);
    const bandwidth = req.body.bandwidth;
    const patchPanel = _.toLower(req.body.patchPanel);
    const patchPanelPort = _.toLower(req.body.port)
    const device = _.toLower(req.body.device);
    const interface = _.toLower(req.body.interface);
    const ticket = _.toLower(req.body.ticket);
    const oldPatchPanel = _.toLower(req.body.oldPatchPanel);
    const oldDevice = _.toLower(req.body.oldDevice);

    if (device[5] === "-") {
        var az = _.toLower(device.slice(0, 5));
    } else {
        var az = _.toLower(device.slice(0, 4));
    }

    if (oldDevice[5] === "-") {
        var oldAz = _.toLower(oldDevice.slice(0, 5));
    } else {
        var oldAz = _.toLower(oldDevice.slice(0, 4));
    }

    if (az !== oldAz) {
        res.render("error/fail", {
            fail: "The change must be in the same AZ.",
            route: "/admin/update"
        });
    } else {
        if (patchPanel === oldPatchPanel) {
            Circuit.findOneAndUpdate({ _circuit: serialId, az: az }, {
                _circuit: serialId,
                serviceprovider: serviceProvider,
                bandwidth: bandwidth,
                patchpanel: patchPanel,
                patchpanelport: patchPanelPort,
                device: device,
                interface: interface,
                az: az,
                cluster: device.slice(0, 3)
            }, (err, result) => {
                res.render("success/success", {
                    success: "Cross-Connect ID " + _.toUpper(serialId) + " updated.",
                    route: "/admin/update"
                });
            });
        } else {
            PatchPanel.findOne({ _patchpanel: patchPanel, az: az })
                .then(patchpanel => {
                    if (patchpanel.capacity === 0) {
                        res.render("error/fail", {
                            fail: "Patch-Panel " + _.toUpper(patchPanel) + " has reached its full capacity.",
                            route: "/admin/update"
                        });
                    } else {
                        Circuit.findOneAndUpdate({ _circuit: serialId, az: az }, {
                            _circuit: serialId,
                            serviceprovider: serviceProvider,
                            bandwidth: bandwidth,
                            patchpanel: patchPanel,
                            patchpanelport: patchPanelPort,
                            device: device,
                            interface: interface,
                            az: az,
                            cluster: device.slice(0, 3)
                        }, (err, result) => {
                            PatchPanel.findOneAndUpdate({ _patchpanel: oldPatchPanel, az: az }, { $inc: { capacity: 1 }}, (err, result) => {
                                PatchPanel.findOneAndUpdate({ _patchpanel: patchPanel, az: az }, { $inc: { capacity: -1 }}, (err, result) => {
                                    res.render("success/success", {
                                        success: "Cross-Connect ID " + _.toUpper(serialId) + " updated.",
                                        route: "/admin/update"
                                    });
                                });
                            });
                        });
                    }
                })
                .catch()
        }   
    }
};

// Decommission Submenu

exports.getDecommissionCircuit = (req, res, next) => {
    console.log("getDecommissionCircuit in admin controllers");
    res.status(200).render("admin/decommission-circuit");
};

exports.getDecommissionPatchPanel = (req, res, next) => {
    console.log("getDecommissionCircuit in admin controllers");
    res.status(200).render("admin/decommission-patchpanel");
};