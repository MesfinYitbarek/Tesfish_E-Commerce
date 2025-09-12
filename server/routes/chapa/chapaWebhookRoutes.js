import { chapaWebhook } from "../../controllers/chapa/chapaWebhook";


router.post("/chapa/webhook", express.json(), chapaWebhook);
