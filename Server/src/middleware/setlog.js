function setupLogging() {
    console.log("process.env.NODE_ENV",process.env.NODE_ENV);
   
    if (process.env.NODE_ENV === 'development') {
        // Enable console.log only in development
        global.console.log = (...args) => {
            // You can add extra formatting here if needed
            process.stdout.write('[DEV LOG]: ');
            console.info(...args);  // Use console.info for better formatting in logs
        };
    } else {
        // Disable or change the behavior for production (optional)
        global.console.log = () => {};  // No-op in production, so logs are suppressed
    }
}
 
module.exports = { setupLogging };
 