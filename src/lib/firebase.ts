import { CONFIG_APP } from "@/config/environment.config";
import { getFirestore } from "firebase/firestore";
import { initializeApp, getApps, getApp } from "firebase/app";

const app = !getApps().length ? initializeApp(CONFIG_APP.firebase) : getApp();
const db = getFirestore(app);

export { app, db };
