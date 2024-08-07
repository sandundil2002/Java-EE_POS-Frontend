import { getAllPaymentDetails } from "../model/paymentModel.js";

$(document).ready(async function () {
  setLocalDateTime();
  setTimeout(setLocalDateTime(), 60000);
  const { customers, paymentId, properties } = await getAllPaymentDetails();
  setPaymentID(paymentId);
  loadPropertyIDs(properties);
  loadCustomerIDs(customers);
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

function setPaymentID(paymentId) {
  $("#pay-id").val(paymentId);
}

function loadPropertyIDs(properties) {
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
        }
      });
    }
  });
}

function loadCustomerIDs(customers) {
  const selectElement = $("#pay-cus-id");
  const cusInputElement = $("#pay-cus-name");

  selectElement.empty();
  selectElement.append('<option value="">Customer ID</option>');

  customers.forEach((customer) => {
    const option = `<option value="${customer.cusId}" data-name="${customer.name}"> ${customer.cusId}</option>`;
    selectElement.append(option);
  });

  selectElement.change(function () {
    const selectedOption = $(this).find("option:selected");
    const customerName = selectedOption.data("name");
    cusInputElement.val(customerName);
  });
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
