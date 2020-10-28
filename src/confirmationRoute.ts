import { ConfirmationService } from "./services/ConfirmationService";
import * as express from "express";
import Container from "typedi";

const router = express.Router();

router.get("/user/confirm/?:token", (req, res) => {
  const token = req.params.token;
  const ser = Container.get(ConfirmationService);
  ser
    .confirmUser(token)
    .then((data) => {
      console.log(data);
      res.json({ status: 200, data });
    })
    .catch((err) => {
      res.json({ status: 500, errror: err.message });
    });
});

export default router;
