import { Appointments } from "../db/db.js";

export function getAllAppointments() {
  return Appointments;
}

export function addAppointment(appId, adminId, name, mobile, dateTime) {
  const newAppointment = {
    appId: appId,
    adminId: adminId,
    name: name,
    mobile: mobile,
    dateTime: dateTime,
  };
  Appointments.push(newAppointment);
}

export function updateAppointment(index, updatedAppointment) {
  Appointments[index] = updatedAppointment;
}

export function deleteAppointment(index) {
  Appointments.splice(index, 1);
}

export function validateAppointment(appointment) {
  const appIdPattern = /^A\d{3}$/;
  const adminIdPattern = /^[A-Za-z0-9-]+$/;
  const namePattern = /^[A-Za-z\s]+$/;
  const mobilePattern = /^\d{9}$/;
  const dateTimePatten = /^\d{4}/;

  const isAppIdValid = appIdPattern.test(appointment.appId);
  const isAdminIdValid = adminIdPattern.test(appointment.adminId);
  const isNameValid = namePattern.test(appointment.name);
  const isMobileValid = mobilePattern.test(appointment.mobile);
  const isDateTime = dateTimePatten.test(appointment.dateTime);

  if (!isAppIdValid) {
    swal({
      title: "Warning!",
      text: "Invalid Appointment ID!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!isAdminIdValid) {
    swal({
      title: "Warning!",
      text: "Please Input Admin ID!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!isNameValid) {
    swal({
      title: "Warning!",
      text: "Invalid Customer Name!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!isMobileValid) {
    swal({
      title: "Warning!",
      text: "Invalid Mobile Number!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!isDateTime) {
    swal({
      title: "Warning!",
      text: "Please Input Date & Time!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }
  return true;
}
