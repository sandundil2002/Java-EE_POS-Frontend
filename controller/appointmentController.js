import {
  addAppointment,
  getAllAppointments,
  updateAppointment,
  deleteAppointment,
  validateAppointment,
} from "../model/appointmentModel.js";

$(document).ready(async function () {
  const appointments = await getAllAppointments();
  loadAllAppointments(appointments);
});

function generateAppointmentID() {
  let lastID = $("#app-id").val();

  if (!lastID) {
    lastID = "A000";
  }

  let newID = "A" + (parseInt(lastID.slice(1)) + 1).toString().padStart(3, "0");
  localStorage.setItem("lastAppID", newID);
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
  console.log(appointmentArray);

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
          updateTable(index, updatedAppointment);
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

function updateTable(index, updatedAppointment) {
  const tableBody = $("#app-tbl");
  const row = tableBody.find("tr").eq(index);

  row.find("td").eq(0).text(updatedAppointment.appId);
  row.find("td").eq(1).text(updatedAppointment.adminId);
  row.find("td").eq(2).text(updatedAppointment.name);
  row.find("td").eq(3).text(updatedAppointment.mobile);
  row.find("td").eq(4).text(updatedAppointment.dateTime);
}

$("#appo-search").click(function () {
  const appId = $("#app-id").val();

  const index = getAllAppointments().findIndex(
    (appointment) => appointment.appId === appId
  );

  if (index !== -1) {
    const appointment = getAllAppointments()[index];
    $("#app-admin-id").val(appointment.adminId);
    $("#app-cus-name").val(appointment.name);
    $("#app-cus-mobile").val(appointment.mobile);
    $("#app-date-time").val(appointment.dateTime);
  } else {
    swal("Information!", "Appointment Not Found!", "info");
  }
});

$("#appo-delete").click(function () {
  const appId = $("#app-id").val();

  const index = getAllAppointments().findIndex(
    (appointment) => appointment.appId === appId
  );

  if (index !== -1) {
    swal({
      title: "Are you sure?",
      text: "Do you want to delete this appointment!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteAppointment(index);
        const tbody = $("#app-tbl");
        tbody.empty();
        loadAllAppointments(getAllAppointments());
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
