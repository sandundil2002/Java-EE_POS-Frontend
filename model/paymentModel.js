import { Payments, Properties, Customers, Appointments } from "../db/db.js";

export function getAllPayments() {
  return Payments;
}

export function addPayment(payment) {
  Payments.push(payment);
}

export function getAllProperties() {
  return Properties;
}

export function getAllCustomers() {
  return Customers;
}

export function getAllApointments() {
  return Appointments;
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
