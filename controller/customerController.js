import {
  getAllCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  validateCustomer,
} from "../model/customerModel.js";

$(document).ready(async function () {
  const { customers, appointmentIds } = await getAllCustomers();
  loadAllCustomers(customers);
  loadAllAppointmentIds(appointmentIds);
  console.log(appointmentIds);
  setCustomerID();
});

function generateCustomerID() {
  const tbody = $("#cus-tbl");
  const rows = tbody.find("tr");
  let lastID = "C000";

  rows.each(function () {
    const idCell = $(this).find("td").eq(0).text();
    if (idCell.startsWith("C")) {
      const currentID = idCell.slice(1);
      if (parseInt(currentID) > parseInt(lastID.slice(1))) {
        lastID = idCell;
      }
    }
  });

  let newID = "C" + (parseInt(lastID.slice(1)) + 1).toString().padStart(3, "0");
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
      <td>${customer.name}</td>
      <td>${customer.address}</td>
      <td>${customer.mobile}</td>
      <td>${customer.email}</td>
    </tr>`;
    tbody.append(row);
  });
}

function loadAllAppointmentIds(appointmentIds) {
  const appointmentIdSelect = $("#cus-app-id");

  appointmentIds.forEach((appointmentId) => {
    const option = `<option value="${appointmentId}">${appointmentId}</option>`;
    appointmentIdSelect.append(option);
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

$("#cus-add").click(async function () {
  const customerArray = [
    $("#cus-id").val(),
    $("#cus-app-id").val(),
    $("#cus-name").val(),
    $("#cus-address").val(),
    $("#cus-mobile").val(),
    $("#cus-email").val(),
  ];

  const [cusId, appId, cusName, cusAddress, cusMobile, cusEmail] = customerArray;

  if (checkValidation()) {
    await addCustomer(cusId, appId, cusName, cusAddress, cusMobile, cusEmail);
    reloadTable(customerArray);
    setCustomerID();
    swal("Confirmation!", "New Customer Added Successful!", "success");
  }
});

$("#cus-update").click(async function () {
  const cusId = $("#cus-id").val();
  const { customers } = await getAllCustomers();

  const index = customers.findIndex(
    (customer) => customer.cusId === cusId
  );

  if (index !== -1) {    
    const updatedCustomer = {
      cusId: cusId,
      appId: $("#cus-app-id").val(),
      name: $("#cus-name").val(),
      address: $("#cus-address").val(),
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
      }).then(async (willUpdate) => {
        if (willUpdate) {
          await updateCustomer(cusId, updatedCustomer);
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
    name: $("#cus-name").val(),
    address: $("#cus-address").val(),
    mobile: $("#cus-mobile").val(),
    email: $("#cus-email").val(),
  };

  return validateCustomer(customer);
}