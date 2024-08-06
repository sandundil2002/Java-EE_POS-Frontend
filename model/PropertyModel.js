const backendUrl =
  "http://localhost:8080/Elite_Real_Estate_POS_Backend_war_exploded/property";
export async function getAllProperties() {
  try {
    const response = await fetch(backendUrl);
    if (!response.ok) throw new Error("Failed to fetch properties");

    const data = await response.json();
    const properties = data.properties;
    const supplierIds = data.supplierIds;

    return { properties, supplierIds };
  } catch (error) {
    console.error(error);
    return { properties: [], supplierIds: [] };    
  }
}

export function addProperty(
  proId,
  ageId,
  type,
  proAddress,
  price,
  perches,
  status
) {
  const newProperty = {
    proId: proId,
    ageId: ageId,
    type: type,
    proAddress: proAddress,
    price: price,
    perches: perches,
    status: status,
  };
  Properties.push(newProperty);
}

export function updateProperty(index, updatedProperty) {
  Properties[index] = updatedProperty;
}

export function deleteProperty(index) {
  Properties.splice(index, 1);
}

export function validateProperty(property) {
  const proIdPattern = /^P\d{3}$/;
  const ageIdPattern = /^S\d{3}$/;
  const proType = /^[A-Za-z\s,.'-]+$/;
  const addressPattern = /^[A-Za-z0-9\s,.'-]+$/;
  const pricePattern = /^\d{5}$/;
  const perchesPattern = /^\d{2}$/;

  const isProIdValid = proIdPattern.test(property.proId);
  const isAgeIdValid = ageIdPattern.test(property.ageId);
  const isProTypeValid = proType.test(property.proType);
  const isAddressValid = addressPattern.test(property.proAddress);
  const isPriceValid = pricePattern.test(property.price);
  const isPerchValid = perchesPattern.test(property.perches);

  if (!isProIdValid) {
    swal({
      title: "Warning!",
      text: "Invalid Property ID!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!isAgeIdValid) {
    swal({
      title: "Warning!",
      text: "Please Input Valid Supplier ID!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!isProTypeValid) {
    swal({
      title: "Warning!",
      text: "Please Input Valid Property Type!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!isAddressValid) {
    swal({
      title: "Warning!",
      text: "Please Input Valid Property Address!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!isPriceValid) {
    swal({
      title: "Warning!",
      text: "Please Input Valid Property Price!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!isPerchValid) {
    swal({
      title: "Warning!",
      text: "Please Input Valid Property Perches!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  return true;
}
