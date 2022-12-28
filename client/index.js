document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:5000/getAll")
        .then((response) => response.json())
        .then((data) => loadHTMLTable(data["data"]));
});

const addBtn = document.querySelector("#add-name-btn");

document
    .querySelector("table tbody")
    .addEventListener("click", function (event) {
        if (event.target.className === "delete-row-btn") {
            deleteRowById(event.target.dataset.id);
        }
        if (event.target.className === "edit-row-btn") {
            handleEditRow(event.target.dataset.id);
        }
    });

const updateBtn = document.querySelector("#update-row-btn");

updateBtn.onclick = function () {
    const updateNameInput = document.querySelector("#update-name-input");

    fetch("http://localhost:5000/update", {
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            id: updateNameInput.dataset.id,
            name: updateNameInput.value,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                location.reload();
            }
        });
};

function deleteRowById(id) {
    fetch("http://localhost:5000/delete/" + id, { method: "DELETE" })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                location.reload();
            }
        });
}

addBtn.onclick = function () {
    const nameInput = document.querySelector("#name-input");
    const name = nameInput.value;
    nameInput.value = "";

    fetch("http://localhost:5000/insert", {
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ name: name }),
        method: "POST",
    })
        .then((response) => response.json())
        .then((data) => insertRowIntoTable(data["data"]));
};

function insertRowIntoTable(data) {
    const table = document.querySelector("table tbody");
    const isTableData = table.querySelector(".no-data");

    let tableHtml = "<tr>";

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            tableHtml += `<td>${data[key]}</td>`;
        }
    }

    tableHtml += `
            <td>description</td>
            <td>dueDate</td>
            <td>project</td>
            <td>priority</td>
            <td><button class="delete-row-btn" data-id="${data.id}">Delete</button></td>
            <td><button class="edit-row-btn" data-id="${data.id}">Edit</button></td>
        `;

    tableHtml += "</tr>";

    if (isTableData) {
        table.innerHTML = tableHtml;
    } else {
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

function loadHTMLTable(data) {
    const table = document.querySelector("table tbody");

    if (data.length === 0) {
        table.innerHTML =
            "<tr><td class='no-data' colspan='8'>No Data</td></tr>";
    }

    let tableHtml = "";

    data.forEach(function ({ id, name }) {
        tableHtml += `
            <tr>
                <td>${id}</td>
                <td>${name}</td>
                <td>description</td>
                <td>dueDate</td>
                <td>project</td>
                <td>priority</td>
                <td><button class="delete-row-btn" data-id="${id}">Delete</button></td>
                <td><button class="edit-row-btn" data-id="${id}">Edit</button></td>
            </tr>
        `;
    });

    table.innerHTML = tableHtml;
}

function handleEditRow(id) {
    const updateSection = document.querySelector("#update-row");
    updateSection.hidden = false;
    document.querySelector("#update-name-input").dataset.id = id;
}
