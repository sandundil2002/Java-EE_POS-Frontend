import {
  addAppointment,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
  validateAppointment,
} from "../model/appointmentModel.js";

$(document).ready(async function () {
  const data = await getAllAppointments();
  loadAllAppointments(data.appointments);
  loadAdminIds(data.adminIds);
  setAppointmentID();
});

function generateAppointmentID() {
  const tbody = $("#app-tbl");
  const rows = tbody.find("tr");
  let lastID = "A000";

  rows.each(function () {
    const idCell = $(this).find("td").eq(0).text();
    if (idCell.startsWith("A")) {
      const currentID = idCell.slice(1);
      if (parseInt(currentID) > parseInt(lastID.slice(1))) {
        lastID = idCell;
      }
    }
  });

  let newID = "A" + (parseInt(lastID.slice(1)) + 1).toString().padStart(3, "0");
  return newID;
}

function setAppointmentID() {
  const newID = generateAppointmentID();
  $("#app-id").val(newID);
}

function loadAllAppointments(appointments) {
  const tbody = $("#app-tbl");

  appointments.forEach((appointment) => {
    const row = `<tr>
      <td>${appointment.appId}</td>
      <td>${appointment.admId}</td>
      <td>${appointment.cusName}</td>
      <td>${appointment.cusMobile}</td>
      <td>${appointment.dateTime}</td>
      <td>
        <select name="Status" class="status-combo">
          <option value="pending" class="pending">Pending</option>
          <option value="complete" class="complete">Complete</option>
          <option value="cancel" class="cancel">Cancel</option>
        </select>
      </td>
    </tr>`;
    tbody.append(row);
  });
}

function loadAdminIds(adminIds) {
  const adminIdSelect = $("#app-admin-id");

  adminIds.forEach((adminId) => {
    const option = `<option value="${adminId}">${adminId}</option>`;
    adminIdSelect.append(option);
  });
}

function reloadTable(appointmentArray) {
  $("#app-tbl").append(
    "<tr>" +
      "<td>" +
      appointmentArray[0] +
      "</td>" +
      "<td>" +
      appointmentArray[1] +
      "</td>" +
      "<td>" +
      appointmentArray[2] +
      "</td>" +
      "<td>" +
      appointmentArray[3] +
      "</td>" +
      "<td>" +
      appointmentArray[4] +
      "</td>" +
      "<td>" +
      '<select name="Status" class="status-combo">' +
      '<option value="pending" class="pending">Pending</option>' +
      '<option value="complete" class="complete">Complete</option>' +
      '<option value="cancel" class="cancel">Cancel</option>' +
      "</select>" +
      "</td>" +
      "</tr>"
  );
}

$("#appo-add").click(async function () {
  const appointmentArray = [
    $("#app-id").val(),
    $("#app-admin-id").val(),
    $("#app-cus-name").val(),
    $("#app-cus-mobile").val(),
    $("#app-date-time").val(),
  ];

  const [appId, admId, cusName, cusMobile, dateTime] = appointmentArray;

  if (checkValidation()) {
    await addAppointment(appId, admId, cusName, cusMobile, dateTime);
    reloadTable(appointmentArray);
    setAppointmentID();
    swal("Confirmation!", "New Appointment Added Successful!", "success");
  }
});

$("#appo-update").click(async function () {
  const appId = $("#app-id").val();

  const index = (await getAllAppointments()).findIndex(
    (appointment) => appointment.appId === appId
  );

  if (index !== -1) {
    const updatedAppointment = {
      appId: appId,
      admId: $("#app-admin-id").val(),
      cusName: $("#app-cus-name").val(),
      cusMobile: $("#app-cus-mobile").val(),
      dateTime: $("#app-date-time").val(),
    };

    if (checkValidation()) {
      swal({
        title: "Are you sure?",
        text: "Do you want to update this appointment details!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willUpdate) => {
        if (willUpdate) {
          await updateAppointment(appId, updatedAppointment);
          swal("Confirmation! Your appointment details have been updated!", {
            icon: "success",
          });
        }
      });
    }
  } else {
    swal("Information!", "Appointment Not Found!", "info");
  }
});

$("#appo-search").click(async function () {
  const appId = $("#app-id").val();

  const index = (await getAllAppointments()).findIndex(
    (appointment) => appointment.appId === appId
  );

  if (index !== -1) {
    const appointment = (await getAllAppointments())[index];
    $("#app-admin-id").val(appointment.admId);
    $("#app-cus-name").val(appointment.cusName);
    $("#app-cus-mobile").val(appointment.cusMobile);
    $("#app-date-time").val(appointment.dateTime);
  } else {
    swal("Information!", "Appointment Not Found!", "info");
  }
});

$("#appo-delete").click(async function () {
  const appId = $("#app-id").val();

  const index = (await getAllAppointments()).findIndex(
    (appointment) => appointment.appId === appId
  );

  if (index !== -1) {
    swal({
      title: "Are you sure?",
      text: "Do you want to delete this appointment!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        await deleteAppointment(appId);
        const tbody = $("#app-tbl");
        tbody.empty();
        const appointments = await getAllAppointments();
        loadAllAppointments(appointments);
        swal("Confirmation! Your appointment has been deleted!", {
          icon: "success",
        });
      }
    });
  } else {
    swal("Information!", "Appointment Not Found!", "info");
  }
});

function checkValidation() {
  const appointment = {
    appId: $("#app-id").val(),
    admId: $("#app-admin-id").val(),
    cusName: $("#app-cus-name").val(),
    cusMobile: $("#app-cus-mobile").val(),
    dateTime: $("#app-date-time").val(),
  };

  return validateAppointment(appointment);
}
