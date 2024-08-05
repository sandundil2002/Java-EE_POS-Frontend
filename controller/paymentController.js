import {
  getAllProperties,
  getAllCustomers,
  getAllApointments,
  addPayment,
  updatePropertyStatus,
  updateAppointmentStatus,
  findAppointmentIdByCustomerName,
} from "../model/paymentModel.js";

let proForeignKeyInterval;
let cusForeignKeyInterval;

$(document).ready(function () {
  setLocalDateTime();
  startForeignKeyLoad();
  setTimeout(setLocalDateTime(), 60000);

  $("#pay-pro-id").on("change", function () {
    stopForeignKeyLoad();
    setTimeout(startForeignKeyLoad, 20000);
  });

  $("#pay-cus-id").on("change", function () {
    stopForeignKeyLoad();
    setTimeout(startForeignKeyLoad, 20000);
  });
});

function setLocalDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

  document.getElementById("pay-date").value = formattedDateTime;
}

function generatePaymentID() {
  let lastID = $("#pay-id").val();
  let numericPart = parseInt(lastID.slice(1));
  let newID = "O" + (numericPart + 1).toString().padStart(3, "0");
  return newID;
}

function setPaymentID() {
  const bug = 1;
  if (bug === 1) {
    const newID = generatePaymentID();
    $("#pay-id").val(newID);
    bug = 0;
    return;
  }
}

function loadPropertyIDs() {
  const properties = getAllProperties();
  const selectElement = $("#pay-pro-id");
  const priceInputElement = $("#pay-pro-price");

  selectElement.empty();
  selectElement.append('<option value="">Property ID</option>');

  properties.forEach((property) => {
    const option = `<option value="${property.proId}" data-price="${property.price}" data-type="${property.type}" data-perches="${property.perches}" data-address="${property.proAddress}">${property.proId}</option>`;
    selectElement.append(option);
  });

  selectElement.change(function () {
    const selectedOption = $(this).find("option:selected");
    const propertyPrice = selectedOption.data("price");
    priceInputElement.val(propertyPrice);
  });

  $("#pay-btn").click(function (event) {
    event.preventDefault();
    const selectedOption = $("#pay-pro-id option:selected");
    const propertyPrice = selectedOption.data("price");
    const propertyType = selectedOption.data("type");
    const propertyPerches = selectedOption.data("perches");
    const propertyAddress = selectedOption.data("address");
    const proId = selectedOption.val();

    const proPrice = $("#pay-pro-price").val();
    const cusName = $("#pay-cus-name").val();
    const payId = $("#pay-id").val();
    const payMethod = $("#payment-method").val();

    const currentDate = new Date();
    const date = currentDate.toLocaleDateString();
    const time = currentDate.toLocaleTimeString();

    if (proPrice.trim() === "") {
      swal("Information!", "Please fill the property field!", "warning");
      return;
    } else if (cusName.trim() === "") {
      swal("Information!", "Please fill the customer field!", "warning");
      return;
    } else if (payId.trim() === "") {
      swal("Information!", "Invalid Payment ID!", "warning");
      return;
    } else if (payMethod.trim() === "") {
      swal("Information!", "Please fill the payment method!", "warning");
      return;
    } else {
      swal({
        title: "Are you sure?",
        text: "Do you want to sell this property!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willTrue) => {
        if (willTrue) {
          swal("Confirmation! Property sell succesfull!", {
            icon: "success",
          });
          priceInputElement.val(propertyPrice);
          $("#bill-cus-name").html("Customer Name - " + cusName);
          $("#bill-pro-type").html("Property Type - " + propertyType);
          $("#bill-pro-perches").html("Property Perches - " + propertyPerches);
          $("#bill-pro-address").html("Property Address - " + propertyAddress);
          $("#bill-pay-id").html("Purchase ID - " + payId);
          $("#bill-pay-method").html("Payment Method - " + payMethod);
          $("#bill-pay-date").html("Date - " + date);
          $("#bill-pay-time").html("Time - " + time);

          const tax = propertyPrice * 0.05;
          const total = propertyPrice + tax;

          $("#bill-tbl-price").html("LKR : " + propertyPrice);
          $("#bill-tbl-tax").html("LKR : " + tax);
          $("#bill-tbl-total").html("LKR : " + total);

          const payment = {
            payId: payId,
            cusName: cusName,
            proId: proId,
            payMethod: payMethod,
            date: date,
            time: time,
            total: total,
          };

          addPayment(payment);

          updatePropertyStatus(proId, "Not Available");
          reloadPropertyTable(getAllProperties());
          updateAppointmentStatus(
            findAppointmentIdByCustomerName(cusName),
            "Completed"
          );
          reloadAppointmentsTable(getAllApointments());
          setPaymentID();
        }
      });
    }
  });
}

function reloadPropertyTable(properties) {
  const tbody = $("#pro-tbl");
  tbody.empty();
  properties.forEach((properties) => {
    const row = `<tr>
      <td>${properties.proId}</td>
      <td>${properties.ageId}</td>
      <td>${properties.type}</td>
      <td>${properties.proAddress}</td>
      <td>${properties.price}</td>
      <td>${properties.perches}</td>
      <td>${properties.status}</td>
    </tr>`;
    tbody.append(row);
  });
}

function reloadAppointmentsTable(appointments) {
  const tbody = $("#app-tbl");
  tbody.empty();

  appointments.forEach((appointment) => {
    const row = `<tr>
          <td>${appointment.appId}</td>
          <td>${appointment.adminId}</td>
          <td>${appointment.name}</td>
          <td>${appointment.mobile}</td>
          <td>${appointment.dateTime}</td>
          <td>
            <select class="status-combo" data-id="${appointment.appId}">
              <option value="Pending" class="pending" ${
                appointment.status === "Pending" ? "selected" : ""
              }>Pending</option>
              <option value="Complete" class="complete"${
                appointment.status === "Confirmed" ? "selected" : ""
              }>Confirmed</option>
              <option value="Cancel" class="cancel"${
                appointment.status === "Completed" ? "selected" : ""
              }>Completed</option>
            </select>
          </td>
        </tr>`;
    tbody.append(row);
  });
}

function loadCustomerIDs() {
  const customers = getAllCustomers();
  const selectElement = $("#pay-cus-id");
  const cusInputElement = $("#pay-cus-name");

  selectElement.empty();
  selectElement.append('<option value="">Customer ID</option>');

  customers.forEach((customer) => {
    const option = `<option value="${customer.cusId}" data-name="${customer.cusName}"> ${customer.cusId}</option>`;
    selectElement.append(option);
  });

  selectElement.change(function () {
    const selectedOption = $(this).find("option:selected");
    const customerName = selectedOption.data("name");
    cusInputElement.val(customerName);
  });
}

function startForeignKeyLoad() {
  proForeignKeyInterval = setInterval(loadPropertyIDs, 1000);
  cusForeignKeyInterval = setInterval(loadCustomerIDs, 1000);
}

function stopForeignKeyLoad() {
  clearInterval(proForeignKeyInterval);
  clearInterval(cusForeignKeyInterval);
}

$("#clear-btn").click(function () {
  swal({
    title: "Are you sure?",
    text: "Do you want to clear the input fields?",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  }).then((willClear) => {
    if (willClear) {
      $("#pay-pro-id").val("");
      $("#pay-pro-price").val("");
      $("#pay-cus-id").val("");
      $("#pay-cus-name").val("");
      $("#payment-method").val("");
      swal("Confirmation!", "You cleared the input fields!", "success", {
        icon: "success",
      });
    }
  });
});
