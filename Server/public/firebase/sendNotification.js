// ------- Send Notification ---------------
export async function sendNotification(payload) {
    try {
        const response = await fetch("/get-token");

        if (!response) {
            throw new Error("Token not found or other error");
        }

        const token = await response.text();

        if (token) {
            const response = await fetch("/send-notification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, payload }),
            });
            const result = await response.json();
        } else {
            console.error("No token available");
        }
    } catch (error) {
        console.error("Error fetching token:", error);
    }
}


