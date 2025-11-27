import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { CONFIG_APP } from "@/config/environment.config";

const app = !getApps().length ? initializeApp(CONFIG_APP.firebase) : getApp();
const db = getFirestore(app);

export { app, db };
