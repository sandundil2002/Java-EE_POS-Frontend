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

export async function addProperty(
  proId,
  supId,
  type,
  address,
  price,
  perches,
  status
) {
  const newProperty = {
    proId: proId,
    supId: supId,
    type: type,
    address: address,
    price: price,
    perches: perches,
    status: status,
  };

  try {
    const response = fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProperty),
    });

    if (!response.ok) throw new Error(`Failed to add property`);
    const property = await response.json();
    return property;
  } catch (error) {
    console.error(error);
  }
}

export async function updateProperty(proId, updatedProperty) {
  try {
    const response = await fetch(`${backendUrl}/${proId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProperty),
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const error = await response.json();
        errorMessage = error.error || "Failed to update property";
        console.error(error);
      } catch (err) {
        errorMessage = "Failed to update property";
        console.error(err);
      }
      throw new Error(errorMessage);
    }
    
    return;
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
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
