import {
  getAllCustomers,
  getAllAppointments,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  validateCustomer,
} from "../model/customerModel.js";

let foreignKeyInterval;

$(document).ready(function () {
  loadAllCustomers(getAllCustomers());
  loadAppointmentIDs();
  startForeignKeyLoad();

  $("#cus-app-id").on("change", function () {
    stopForeignKeyLoad();
    setTimeout(startForeignKeyLoad, 20000);
  });
});

function generateCustomerID() {
  let lastID = $("#cus-id").val();

  if (!lastID) {
    lastID = "C000";
  }

  let newID = "C" + (parseInt(lastID.slice(1)) + 1).toString().padStart(3, "0");
  localStorage.setItem("lastCusID", newID);
  return newID;
}

function setCustomerID() {
  const newID = generateCustomerID();
  $("#cus-id").val(newID);
}

function loadAllCustomers(customers) {
  const tbody = $("#cus-tbl");

  customers.forEach((customer) => {
    const row = `<tr>
      <td>${customer.cusId}</td>
      <td>${customer.appId}</td>
      <td>${customer.cusName}</td>
      <td>${customer.address}</td>
      <td>${customer.cusMobile}</td>
      <td>${customer.cusEmail}</td>
    </tr>`;
    tbody.append(row);
  });
}

function loadAppointmentIDs() {
  const appointments = getAllAppointments();
  const selectElement = $("#cus-app-id");

  selectElement.empty();
  selectElement.append('<option value="">Appointment ID</option>');

  appointments.forEach((appointment) => {
    const option = `<option value="${appointment.appId}">${appointment.appId}</option>`;
    selectElement.append(option);
  });
}

function reloadTable(customerArray) {
  $("#cus-tbl").append(
    "<tr>" +
      "<td>" +
      customerArray[0] +
      "</td>" +
      "<td>" +
      customerArray[1] +
      "</td>" +
      "<td>" +
      customerArray[2] +
      "</td>" +
      "<td>" +
      customerArray[3] +
      "</td>" +
      "<td>" +
      customerArray[4] +
      "</td>" +
      "<td>" +
      customerArray[5] +
      "</td>" +
      "</tr>"
  );
}

function updateTable(index, updatedCustomer) {
  const tableBody = $("#cus-tbl");
  const row = tableBody.find("tr").eq(index);

  row.find("td").eq(0).text(updatedCustomer.cusId);
  row.find("td").eq(1).text(updatedCustomer.appId);
  row.find("td").eq(2).text(updatedCustomer.name);
  row.find("td").eq(3).text(updatedCustomer.address);
  row.find("td").eq(4).text(updatedCustomer.mobile);
  row.find("td").eq(5).text(updatedCustomer.email);
}

$("#cus-add").click(function () {
  const customerArray = [
    $("#cus-id").val(),
    $("#cus-app-id").val(),
    $("#cus-name").val(),
    $("#cus-address").val(),
    $("#cus-mobile").val(),
    $("#cus-email").val(),
  ];

  const [cusId, appId, cusName, cusAddress, cusMobile, cusEmail] =
    customerArray;

  if (checkValidation()) {
    addCustomer(cusId, appId, cusName, cusAddress, cusMobile, cusEmail);
    reloadTable(customerArray);
    setCustomerID();
    swal("Confirmation!", "New Customer Added Successful!", "success");
  }
});

$("#cus-update").click(function () {
  const cusId = $("#cus-id").val();

  const index = getAllCustomers().findIndex(
    (customer) => customer.cusId === cusId
  );

  if (index !== -1) {
    const updatedCustomer = {
      cusId: cusId,
      appId: $("#cus-app-id").val(),
      name: $("#cus-name").val(),
      address: $("cus-address").val(),
      mobile: $("#cus-mobile").val(),
      email: $("#cus-email").val(),
    };

    if (checkValidation()) {
      swal({
        title: "Are you sure?",
        text: "Do you want to update this customer details!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willUpdate) => {
        if (willUpdate) {
          updateCustomer(index, updatedCustomer);
          updateTable(index, updatedCustomer);
          swal("Confirmation! Your customer details has been updated!", {
            icon: "success",
          });
        }
      });
    }
  } else {
    swal("Information!", "Customer Not Found!", "info");
  }
});

$("#cus-search").click(function () {
  const cusId = $("#cus-id").val();

  const index = getAllCustomers().findIndex(
    (customer) => customer.cusId === cusId
  );

  if (index !== -1) {
    const customer = getAllCustomers()[index];
    $("#cus-app-id").val(customer.appId.trim());
    $("#cus-name").val(customer.cusName.trim());
    $("#cus-address").val(customer.address.trim());
    $("#cus-mobile").val(customer.cusMobile.trim());
    $("#cus-email").val(customer.cusEmail.trim());
    stopForeignKeyLoad();
    setTimeout(startForeignKeyLoad, 20000);
  } else {
    swal("Information!", "Customer Not Found!", "info");
  }
});

$("#cus-delete").click(function () {
  const cusId = $("#cus-id").val();

  const index = getAllCustomers().findIndex(
    (customer) => customer.cusId === cusId
  );

  if (index !== -1) {
    swal({
      title: "Are you sure?",
      text: "Do you want to delete this customer!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteCustomer(index);
        const tbody = $("#cus-tbl");
        tbody.empty();
        loadAllCustomers(getAllCustomers());
        swal("Confirmation! Your customer has been deleted!", {
          icon: "success",
        });
      }
    });
  } else {
    swal("Information!", "Customer Not Found!", "info");
  }
});

function checkValidation() {
  const customer = {
    cusId: $("#cus-id").val(),
    appId: $("#cus-app-id").val(),
    cusName: $("#cus-name").val(),
    cusAddress: $("#cus-address").val(),
    cusMobile: $("#cus-mobile").val(),
    cusEmail: $("#cus-email").val(),
  };

  return validateCustomer(customer);
}

function startForeignKeyLoad() {
  foreignKeyInterval = setInterval(loadAppointmentIDs, 1000);
}

function stopForeignKeyLoad() {
  clearInterval(foreignKeyInterval);
}
