data = {
    words: [
        {
            word: "Galaxia",
            wordType: "Noun",
            description:
                "A word meaning a system of millions or billions of stars, including the sun and planets. It is a Greek word meaning 'milky', relating to the appearance of the Milky Way galaxy.",
            language: "Greek",
        },
        {
            word: "Dash",
            wordType: "Verb",
            description:
                "A word meaning to run or move swiftly. Also can be used as a noun to refer to a short, quick stroke or movement.",
            language: "English",
        },
        {
            word: "Nimbus",
            wordType: "Adjective",
            description:
                "A word meaning dark or gloomy. Can also be used to refer to a cloud that surrounds the peak of a mountain, especially a volcano.",
            language: "Latin",
        },
        {
            word: "Battle",
            wordType: "Noun",
            description:
                "A word meaning a fight or contest between two or more persons or groups.",
            language: "Old English",
        },
        {
            word: "Sprint",
            wordType: "Verb",
            description:
                "A word meaning a short, quick run. Can also be used to refer to a rapid increase in speed or activity.",
            language: "English",
        },
    ],
};

// fetch json data
// async function fetchJsonData(path) {
//     try {
//         // Fetch the JSON file
//         const response = await fetch(path);

//         // Check if the response is successful
//         if (!response.ok) {
//             throw new Error("Network response was not ok");
//         }

//         // Parse the JSON
//         const data = await response.json();

//         // Work with the JSON data here
//         console.log(data); // Print the data to the console
//         console.log(data.propertyName);
//         data.arrayName.forEach((item) => {
//             console.log(item);
//         });
//     } catch (error) {
//         // Handle any errors that occur during fetch
//         console.error("There was a problem with the fetch operation:", error);
//     }
// }

//Function to convert JSON to CSV
function jsonToCSV(jsonObject) {
    const keys = Object.keys(jsonObject.words[0]);
    const rows = jsonObject.words.map((row) => {
        return keys
            .map((key) => {
                return `"${row[key]}"`;
            })
            .join(";;");
    });

    const csv = `${keys.join(";;")}\n${rows.join("\n")}`;
    return csv;
}

const parseData = () => {
    //Get the JSON data and process it
    const jsonData = `${JSON.stringify(data)}`;
    const csv = jsonToCSV(JSON.parse(jsonData));
    return csv;
};

//Function to download the CSV file
function downloadCSV() {
    csv = parseData();
    const element = document.createElement("a");
    element.setAttribute(
        "href",
        "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
    );
    element.setAttribute("download", "words.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

//Function to read and display the CSV data
function readAndDisplayCSV() {
    const csvData = [];
    const csvFile = new FileReader();
    csvFile.readAsText(document.getElementById("csvFile").files[0]);
    csvFile.onload = function (event) {
        const csvText = event.target.result;
        const rows = csvText.split("\n");
        const keys = rows[0].trim().split(";;");
        rows.forEach((row) => {
            const cells = row.split(";;");
            const wordObj = {};
            cells.forEach((cell, index) => {
                wordObj[keys[index]] = cell.replace(/^"|"$/g, "");
            });
            csvData.push(wordObj);
        });
        console.log(csvData);
        //You can also display the data in HTML table or any other way you like
    };
}

//Call the function to read and display the CSV data after the file is uploaded

const setupDocument = () => {
    document
        .getElementById("downloadBtn")
        .addEventListener("click", downloadCSV);
    document
        .getElementById("btnReadCSV")
        .addEventListener("click", readAndDisplayCSV);
};

window.onload = setupDocument;
