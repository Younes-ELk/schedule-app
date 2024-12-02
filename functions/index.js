const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure Nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "lpnlpn308@gmail.com", // Your Gmail address
        pass: "lluc fbge yycw mcav", // App Password from Gmail
    },
});

// Function to send email reminders
exports.sendEmailReminder = functions.pubsub.schedule("every day 09:00").onRun(async (context) => {
    const db = admin.firestore();
    const today = new Date()
        .toISOString()
        .split("T")[0]; // Format: YYYY-MM-DD

    try {
        // Fetch schedules for today
        const snapshot = await db
            .collection("schedules")
            .where("date", "==", today)
            .get();

        if (snapshot.empty) {
            console.log("No schedules found for today.");
            return null;
        }

        // Loop through schedules and send emails
        snapshot.forEach((doc) => {
            const schedule = doc.data();
            const userEmail = schedule.email; // Ensure email is stored with schedules

            const mailOptions = {
                from: "your-email@gmail.com", // Your Gmail address
                to: userEmail,
                subject: `Reminder: ${schedule.title}`,
                text: `You have a schedule today at ${schedule.time}.\n\nDescription: ${schedule.description}`,
                html: `<strong>You have a schedule today at ${schedule.time}.</strong><br/><p>Description: ${schedule.description}</p>`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error.message);
                } else {
                    console.log(`Email sent to ${userEmail}: ${info.response}`);
                }
            });
        });

        return null;
    } catch (error) {
        console.error("Error fetching schedules or sending emails:", error.message);
        return null;
    }
});
