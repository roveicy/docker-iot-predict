App = {
    baseURL: `http://${window.location.hostname}:3000`,
    page: 'register',//register //test
    init: function () {
        console.log("App initialized....");

        console.log('BaseURL', App.baseURL);

        //App.formsJSON = JSON.parse(forms);
        //console.log('Forms JSON', App.formsJSON)

        App.loadpages();
    },
    loadpages: function () {
        App.showloader(true);
        switch (App.page) {
            case 'test':
                $('#container').empty();
                $('#container').load('test.html')
                break;
            case 'register':
                App.loadRegisterPage();
                break;
            default:
                break;
        }
        App.showloader(false);
    },
    loadRegisterPage: function () {
        App.showloader(false);

        $('#container').empty();

        $('#container').load('register-page.html')
    },
    saveToBC_registerSensor: function () {

        const device = $('#inputDevice').val();
        const ts = $('#inputTs').val();
        const seq = $('#inputSeq').val();
        const dsize = $('#inputDSize').val();
        const dhash = $('#inputDHash').val();

        let payload = {
            device: device,
            ts: ts,
            seq: seq,
            ddata:'',
            dsize: dsize,
            dhash: dhash
        }

        console.log(payload)
        App.showloader(true);

        $.post("/composer/admin/addSensor", payload, function (data, status) {

            if (status === 'success') {

                if (data.success) {
                    console.log("Saveed succesfylly", data.result)
                    $('#inputDevice').val('');
                    $('#inputTs').val('');
                    $('#inputSeq').val('');
                    $('#inputDSize').val('');
                    $('#inputDHash').val('');
                    App.showloader(false);
                }
            }
        })

    },
    loadAdminPage: function () {
        App.showloader(true);

        $('#container').empty();

        $.get("/composer/admin/getAllSensor", function (data, status) {

            if (status === 'success') {

                if (data.success) {
                    //console.log("Load", data.user)

                    let str = `<table class="table table-hover">
                                <thead>
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Device</th>
                                    <th scope="col">Timestamp</th>
                                    <th scope="col">Sequence</th>
                                    <th scope="col">Data</th>
                                    <th scope="col">Data Size</th>
                                    <th scope="col">Data Hash</th>
                                </tr>
                                </thead>
                                <tbody>`

                    //data.sensor.sort
                                
                    for (let each in data.sensor) {
                        (function (idx, arr) {
                            str += `<tr><th scope="row">${arr[idx].id}</th>
                                    <td>${arr[idx].device}</td>
                                    <td>${arr[idx].ts}</td>
                                    <td>${arr[idx].seq}</td>
                                    <td>${arr[idx].ddata}</td>
                                    <td>${arr[idx].dsize}</td>
                                    <td>${arr[idx].dhash}</td>
                                    
                                </tr>`
                        })(each, data.sensor)
                    }

                    str += `</tbody></table>`

                    App.showloader(false)
                    $('#container').html(str);
                    
                }
            }
        })

    },

    showloader: function (param, cont = 'main') {
        switch (cont) {
            case 'main':
                if (param === true) {
                    $('#container').hide();
                    $('#loader').show();
                } else {
                    $('#container').show();
                    $('#loader').hide();
                }
                break;
            case 'landing':
                if (param === true) {
                    $('#org-landing-container').empty();
                    $('#org-landing-container').html('<div class="container"><h1 class="mt-5">Loading...</h1></div>');
                } else {
                    $('#org-landing-container').empty();
                }
                break;
            default:
                $('#container').show();
                $('#loader').hide();
                break;
        }

    }
}

$(function () {
    $(window).load(function () {
        App.init();
    })
})
