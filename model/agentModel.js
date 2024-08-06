const backendUrl =
  "http://localhost:8080/Elite_Real_Estate_POS_Backend_war_exploded/supplier";

export async function getAllAgents() {
  try {
    const response = await fetch(backendUrl);
    if (!response.ok) throw new Error("Failed to fetch agents");

    const data = await response.json();
    const agents = data.suppliers;
    const adminIds = data.adminIds;

    return { agents, adminIds };
  } catch (error) {
    console.error("Error fetching agents:", error);
    return { agents: [], adminIds: [] };
  }
}

export async function addAgent(
  supId,
  admId,
  name,
  address,
  mobile,
  email
) {
  const newAgent = {
    supId: supId,
    admId: admId,
    name: name,
    address: address,
    mobile: mobile,
    email: email,
  };

  try {
    const response = fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAgent),
    });

    if (!response.ok) throw new Error("Failed to add agent");
    const supplier = await response.json();
    return supplier;
  } catch (error) {
    console.error("Error adding agent:", error);
    
  }
}

export async function updateAgent(supId, updatedAgent) {
  try {
    const response = await fetch(`${backendUrl}/${supId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAgent),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error("Failed to update agent");
    }

    const agent = await response.json();
    return agent;
  } catch (error) {
    console.error("Error updating agent:", error);
    throw error;
  }
}

export function deleteAgent(index) {
  Agents.splice(index, 1);
}

export function validateAgent(agent) {
  const ageIdPattern = /^S\d{3}$/;
  const adminIdPattern = /^[A-Za-z0-9-]+$/;
  const namePattern = /^[A-Za-z\s]+$/;
  const addressPattern = /^[A-Za-z0-9\s,.'-]+$/;
  const mobilePattern = /^\d{10}$/;
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isAgentIdValid = ageIdPattern.test(agent.ageId);
  const isAdminIdValid = adminIdPattern.test(agent.admId);
  const isNameValid = namePattern.test(agent.ageName);
  const isAddressValid = addressPattern.test(agent.ageAddress);
  const isMobileValid = mobilePattern.test(agent.ageMobile);
  const isEmailValid = emailPattern.test(agent.ageEmail);

  if (!isAgentIdValid) {
    swal({
      title: "Warning!",
      text: "Invalid Agent ID!",
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
      text: "Invalid Supplier Name!",
      icon: "error",
      button: "Try Again!",
    });
    return false;
  }

  if (!isAddressValid) {
    swal({
      title: "Warning!",
      text: "Invalid Address!",
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
