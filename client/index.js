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
const searchBtn = document.querySelector("#search-btn");

searchBtn.onclick = function () {
    const searchValue = document.querySelector("#search-input").value;

    fetch("http://localhost:5000/search/" + searchValue)
        .then((response) => response.json())
        .then((data) => loadHTMLTable(data["data"]));
};

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
    const descriptionInput = document.querySelector("#description-input");
    const description = descriptionInput.value;
    const dueDateInput = document.querySelector("#due-date-input");
    const dueDate = dueDateInput.value;
    const projectSelect = document.querySelector("#project-input");
    const project = projectSelect.value;
    const prioritySelect = document.querySelector("#priority-input");
    const priority = prioritySelect.value;
    nameInput.value = "";
    descriptionInput.value = "";
    dueDateInput.value = "";
    projectSelect.value = "";
    prioritySelect.value = "";
    console.log(name, description, dueDate, project, priority);
    fetch("http://localhost:5000/insert", {
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            description: description,
            dueDate: dueDate,
            project: project,
            priority: priority,
        }),
        method: "POST",
    })
        .then((response) => response.json())
        .then((data) => insertRowIntoTable(data["data"]));
};

function insertRowIntoTable(data) {
    const table = document.querySelector("table tbody");
    const isTableData = table.querySelector(".no-data");

    let tableHtml = "<tr>";

    // for (const key in data) {
    //     if (data.hasOwnProperty(key)) {
    //         tableHtml += `<td>${data[key]}</td>`;
    //     }
    // }

    tableHtml += `
            <td>${data.name}</td>
            <td>${data.description}</td>
            <td>${data.dueDate}</td>
            <td>${data.project}</td>
            <td>${data.priority}</td>
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
            "<tr><td class='no-data' colspan='7'>No Data</td></tr>";
    } else {
        let tableHtml = "";

        data.forEach(function ({ id, name }) {
            tableHtml += `
            <tr>
                <td>${name}</td>
                <td>${data.description}</td>
                <td>${data.dueDate}</td>
                <td>${data.project}</td>
                <td>${data.priority}</td>
                <td><button class="delete-row-btn" data-id="${id}">Delete</button></td>
                <td><button class="edit-row-btn" data-id="${id}">Edit</button></td>
            </tr>
        `;
        });
        // <td>${id}</td>
        table.innerHTML = tableHtml;
    }
}

function handleEditRow(id) {
    const updateSection = document.querySelector("#update-row");
    updateSection.hidden = false;
    document.querySelector("#update-name-input").dataset.id = id;
}
