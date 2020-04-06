/* Callback function, instead if using 'setTimeout()' */
function getData(url, cb) {
    var xhr = new XMLHttpRequest(); // Built-in JS Object to consume API's

    /* AJAX Server Response
    'onreadystatechange': Defines a function to be called when the readyState property changes.
    'readyState': Defines a function to be called when the readyState property changes.
        0: request not initialized - 'open()' not yet called.
        1: server connection established - 'open()' has been called.
        2: request received - 'send()' has been  called, and both headers and status are available.
        3: processing request - ...downloading...'responseText' holds partial dat.
        4: request finished and response is ready - the operation is complete.
    'status': Defines HTTP status message.
        200: "OK"
        403: "Forbidden"
        404: "Page not found"
    'JSON.parse': parses String to JSON. */
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            cb(JSON.parse(this.responseText));
        }
    };

    /* HTTP GET Method to get the specified URL, for example
    (HTML: <button onclick="writeToDocument('https://swapi.co/api/people')">People</button> */
    xhr.open("GET", url);
    xhr.send();
}

function getTableHeaders(obj) {
    var tableHeaders = [];

    /* WHY? -- Get the keys and set the table headers to the key value, for example 'name', 'height, 'hair'...  */
    /* HOW? -- 'Object-keys()' Creates an array comprised of the keys in an object */
    Object.keys(obj).forEach(function (key) {
        tableHeaders.push(`<td>${key}</td>`); // New table cell with key
    });

    return `<tr>${tableHeaders}</tr>`;
}

/* Create the Next and Prev buttons (data is displayed 10 rows at a time), if there's a value (URL) for both next and previous. */
function generatePaginationButtons(next, prev) {
    if (next && prev) {
        return `<button onclick="writeToDocument('${prev}')">Previous</button>
                <button onclick="writeToDocument('${next}')">Next</button>`;
    } else if (next && !prev) {
        return `<button onclick="writeToDocument('${next}')">Next</button>`;
    } else if (!next && prev) {
        return `<button onclick="writeToDocument('${prev}')">Previous</button>`;
    }
}

/*  */
function writeToDocument(url) {
    var tableRows = [];
    var el = document.getElementById("data");

    getData(url, function (data) {
        var pagination = "";

        /* If the '(data.next || data.previous)' values exist then create pagination buttons. */
        if (data.next || data.previous) {
            pagination = generatePaginationButtons(data.next, data.previous);
        }
        data = data.results;
        var tableHeaders = getTableHeaders(data[0]);

        data.forEach(function (item) {
            var dataRow = [];

            /* 'key' is the index, to get the value of each key and not just the key name. */
            Object.keys(item).forEach(function (key) {
                var rowData = item[key].toString();
                var truncatedData = rowData.substring(0, 15); // Truncate each to to 15 characters max, for the sake of this demo only (easier to read)
                dataRow.push(`<td>${truncatedData}</td>`);
            });
            tableRows.push(`<tr>${dataRow}</tr>`);
        });

        /* innerHTML vs. outerHTML:
        Use innerHTML as default. This replaces only the content inside the current element referred to.
        If you are using outerHTML, then the element referred to will also be replaced. */
        el.innerHTML = `<table>${tableHeaders}${tableRows}</table>${pagination}`.replace(/,/g, ""); // Regular expression to replace the ',' (commas) with '' (nothing = removed)
    });
}