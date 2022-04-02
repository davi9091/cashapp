import { NewFundBody } from './types';
import { IUserDoc } from './../models/user';
import { Fund } from "./../models/fund";
import HttpStatusCode from "http-status-codes";
import { Router } from "express";

export const fundsRouter = Router();

fundsRouter.get("/funds", async (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  const user = req.user as IUserDoc;

  if (!isAuthenticated || !user) {
    return res.status(HttpStatusCode.UNAUTHORIZED);
  }

  try {
    const funds = await Fund.find({ ['owner._id']: user._id });
    if (!funds) {
      res.status(HttpStatusCode.NOT_FOUND);
    }

    res.status(HttpStatusCode.OK).send(funds);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error);
  }
});

fundsRouter.put("/funds/new", async (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  const user = req.user;

  if (!isAuthenticated || !user) {
    return res.status(HttpStatusCode.UNAUTHORIZED);
  }

  const fundBody: NewFundBody = req.body

  try {
    const newFund = new Fund({
      owner: user,
      ...fundBody,
    })

    const savedFund = await newFund.save();
    return res.status(HttpStatusCode.OK).send(savedFund);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(error);
  }
})