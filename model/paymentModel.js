const backendUrl =
  "http://localhost:8080/Elite_Real_Estate_POS_Backend_war_exploded/payment";

export async function getAllPaymentDetails() {
  try {
    const response = await fetch(backendUrl);
    if (!response.ok) throw new Error("Failed to fetch payments");

    const data = await response.json();

    const customers = data.customers;
    const paymentId = data.paymentId;
    const properties = data.properties;

    console.log("paymentId", paymentId);
    console.log("properties", properties);
    console.log("customers", customers);    

    return { customers, paymentId, properties };
  } catch (error) {
    console.error(error);
    return { customers: [], paymentId: [], properties: [] };
  }
}

export function addPayment(payment) {
  Payments.push(payment);
}

export function updatePropertyStatus(proId, status) {
  const property = Properties.find((prop) => prop.proId === proId);
  property.status = status;
}

export function updateAppointmentStatus(appId, status) {
  const appointment = Appointments.find((appo) => appo.appId === appId);
  appointment.status = status;
}

export function findAppointmentIdByCustomerName(customerName) {
  const appointment = Appointments.find((appo) => appo.name === customerName);
  return appointment.appId;
}
