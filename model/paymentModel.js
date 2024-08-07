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

    return { customers, paymentId, properties };
  } catch (error) {
    console.error(error);
    return { customers: [], paymentId: [], properties: [] };
  }
}

export async function addPayment(payments) {
  console.log(payments);
  
  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payments),
    });

    if (!response.ok) throw new Error("Failed to add payment");
    const payment = await response.json();
    return payment;
  } catch (error) {
    console.error(error);
    throw error;
  }
}