"use client";

import { useState } from "react";

export const usePushNotifications = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribing, setSubscribing] = useState(false);

    const subscribeToPush = async (isAuto = false) => {
        if ("Notification" in window && Notification.permission === "denied") {
            if (!isAuto) {
                alert("Notifications are blocked in your browser settings. Please click the lock icon in the address bar and set Notifications to 'Allow' or 'Reset' to continue.");
            }
            return;
        }

        setSubscribing(true);
        try {
            if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
                if (isAuto) return;
                throw new Error("VAPID Public Key not found");
            }

            console.log("Waiting for Service Worker...");
            const registration = await Promise.race([
                navigator.serviceWorker.ready,
                new Promise((_, reject) => setTimeout(() => reject(new Error("Service Worker timeout")), 5000))
            ]) as ServiceWorkerRegistration;

            console.log("SW Ready. Subscribing...");
            // Use existing subscription if available or create new one
            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                });
            }

            console.log("Sending subscription to server...");
            await fetch("/api/push/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subscription }),
            });

            setIsSubscribed(true);
            if (!isAuto) alert("Notifications enabled!");
        } catch (err: any) {
            console.error("Failed to subscribe:", err);
            if (!isAuto) alert(`Failed to enable notifications: ${err.message || "Unknown error"}`);
        } finally {
            setSubscribing(false);
        }
    };

    return { isSubscribed, subscribing, subscribeToPush };
};
