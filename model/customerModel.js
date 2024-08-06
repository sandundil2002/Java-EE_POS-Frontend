const backendUrl =
  "http://localhost:8080/Elite_Real_Estate_POS_Backend_war_exploded/customer";

export async function getAllCustomers() {
  try {
    const response = await fetch(backendUrl);
    if (!response.ok)
      throw new Error("Failed to fetch customers and appointment IDs.");

    const data = await response.json();
    console.log("Response data:", data);

    const customers = data.customers;
    const appointmentIds = data.appointments;

    return { customers, appointmentIds };
  } catch (error) {
    console.error(error);
    return { customers: [], appointmentIds: [] };
  }
}


export async function addCustomer(
  cusId,
  appId,
  name,
  address,
  mobile,
  email
) {
  const newCustomer = {
    cusId: cusId,
    appId: appId,
    name: name,
    address: address,
    mobile: mobile,
    email: email,
  };

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCustomer),
    });

    if (!response.ok) throw new Error("Failed to add customer.");
    const customer = await response.json();
    return customer;
  } catch (error) {
    console.error(error);    
  }
}

export async function updateCustomer(cusId, updatedCustomer) {
  try {
    const response = await fetch(`${backendUrl}/${cusId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedCustomer),
    });

    if (!response.ok){
      const errorText = await response.text();
      throw new Error(`Failed to update customer: ${errorText}`);
    }

    const customer = await response.json();
    return customer;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function deleteCustomer(index) {
  Customers.splice(index, 1);
}

export function validateCustomer(customer) {
  const cusIdPattern = /^C\d{3}$/;
  const appIdPattern = /^[A-Za-z0-9-]+$/;
  const cusNamePattern = /^[A-Za-z\s]+$/;
  const addressPattern = /^[A-Za-z0-9\s,.'-]+$/;
  const cusMobilePattern = /^\d{10}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isCusIdValid = cusIdPattern.test(customer.cusId);
  const isAppIdValid = appIdPattern.test(customer.appId);
  const isCusNameValid = cusNamePattern.test(customer.name);
  const isAddressValid = addressPattern.test(customer.address);
  const isCusMobileValid = cusMobilePattern.test(customer.mobile);
  const isEmailValid = emailPattern.test(customer.email);

  if (!isCusIdValid) {
    swal({
      title: "Warning!",
      text: "Invalid Customer ID!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!isAppIdValid) {
    swal({
      title: "Warning!",
      text: "Please Input Valid Appointment ID!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!isCusNameValid) {
    swal({
      title: "Warning!",
      text: "Invalid Customer Name!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!isAddressValid) {
    swal({
      title: "Warning!",
      text: "Invalid Customer Address!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!isCusMobileValid) {
    swal({
      title: "Warning!",
      text: "Invalid Mobile Number!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!isEmailValid) {
    swal({
      title: "Warning!",
      text: "Invalid Email Address!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }
  return true;
}
