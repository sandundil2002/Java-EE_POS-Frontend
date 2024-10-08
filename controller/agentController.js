import {
  getAllAgents,
  addAgent,
  updateAgent,
  deleteAgent,
  validateAgent,
} from "../model/agentModel.js";

$(document).ready(async function () {
  const { agents, adminIds } = await getAllAgents();
  loadAllAgents(agents);
  loadAdminIds(adminIds);
  setAgentID();
});

function generateAgentID() {
  const tbody = $("#age-tbl");
  const rows = tbody.find("tr");
  let lastID = "S000";

  rows.each(function () {
    const idCell = $(this).find("td").eq(0).text();
    if (idCell.startsWith("S")) {
      const currentID = idCell.slice(1);
      if (parseInt(currentID) > parseInt(lastID.slice(1))) {
        lastID = idCell;
      }
    }
  });

  let newID = "S" + (parseInt(lastID.slice(1)) + 1).toString().padStart(3, "0");
  return newID;
}

function setAgentID() {
  const newID = generateAgentID();
  $("#age-id").val(newID);
}

function loadAllAgents(agents) {
  const tbody = $("#age-tbl");
  tbody.empty();

  agents.forEach((agent) => {
    const row = `<tr>
      <td>${agent.supId}</td>
      <td>${agent.admId}</td>
      <td>${agent.name}</td>
      <td>${agent.address}</td>
      <td>${agent.mobile}</td>
      <td>${agent.email}</td>
    </tr>`;
    tbody.append(row);
  });
}

function loadAdminIds(adminIds) {
  const adminIdSelect = $("#age-adm-id");

  adminIds.forEach((adminId) => {
    const option = `<option value="${adminId}">${adminId}</option>`;
    adminIdSelect.append(option);
  });
}

function reloadTable(agentArray) {
  $("#age-tbl").append(
    "<tr>" +
      "<td>" +
      agentArray[0] +
      "</td>" +
      "<td>" +
      agentArray[1] +
      "</td>" +
      "<td>" +
      agentArray[2] +
      "</td>" +
      "<td>" +
      agentArray[3] +
      "</td>" +
      "<td>" +
      agentArray[4] +
      "</td>" +
      "<td>" +
      agentArray[5] +
      "</td>" +
      "</tr>"
  );
}

$("#age-add").click(async function () {
  const agentArray = [
    $("#age-id").val(),
    $("#age-adm-id").val(),
    $("#age-name").val(),
    $("#age-address").val(),
    $("#age-mobile").val(),
    $("#age-email").val(),
  ];

  const [supId, admId, name, address, mobile, email] = agentArray;

  if (checkValidation()) {
    await addAgent(supId, admId, name, address, mobile, email);
    reloadTable(agentArray);
    setAgentID();
    swal("Confirmation!", "New Supplier Added Successful!", "success");
  } 
});

$("#age-update").click(async function () {
  const supId = $("#age-id").val();
  const { suppliers } = await getAllAgents();

  const index = suppliers.findIndex((agent) => agent.supId === supId);

  if (index !== -1) {
    const updatedAgent = {
      supId: supId,
      admId: $("#age-adm-id").val(),
      name: $("#age-name").val(),
      address: $("age-address").val(),
      mobile: $("#age-mobile").val(),
      email: $("#age-email").val(),
    };

    if (checkValidation()) {
      swal({
        title: "Are you sure?",
        text: "Do you want to update this supplier details!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willUpdate) => {
        if (willUpdate) {
          await updateAgent(index, updatedAgent);
          swal("Confirmation! Your supplier details has been updated!", {
            icon: "success",
          });
        }
      });
    } else {
      swal("Information!", "Supplier Not Found!", "info");
    }
  }
});

$("#age-search").click(async function () {
  const supId = $("#age-id").val();
  const { agents } = await getAllAgents();

  const index = agents.findIndex((agent) => agent.supId === supId);

  if (index !== -1) {
    const agent = agents[index];
    $("#age-adm-id").val(agent.admId);
    $("#age-name").val(agent.name);
    $("#age-address").val(agent.address);
    $("#age-mobile").val(agent.mobile);
    $("#age-email").val(agent.email);
  } else {
    swal("Information!", "Supplier Not Found!", "info");
  }
});

$("#age-delete").click(async function () {
  const supId = $("#age-id").val();
  const { agents } = await getAllAgents();

  const index = agents.findIndex((agent) => agent.supId === supId);

  if (index !== -1) {
    swal({
      title: "Are you sure?",
      text: "Do you want to delete this supplier!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await deleteAgent(supId);
        const { agents } = await getAllAgents();
        loadAllAgents(agents);
        swal("Confirmation! Your supplier has been deleted!", {
          icon: "success",
        });
      }
    });
  } else {
    swal("Information!", "Supplier Not Found!", "info");
  }
});

function checkValidation() {
  const agent = {
    ageId: $("#age-id").val(),
    admId: $("#age-adm-id").val(),
    ageName: $("#age-name").val(),
    ageAddress: $("#age-address").val(),
    ageMobile: $("#age-mobile").val(),
    ageEmail: $("#age-email").val(),
  };

  return validateAgent(agent);
}
