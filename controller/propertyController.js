import {
  getAllProperties,
  addProperty,
  updateProperty,
  deleteProperty,
  validateProperty,
} from "../model/PropertyModel.js";

$(document).ready(async function () {
  const { properties, supplierIds } = await getAllProperties();
  loadAllProperties(properties);
  loadAgentsIDs(supplierIds);
  console.log("properties", properties);
  console.log("supplierIds", supplierIds);
  setPropertyID();
});

function generatePropertyID() {
  const tbody = $("#pro-tbl");
  const rows = tbody.find("tr");
  let lastID = "P000";

  rows.each(function () {
    const idCell = $(this).find("td").eq(0).text();
    if (idCell.startsWith("P")) {
      const currentID = idCell.slice(1);
      if (parseInt(currentID) > parseInt(lastID.slice(1))) {
        lastID = idCell;
      }
    }
  });

  let newID = "P" + (parseInt(lastID.slice(1)) + 1).toString().padStart(3, "0");
  return newID;
}

function setPropertyID() {
  const newID = generatePropertyID();
  $("#pro-id").val(newID);
}

function loadAgentsIDs(supplierIds) {
  const supIdSelect = $("#pro-age-id");

  supplierIds.forEach((supplierId) => {
    const option = `<option value="${supplierId}">${supplierId}</option>`;
    supIdSelect.append(option);
  });
}

function loadAllProperties(properties) {
  const tbody = $("#pro-tbl");
  tbody.empty();

  properties.forEach((properties) => {
    const row = `<tr>
      <td>${properties.proId}</td>
      <td>${properties.ageId}</td>
      <td>${properties.type}</td>
      <td>${properties.address}</td>
      <td>${properties.price}</td>
      <td>${properties.perches}</td>
      <td>${properties.status}</td>
    </tr>`;
    tbody.append(row);
  });
}

function reloadTable(propertyArray) {
  $("#pro-tbl").append(
    "<tr>" +
      "<td>" +
      propertyArray[0] +
      "</td>" +
      "<td>" +
      propertyArray[1] +
      "</td>" +
      "<td>" +
      propertyArray[2] +
      "</td>" +
      "<td>" +
      propertyArray[3] +
      "</td>" +
      "<td>" +
      propertyArray[4] +
      "</td>" +
      "<td>" +
      propertyArray[5] +
      "</td>" +
      "<td>" +
      propertyArray[6] +
      "</td>" +
      "</tr>"
  );
}

$("#pro-add").click(function () {
  const proId = $("#pro-id").val();
  const ageId = $("#pro-age-id").val();
  const type = $("#property-type").val();
  const proAddress = $("#pro-address").val();
  const price = $("#price").val();
  const perches = $("#perches").val();
  const status = "Available";

  const propertyArray = [
    proId,
    ageId,
    type,
    proAddress,
    price,
    perches,
    status,
  ];

  if (checkValidation()) {
    addProperty(proId, ageId, type, proAddress, price, perches, status);
    reloadTable(propertyArray);
    setPropertyID();
    swal("Confirmation!", "New Property Added Successful!", "success");
  }
});

$("#pro-update").click(function () {
  const proId = $("#pro-id").val();

  const index = getAllProperties().findIndex(
    (property) => property.proId === proId
  );

  if (index !== -1) {
    const updatedProperty = {
      proId: proId,
      ageId: $("#pro-age-id").val(),
      type: $("#property-type").val(),
      proAddress: $("pro-address").val(),
      price: $("#price").val(),
      perches: $("#perches").val(),
      status: "Available",
    };

    if (checkValidation()) {
      swal({
        title: "Are you sure?",
        text: "Do you want to update this property details!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willUpdate) => {
        if (willUpdate) {
          updateProperty(index, updatedProperty);
          updateTable(index, updatedProperty);
          swal("Confirmation! Your property details has been updated!", {
            icon: "success",
          });
        }
      });
    }
  } else {
    swal("Information!", "Property Not Found!", "info");
  }
});

$("#pro-search").click(function () {
  const proId = $("#pro-id").val();

  const index = getAllProperties().findIndex(
    (property) => property.proId === proId
  );

  if (index !== -1) {
    const property = getAllProperties()[index];
    $("#pro-age-id").val(property.ageId.trim());
    $("#property-type").val(property.type.trim());
    $("#pro-address").val(property.proAddress.trim());
    $("#price").val(property.price.trim());
    $("#perches").val(property.perches.trim());
    stopForeignKeyLoad();
    setTimeout(startForeignKeyLoad, 20000);
  } else {
    swal("Information!", "Property Not Found!", "info");
  }
});

$("#pro-delete").click(function () {
  const proId = $("#pro-id").val();

  const index = getAllProperties().findIndex(
    (property) => property.proId === proId
  );

  if (index !== -1) {
    swal({
      title: "Are you sure?",
      text: "Do you want to delete this property!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteProperty(index);
        const tbody = $("#pro-tbl");
        tbody.empty();
        loadAllProperties(getAllProperties());
        swal("Confirmation! Your property has been deleted!", {
          icon: "success",
        });
      }
    });
  } else {
    swal("Information!", "Property Not Found!", "info");
  }
});

function checkValidation() {
  const property = {
    proId: $("#pro-id").val(),
    ageId: $("#pro-age-id").val(),
    proType: $("#property-type").val(),
    proAddress: $("#pro-address").val(),
    price: $("#price").val(),
    perches: $("#perches").val(),
  };
  return validateProperty(property);
}
