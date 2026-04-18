import { useEffect } from 'react';

const Chatbot = () => {
    useEffect(() => {
        // Create the script element
        const script = document.createElement('script');
        script.src = "https://www.chatbase.co/embed.min.js";
        script.setAttribute("chatbotId", "JQaGNtYcqgUk975d8at6B"); // Replace with your real ID
        script.setAttribute("domain", "www.chatbase.co");
        script.defer = true;

        // Add the script to the page
        document.body.appendChild(script);

        // Cleanup: Remove the chatbot when the user leaves the home page
        return () => {
            const botElement = document.getElementById("chatbase-bubble-window");
            if (botElement) botElement.remove();
            script.remove();
        };
    }, []);

    return null; // This component doesn't render any HTML itself
};

export default Chatbot;