/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


'use strict';
const fs = require('fs');
const path = require('path');
//const _home = require('os').homedir();
//const hlc_idCard = require('composer-common').IdCard;
//const composerAdmin = require('composer-admin');
//const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkDefinition = require('composer-common').BusinessNetworkDefinition;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const config = require('../../../env.json');
const NS = 'org.acme.Z2BTestNetwork';

exports.addSensor = function (req, res, next) {
    let businessNetworkConnection;
    let factory;
    businessNetworkConnection = new BusinessNetworkConnection();
    // connection prior to V0.15
    // return businessNetworkConnection.connect(config.composer.connectionProfile, config.composer.network, config.composer.adminID, config.composer.adminPW)
    // connection in v0.15
    return businessNetworkConnection.connect(config.composer.adminCard)
        .then(() => {
            factory = businessNetworkConnection.getBusinessNetwork().getFactory();
            return businessNetworkConnection.getParticipantRegistry(NS + '.Sensor')
                .then(function (participantRegistry) {
                    let ts = Date.now();

                    return participantRegistry.get(ts.toString())
                    .then((_res) => { res.send('member already exists. add cancelled');})
                    .catch((_res) => {
                        //console.log(ts.toString() +' not in User registry. ');
                        let participant = factory.newResource(NS, 'Sensor', ts.toString());
                        participant.id = req.body.device + ts.toString();
                        participant.device = req.body.device;
                        participant.ts = req.body.ts;
                        participant.seq = req.body.seq;
                        participant.dsize = req.body.dsize;
                        participant.dhash = req.body.dhash;
                        participantRegistry.add(participant)
                        .then(() => {console.log('Successfully Added'); res.send({ 'result': 'Successfully saved.', 'success': true});})
                        .catch((error) => {console.log(req.body.name+' add failed', error); res.send({ 'result': error, 'success':false});});
                    });
                })
                .catch((error) => { console.log('error with getParticipantRegistry', error); res.send(error); });
        })
        .catch((error) => { console.log('error with businessNetworkConnection', error); res.send(error); });
};


exports.getAllSensor = function (req, res, next) {
    console.log("Called Get All Sensor")
    let businessNetworkConnection;
    let factory;
    let allSensor = new Array();
    businessNetworkConnection = new BusinessNetworkConnection();
    // connection prior to V0.15
    // return businessNetworkConnection.connect(config.composer.connectionProfile, config.composer.network, config.composer.adminID, config.composer.adminPW)
    // connection in v0.15

    let serializer;
    let archiveFile = fs.readFileSync(path.join(path.dirname(require.main.filename), 'network', 'dist', 'zerotoblockchain-network.bna'));
    return BusinessNetworkDefinition.fromArchive(archiveFile)
        .then((bnd) => {
            serializer = bnd.getSerializer();

            return businessNetworkConnection.connect(config.composer.adminCard)
                .then(() => {
                    factory = businessNetworkConnection.getBusinessNetwork().getFactory();
                    return businessNetworkConnection.getParticipantRegistry(NS + '.Sensor')
                        .then(function (participantRegistry) {

                            return participantRegistry.getAll()
                                .then((members) => {
                                    console.log('There are ' + members.length + ' entries.');

                                    for (let each in members) {
                                        (function (_idx, _arr) {
                                            let _jsn = serializer.toJSON(_arr[_idx]);
                                            console.log(_idx, _jsn)
                                            let participant = {}
                                            participant.id = _jsn.id;
                                            participant.device = _jsn.device;
                                            participant.ts = _jsn.ts;
                                            participant.seq = _jsn.seq;
                                            participant.dsize = _jsn.dsize;
                                            participant.dhash = _jsn.dhash;
                                            allSensor.push(participant);
                                        })(each, members)
                                    }

                                    res.send({ 'result': 'success', 'success': true, 'sensor': allSensor });
                                })
                                .catch((_res) => {
                                    console.log('No one registered', _res);
                                });
                        })
                        .catch((error) => { console.log('error with getParticipantRegistry', error); res.send(error); });
                })
                .catch((error) => { console.log('error with businessNetworkConnection', error); res.send(error); });
        })


};

