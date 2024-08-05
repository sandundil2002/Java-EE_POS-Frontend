const backendUrl =
  "http://localhost:8080/Elite_Real_Estate_POS_Backend_war_exploded/appointment";

export async function addAppointment(
  appId,
  admId,
  cusName,
  cusMobile,
  dateTime
) {
  const newAppointment = {
    appId: appId,
    admId: admId,
    cusName: cusName,
    cusMobile: cusMobile,
    dateTime: dateTime,
  };

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAppointment),
    });

    if (!response.ok) throw new Error("Failed to add appointment");
    const appointment = await response.json();
    return appointment;
  } catch (error) {
    console.error(error);
  }
}

export function getAllAppointments() {
  return Appointments;
}

export async function updateAppointment(appId, updatedAppointment) {
  try {
    const response = await fetch(`${backendUrl}/${appId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAppointment),
    });
    if (!response.ok) throw new Error("Failed to update appointment");
    const appointment = await response.json();
    return appointment;
  } catch (error) {
    console.error(error);
  }
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
  const isAdminIdValid = adminIdPattern.test(appointment.admId);
  const isNameValid = namePattern.test(appointment.cusName);
  const isMobileValid = mobilePattern.test(appointment.cusMobile);
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
