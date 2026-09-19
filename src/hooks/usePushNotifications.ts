"use client";

import { useState, useCallback, useRef } from "react";

export const usePushNotifications = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscribing, setSubscribing] = useState(false);
    const isSubscribingRef = useRef(false);

    const subscribeToPush = useCallback(async (isAuto = false) => {
        if (typeof window === "undefined") return;

        // If auto-subscribing and already synced in this session, skip to prevent server flooding
        if (isAuto && sessionStorage.getItem("push_subscribed_session") === "true") {
            setIsSubscribed(true);
            return;
        }

        if (isSubscribingRef.current) return;

        if ("Notification" in window && Notification.permission === "denied") {
            if (!isAuto) {
                alert("Notifications are blocked in your browser settings. Please click the lock icon in the address bar and set Notifications to 'Allow' or 'Reset' to continue.");
            }
            return;
        }

        isSubscribingRef.current = true;
        setSubscribing(true);
        try {
            if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
                if (isAuto) return;
                throw new Error("VAPID Public Key not found");
            }

            if (!("serviceWorker" in navigator)) return;

            const registration = await Promise.race([
                navigator.serviceWorker.ready,
                new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Service Worker timeout")), 5000))
            ]) as ServiceWorkerRegistration;

            let subscription = await registration.pushManager.getSubscription();

            if (!subscription) {
                subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                });
            }

            if (subscription) {
                await fetch("/api/push/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ subscription }),
                });

                sessionStorage.setItem("push_subscribed_session", "true");
                setIsSubscribed(true);
                if (!isAuto) alert("Notifications enabled!");
            }
        } catch (err: any) {
            console.error("Failed to subscribe:", err);
            if (!isAuto) alert(`Failed to enable notifications: ${err.message || "Unknown error"}`);
        } finally {
            isSubscribingRef.current = false;
            setSubscribing(false);
        }
    }, []);

    return { isSubscribed, subscribing, subscribeToPush };
};
